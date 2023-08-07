const { ObjectID } = require('bson')
const client= require('../services/db')
const ObjectId=require('mongodb').ObjectId
const Resolver = require('../services/resolver')



function calculatePoints( kid, startTime, endTime){
   
let hours = []


let kidToInt = parseInt(kid)
let startToInt = parseInt(startTime)
let endToInt = parseInt(endTime)

for(var i = startToInt; i < endToInt; i++ ){
    hours.push(startToInt)
    startToInt = startToInt + 1
}

    let beforeTen = 0
    let afterTen = 0
    let beforeTenPoints = 0
    let afterTenPoints = 0

    for (var i = 0; i < hours.length; i++){

        if( hours[i] < 22 ) beforeTen = beforeTen + 1 //2
        else afterTen = afterTen + 1 //2
    }
    if(kidToInt === 1) {
         beforeTenPoints = beforeTen * kidToInt
         afterTenPoints = afterTen * 1.5
        return beforeTenPoints + afterTenPoints
    }
    else if (kidToInt === 2){
        beforeTenPoints = beforeTen * 1.5 //3
        afterTenPoints = afterTen * 2.25 //4.5
        return beforeTenPoints + afterTenPoints //7.5
    }
    else if (kidToInt === 3){
        beforeTenPoints = beforeTen * 2
        afterTenPoints = afterTen * 3
        return beforeTenPoints + afterTenPoints
    } 
  
}

module.exports = {

postSitting: async (req, res) =>{

const resolver = Resolver()
try {
   

const qtyKids = req.body.qtyKids
const date = req.body.date
const startTime = req.body.startTime
const endTime = req.body.endTime
const description = req.body.description
const id = new ObjectID(req.user)

const points = calculatePoints(qtyKids, startTime, endTime)


const sit= {

requiredBy: id,
qtyKids,
date,
startTime,
endTime,
description,
completed: false,
carriedBy: null,
candidate: null,
points
}
await client.connect()
const insertedSit = await client.db('wkkerpark').collection('sits').insertOne(sit)
console.log(insertedSit)
if(insertedSit.acknowledged !== true) return resolver.internalServerError(insertedSit, 'could_not_insert')
return resolver.success(insertedSit, 'sit_inserted')
} 
  catch (error) {
      console.log(error)
      if(error instanceof Error){
        return resolver.internalServerError(error, error.message)
      }
  }
  
},

getSits: async (req, res) => {
    const resolver = Resolver(res)
    try {
       
        await client.connect()
        
      const userSitPost =  await client.db('wkkerpark').collection('sits').aggregate(
          
        [
        {$match: {completed : false}},
         { 
       
        $lookup:{
            from: 'users',
            localField: 'requiredBy',
            foreignField: '_id',
            as : 'user'
        } }
        ]).toArray()
        if(userSitPost.length < 1) return resolver.success(userSitPost, 'no_sits_found')
        console.log('this is the agregation',userSitPost)
        resolver.success(userSitPost, 'sits_found')
    } 
    
    catch (error) {
        console.log(error)
        if(error instanceof Error) return resolver.internalServerError(error, error.message)
    }
    
},
getSitsByUserId: async (req, res) => {
    const resolver = Resolver(res)
    try {
        const userId = new ObjectId(req.user)
        await client.connect()

        const sitsByUserId = await client.db('wkkerpark').collection('sits').find(
            {requiredBy : userId}).toArray()
        if(sitsByUserId.length < 1) return resolver.success(sitsByUserId, 'no_sits_found')
        return resolver.success(sitsByUserId, 'user_sits_found')
       
    } 
    catch (error) {
        console.log(error)
        if(error instanceof Error){
            return resolver.internalServerError(error, error.message)
        }
    }
    finally{
      //  client.close()
    }
},
 insertCandidate: async (req, res) =>{
    const resolver= Resolver(res)
    try {

        const  candidateId = new ObjectID(req.user)
        const sitId = new ObjectID(req.params.sitId)
        const candidateName = req.body.name
        console.log(candidateName)

        await client.connect()
        const insertCandidate = await client.db('wkkerpark').collection('sits').updateOne(
            {_id : sitId}, {$addToSet: {candidate : {candidateId, candidateName, isSelected:false}}}
        ) 
        if(insertCandidate.acknowledged !== true && insertCandidate.modifiedCount !== 1) return resolver.internalServerError(insertCandidate, 'could_not_update_candidate')
        if(insertCandidate.acknowledged === true && insertCandidate.modifiedCount === 1) return resolver.success(insertCandidate, 'candidate_updated') 
    } 
    catch (error) {
      console.log(error)  
      if(error instanceof Error){
        return resolver.internalServerError(error, error.message)
      }
    }
},


assignSitToCandidate : async (req, res) =>{
    const resolver = Resolver(res)
    try {
      
       const sitId = new ObjectID(req.params.sitId)
       const carriedById = new ObjectID(req.body.candidateId)
       const carriedByName = req.body.candidateName
       await client.connect()
       const updateCarriedBy = await client.db('wkkerpark').collection('sits').updateOne(
           {_id : sitId}, {$set : {carriedBy : {carriedById, carriedByName}}} 
       )
       console.log(updateCarriedBy)
       if (updateCarriedBy.acknowledged === true && updateCarriedBy.modifiedCount === 1){
        return resolver.success(updateCarriedBy, 'sit was succesfully asigned')
       }
       else{
        return resolver.internalServerError(updateCarriedBy, 'could_not_assign_sit')
       }
       
    } catch (error) {
        if(error instanceof Error){
            return resolver.internalServerError(error, error.message)
        }
   }
},



completedSit : async (req, res )=>{
    const resolver = Resolver(res)
try {
    const sitId = new ObjectID( req.body.sitId) 
    const requestedById = ObjectID(req.user)
    const requestedByPoints = req.body.point
    const carriedById = new ObjectID(req.body.carriedById)
    const sitPoints = req.body.sitPoints
    const reducedPoints = requestedByPoints - sitPoints
    
    
   
    await client.connect()
    const findCarriedByUser = await client.db('wkkerpark').collection('users').findOne({_id : carriedById})
    const carriedByPoints = findCarriedByUser.point
    console.log(carriedByPoints)
     const addedPoints = carriedByPoints + sitPoints
   

     const sitStatusToCompleted = await client.db('wkkerpark').collection('sits').updateOne(
        {_id : sitId}, {$set : {completed : true }}
    )  
     const assignPoints = await client.db('wkkerpark').collection('users').updateOne(
        {_id : carriedById}, {$set : {point : addedPoints}}
    ) 
      const takeOffPoints = await client.db('wkkerpark').collection('users').updateOne(
        { _id : requestedById}, {$set : {point : reducedPoints}}
    )    
   
      
    if(sitStatusToCompleted.modifiedCount===1 && assignPoints.modifiedCount===1 && takeOffPoints.modifiedCount===1){
        return resolver.success({sitStatusToCompleted, assignPoints, takeOffPoints}, 'success')
    }
      
    
    
} 
catch (error) {
   console.log(error) 
   if(error instanceof Error){
    return resolver.internalServerError(error, error.message)
   }
}

}

}




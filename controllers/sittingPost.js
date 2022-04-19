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
   
await client.connect()
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
const insertedSit = await client.db('wkkerpark').collection('sits').insertOne(sit)
console.log(insertedSit)
     
  } 
  catch (error) {
      console.log(error)
  }
  finally{
       client.close()
  }
    },

getSits: async (req, res) => {
    try {
        const resolver = Resolver(res)
        await client.connect()
        
      const userSitPost =  await client.db('wkkerpark').collection('sits').aggregate([
         { 
       
        $lookup:{
            from: 'users',
            localField: 'requiredBy',
            foreignField: '_id',
            as : 'user'
        } }
        ]).toArray()
        console.log('this is the agregation',userSitPost)
        resolver.success(userSitPost, 'all the sit post and the user info')
    } 
    
    catch (error) {
        console.log(error)
    }
    finally{
       // await client.close()
    }
},
getSitsByUserId: async (req, res) => {
    try {
        //const userId = new ObjectId(req.user)
        console.log(req.user)
        await client.connect()

        const sitsByUserId = await client.db('wkkerpark').collection('sits').find(
            {requiredBy : req.user}).toArray()
        res.send(sitsByUserId)
    } 
    catch (error) {
        console.log(error)
    }
    finally{
        client.close()
    }
}
}
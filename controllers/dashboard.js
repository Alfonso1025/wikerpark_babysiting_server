const client= require('../services/db')
const ObjectId=require('mongodb').ObjectId
const s3= require('../services/s3Connect')
const Resolver = require('../services/resolver')

module.exports={
getUser: async(req,res)=>{
try {
    const resolver = Resolver(res)
    const userId = req.user
    const id = ObjectId(userId)
    await client.connect()
    const user = await client.db("wkkerpark").collection("users").findOne({_id:id})
    resolver.success(user, 'user found')
  } 
catch (error) {
    console.log(error)
  }
   finally{
       // client.close()
   }
   
 },
 uploadBackground:async(req, res)=>{
  const resolver = Resolver(res)
   try {
     if(req.file === undefined) return resolver.badRequest(null, 'missing_file')
     if(req.params.id === undefined) return resolver.badRequest(null, 'missing_id')
  
     const result= await s3.upload(req.file, req.params.id)
     console.log(result)
     if(result.Bucket === 'backgroundcheck' && result.Key){
        console.log('file uploaded')
        const id = ObjectId(req.params.id)
        await client.connect()
        const updateQuery= await client.db('wkkerpark').collection('users').updateOne(
          {_id: id}, 
          { $set: { "isBackgroundUploaded": true } } 
        )
        if(updateQuery.acknowledged == false || updateQuery.matchedCount!=1 && updateQuery.modifiedCount!=1) return resolver.internalServerError(updateQuery, 'error_updating_isBackgroundUploaded')
        return resolver.success(result, 'file_uploaded')
    }
    else{
      return resolver.internalServerError(result, 'could_not_upload_file')
    }
   } 
   catch (error) {
     console.log(error)
     return resolver.internalServerError(error, error.message)
   }
 },
 getFormInfofromUser: async (req, res)=>{

  const resolver = Resolver(res)

  try {
      const address = req.body.address
      console.log(req.body)
      const kids = req.body.kidsArray // array of objects [{id:1, name: juan, age:3}, {id:2, name: martin, age:2}]
      
      const userId = req.user
    
      const id = new ObjectId(userId)
      
      await client.connect()
      const updateAddress = await client.db('wkkerpark').collection('users').updateOne(
          {_id:id}, {$set:{address}}
      )
      if(updateAddress.acknowledged == false || updateAddress.matchedCount!=1&&updateAddress.modifiedCount!=1) return resolver.internalServerError(updateAddress, 'error_updating_address')
      console.log('adressUpdated')
      const updateKids = await client.db('wkkerpark').collection('users').updateOne(
          {_id:id}, {$set:{kids}}
      )
      if(updateKids.acknowledged == false || updateKids.matchedCount!=1 && updateKids.modifiedCount!=1) return resolver.internalServerError(updateKids, 'error_updating_kids')
      
      return resolver.success({updateAddress, updateKids}, 'form_sent_succesfully')
  } 
  catch (error) {
      console.log(error)
      return resolver.internalServerError(error, error.message)
  }
  finally{
      client.close()
  }
},

isCleared: async (req, res) => {
  try {
    const resolver = Resolver(res)
    const userId = req.user
    const id = ObjectId(userId)
   
    await client.connect()
    const user = await client.db('wkkerpark').collection('users').findOne({_id:id})
    
    if (user.isCleared == false) return resolver.success(false, 'user nor cleared')
    return resolver.success(true, 'user is cleared')
    

  } 
  catch (error) {
    console.log(error)
  }
},
addNewField : async (req, res) =>{
  await client.connect()
  const query = await client.db('wkkerpark').collection('users').updateMany(
    {},
    { $set: { "isBackgroundUploaded": false } } 
  )
  
}
}
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
   try {
     console.log('hello world')
     const result= await s3.upload(req.file, req.params.id)
     console.log(result)
     res.send(result)
     
   } 
   catch (error) {
     console.log(error)
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
      console.log(updateAddress)
      const updateKids = await client.db('wkkerpark').collection('users').updateOne(
          {_id:id}, {$set:{kids}}
      )

  } 
  catch (error) {
      console.log(error)
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
}
}
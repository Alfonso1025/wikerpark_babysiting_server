const client= require('../services/db')
const ObjectId=require('mongodb').ObjectId
const s3= require('../services/s3Connect')
const Resolver = require('../services/resolver')


module.exports={
    getAdmin: async (req,res)=>{

        try {
        const resolver = Resolver(res)
        const adminId=req.user
        const id=new ObjectId(adminId)
        await client.connect()
        const admin=await client.db("wkkerpark").collection("admins").findOne({_id:id})
        return resolver.success(admin, 'admin found')
        console.log(admin)
        console.log(adminId)
        }
         catch (error) {
            console.log(error)
        }
        finally{

            client.close()
        }
    },
    getAllUsers: async(req, res)=>{
        try {
            await client.connect()
            const users= await client.db("wkkerpark").collection("users").find({}).toArray()
            res.send(users)
        } 
        catch (error) {
          console.log(error)  
        }
        finally{
            client.close()
        }
    },
    clearUser: async(req,res)=>{
        try {
            await client.connect()
            const cleared= await client.db("wkkerpark").collection("users").updateMany({},

            {$set:{point:0}})

            console.log(cleared)
            res.send(cleared)

        } catch (error) {
            console.log(error)
        }
        finally{
            client.close()
        }
        
    },
    getBackgroundCheck:async (req,res)=>{
        const readStream = await s3.streamToString(req.params.key)
        console.log(readStream)
        res.send(readStream)
      
       // readStream.pipe(res)
        
         
    }
}
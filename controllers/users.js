const client= require('../services/db')
const bcrypt=require('bcrypt')
const jwtGenerator=require('../services/jwtGenerator')
const Resolver = require('../services/resolver')

module.exports={
    
    registerUser:async(req,res)=>{
        try {
            const resolver = Resolver(res)
            const {userName, email, password}=req.body
            console.log(email)
            await client.connect()

            const existingUser= await client.db("wkkerpark").collection("users").find({email:email}).toArray()
            if(existingUser.length>0) return res.status(404).send('user already exist')

            const saltRound =10
            const salt= await bcrypt.genSalt(saltRound)
            const bcryptPassword= await bcrypt.hash(password, salt)

            const newUser = await client.db("wkkerpark").collection("users").insertOne({
                userName:userName,
                email:email,
                password:bcryptPassword 
            })
            
            const token = jwtGenerator(newUser.insertedId)
            resolver.success(token, "user was registered")

            
            
            
        } 
        catch (error) {
            console.log(error)
        }
        finally{
            await client.close()
        }
    },
    loginUser:async (req,res)=>{
        const resolver = Resolver(res)
        try {
            const {email,password} = req.body
            console.log(email)
            await client.connect()
            const user = await client.db("wkkerpark").collection("users").findOne({email:email})
            if(!user) return res.status(404).send('user does not exist in db')
            const token = jwtGenerator(user._id)
            return   resolver.success(token, user) 

        }   
        catch (error) {
            console.log(error) 
        }
        finally{
           await  client.close()
        }
    },
    isVerified:async(req,res)=>{
        try {
            return res.json(true)
        } 
        catch (error) {
            console.log(error)
        }
    }
}
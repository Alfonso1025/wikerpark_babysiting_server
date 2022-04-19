const client= require('../services/db')
const bcrypt = require('bcrypt')
const jwtGenerator = require('../services/jwtGenerator')
const Resolver = require('../services/resolver')

module.exports={
    
    registerAdmin:async(req,res)=>{
        try {
            const resolver = Resolver(res)
            const {adminName, email, password}=req.body
            console.log(adminName)
            await client.connect()

            const existingAdmin= await client.db("wkkerpark").collection("admins").find({email:email}).toArray()
            if(existingAdmin.length>0) return resolver.failed('user already exist', 'not found')

            const saltRound =10
            const salt= await bcrypt.genSalt(saltRound)
            const bcryptPassword= await bcrypt.hash(password, salt)

            const newAdmin = await client.db("wkkerpark").collection("admins").insertOne({
                adminName:adminName,
                email:email,
                password:bcryptPassword,
                isAdministrator: true
            })
            
            const token = jwtGenerator(newAdmin.insertedId)
            console.log(token)
           return  resolver.success(token, newAdmin)
            
            
            
        } 
        catch (error) {
            console.log(error)
        }
        finally{
            await client.close()
        }
    },
    loginAdmin:async (req,res)=>{
        try {
            const resolver = Resolver(res)
            const {email,password} = req.body
            console.log(email)
            await client.connect()
            const admin = await client.db("wkkerpark").collection("admins").findOne({email:email})
            if(!admin) return res.status(404).send('admin does not exist in db')
            const token = jwtGenerator(admin._id)
            return  resolver.success(token, admin)

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
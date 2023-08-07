const client= require('../services/db')
const bcrypt=require('bcrypt')
const jwtGenerator=require('../services/jwtGenerator')
const Resolver = require('../services/resolver')


module.exports={
    
    registerUser:async(req,res)=>{
          const  resolver = Resolver(res)
        try {
           
            const {userName, email, password} = req.body
            console.log('username', userName)
            await client.connect()
           const existingUser= await client.db("wkkerpark").collection("users").find({email:email}).toArray()
            if(existingUser.length>0) return resolver.conflict(null, 'user_already_exist')

            const saltRound =10
            const salt= await bcrypt.genSalt(saltRound)
            const bcryptPassword= await bcrypt.hash(password, salt)
            console.log('user does not exist')
            const newUser = await client.db("wkkerpark").collection("users").insertOne({
                userName:userName,
                email:email,
                password:bcryptPassword 
            }, 
            (error, result) => {
                if(error) return resolver.internalServerError(error, error.message)
                
                return resolver.success(result, 'new user inserted')
            }
            )    
            console.log(newUser)    
        } 
        catch (error) {
            console.log(error)
           
            return resolver.internalServerError('unexpected_error', error.message)
           
        }
        
    },
    loginUser:async (req,res)=>{
        
        const resolver = Resolver(res)
        try {
            const {email,password} = req.body
            console.log(email)
            await client.connect()
            const user = await client.db("wkkerpark").collection("users").findOne({email:email},
                async(error, result) =>{

                    if(error) return resolver.internalServerError(error, error.message)
                    if (result === null || result === undefined) return resolver.unauthorized(null, 'user_not_found')
                   
                    const validPassword = await bcrypt.compare(password, result.password)
                    if(!validPassword) return resolver.unauthorized(null, 'incorrect_password')

                    const token = jwtGenerator(result._id)
                    
                    return resolver.success({user : result, token}, 'user found and token produced') 
                })
            //if(!user) return res.status(404).send('user does not exist in db')
           // const token = jwtGenerator(user._id)
            //return   resolver.success(token, user) 

        }   
        catch (error) {
            console.log(error) 
        }
        
    },

    isVerified:async(req,res)=>{
        const resolver = Resolver(res)
        try {
           
            return resolver.success(true, 'user_authenticated')
        } 
        catch (error) {
            console.log(error)
            return resolver.internalServerError(error, error.message)
        }
    }
}
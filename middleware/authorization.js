const jwt=require('jsonwebtoken')
const Resolver = require('../services/resolver')
require('dotenv').config()

module.exports= async(req, res, next)=>{
     const resolver = Resolver(res)
     try {
        const jwtToken=req.header("token")
        
        
        if(!jwtToken) return resolver.forbiden(null, 'not_authorized') //res.status(403).json('not authorized')

        const payload= jwt.verify(jwtToken, process.env.jwtSecret)
       
        req.user=payload.user
        next();
    } catch (error) {
        console.error('from authorization middleware: ',error.message)
        return resolver.forbiden(error, error.message)//res.status(403).json('not authorized')
    } 
}
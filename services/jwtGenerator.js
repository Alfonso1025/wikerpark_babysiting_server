const jwt=require('jsonwebtoken')
require('dotenv').config()

function jwtGenerator(id){

    console.log('helloo')
    const payload={ user:id}
    return jwt.sign(payload,process.env.jwtSecret, {expiresIn:"10h"})
}

module.exports=jwtGenerator
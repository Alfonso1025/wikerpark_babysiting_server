const Resolver = require('../services/resolver')
module.exports=function(req,res,next){
    
    const resolver = Resolver(res)

    const {userName, email, password} = req.body
    
    function validateEmail(uEmail){

        return  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(uEmail)
    }
    if(req.path === "/register"){

        if(![userName, email, password].every(Boolean)){ 

            return resolver.badRequest(null, 'missing_credencials')
        }

        else if(!validateEmail(email)){

            return resolver.badRequest(email, 'invalid_email')
        }
    }
    
    else if(req.path === '/login'){
        if(![email, password].every(Boolean)){
            return resolver.badRequest(null, 'missing_credentials')
        }
        else if(!validateEmail(email)){
            return resolver.badRequest(email, 'invalid_email')
        }
    
    }
    next()





/* const {userName,email,password}=req.body

function validateEmail(uEmail){
    return  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(uEmail)
}
if(req.path==="/register"){
    if(![userName, email, password].every(Boolean)){
        return res.json('missing credentials')
    }
    else if(!validateEmail(email)){
        return res.json('invalid email')
    }
}

else if(req.path==='/login'){
    if(![email, password].every(Boolean)){
        return res.json('missing credentials')
    }
    else if(!validateEmail(email)){
        return res.json('invalid email')
    }

}
next() */
}
module.exports=function(req,res,next){
const {userName,email,password}=req.body

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
next()
}
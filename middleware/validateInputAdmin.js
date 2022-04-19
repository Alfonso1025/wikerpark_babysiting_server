module.exports=function(req,res,next){
    const {adminName,email,password}=req.body
    
    function validateEmail(uEmail){
        return  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(uEmail)
    }
    if(req.path==="/registerAdmin"){
        if(![adminName, email, password].every(Boolean)){
            return res.json('missing credentials')
        }
        else if(!validateEmail(email)){
            return res.json('invalid email')
        }
    }
    
    else if(req.path==='/loginAdmin'){
        if(![email, password].every(Boolean)){
            return res.json('missing credentials')
        }
        else if(!validateEmail(email)){
            return res.json('invalid email')
        }
    
    }
    next()
    }
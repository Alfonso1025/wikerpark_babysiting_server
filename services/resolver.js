const resolver= (res)=>{
    return {
        success:(data,message)=>res.status(200).send({message, data, code:200}),
        conflict:(data,message)=>res.status(409).send({message, data, code:409}),
        failed:(data,message)=>res.status(401).send({message, data, code:401})
    }
        

    
}

module.exports= resolver
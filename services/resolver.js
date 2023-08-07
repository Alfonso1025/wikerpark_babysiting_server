const resolver= (res)=>{
    return {
        success:(data,message)=>res.status(200).send({message, data, code:200}),
        conflict:(data,message)=>res.status(409).send({message, data, code:409}),
        badRequest:(data,message)=>res.status(401).send({message, data, code:401}),
        unauthorized : (data, message) => res.status(401).send({message, data, code : 401 }),
        forbiden : (data, message) => res.status(403).send({message, data, code : 403 }),
        notFound : (data, message) => res.status(404).send({message, data, code : 404 }),
        internalServerError : (data, message) => res.status(500).send({message, data, code : 500 })

    }
        

    
}

module.exports= resolver
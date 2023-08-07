const express= require('express')
const app=express()
require('dotenv').config()
const cors=require('cors')


app.listen(process.env.PORT, ()=>{
    console.log('app is running in port', process.env.PORT)
})
const whiteList= ['http://localhost:3003']
const options={
    origin:(origin, callback)=>{
        if(whiteList.indexOf(origin)|| -1){
            callback(null,true)
        }else{
            callback(new Error('not allowed'))
        }
    }
}
app.use(cors(options)) 
app.use(express.json())

app.use('/users', require('./routes/users'))
app.use('/dashboard', require('./routes/dashboard'))
app.use('/admin', require('./routes/admin'))
app.use('/adminpanel', require('./routes/adminPanel'))
app.use('/sittingPost', require('./routes/sittingPost'))
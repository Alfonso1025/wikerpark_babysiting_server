require('dotenv').config()

const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_CLIENT2;

const client = new MongoClient(uri)


module.exports=client
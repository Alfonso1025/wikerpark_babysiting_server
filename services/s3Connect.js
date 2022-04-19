const S3= require('aws-sdk/clients/s3')
const fs= require('fs')
require('dotenv').config()

const bucketName= process.env.AWS_BUCKET_NAME
const region= process.env.AWS_BUCKET_REGION
const accessKeyId= process.env.AWS_ACCESS_KEY
const secretAccessKey= process.env.AWS_SECRET_KEY

const s3= new S3({
region,
accessKeyId,
secretAccessKey
})

const download =  async (fileKey)=>{

    const downloadParams={
        Key:fileKey,
        Bucket:bucketName
    }
    return await  s3.getObject(downloadParams).createReadStream()
}

module.exports={

    upload:(file, id)=>{
        const fileStream = fs.createReadStream(file.path)
        const uploadParams = {
            Bucket: bucketName,
            Body: fileStream,
            Key: id
        }
        return s3.upload(uploadParams).promise()
    },

     download:  async (fileKey)=>{

        const downloadParams={
            Key:fileKey,
            Bucket:bucketName
        }
        return await  s3.getObject(downloadParams).createReadStream()
    },
    streamToString: async (filekey)=>{

        const stream = await download(filekey)
        const chunks = []

        return new Promise((resolve, reject) => {
            stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
            stream.on('error', (err) => reject(err));
            stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
        })

    }
    

}
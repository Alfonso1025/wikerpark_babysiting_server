const {Router}=require('express')
const router=Router()
const authorization=require('../middleware/authorization')
const controller=require('../controllers/dashboard')
const multer= require('multer')
const upload= multer({dest:'uploads'})

router.get('/getuser', authorization, controller.getUser)
router.post('/uploadbackground/:id', upload.single('file'), controller.uploadBackground)
router.post('/profileform', authorization, controller.getFormInfofromUser )
router.get('/iscleared', authorization, controller.isCleared)
router.put('/addField', controller.addNewField)

module.exports=router

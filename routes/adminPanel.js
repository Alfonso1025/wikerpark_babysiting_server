const {Router}=require('express')
const router=Router()
const authorization=require('../middleware/authorization')
const controller=require('../controllers/adminPanel')

router.get('/', authorization, controller.getAdmin)
router.get('/getusers', controller.getAllUsers)
router.put('/clearuser', controller.clearUser)
router.get('/getbackgroundcheck/:key', controller.getBackgroundCheck)

module.exports=router
const {Router}=require('express')
const router=Router()
const controller=require('../controllers/admin')
const authorization = require('../middleware/authorization')
const validateInput = require('../middleware/validateInput')

router.use(validateInput) //create validateInputAdmin

router.post('/registerAdmin', controller.registerAdmin)
router.post('/loginAdmin', controller.loginAdmin)
router.get('/verified', authorization, controller.isVerified )


module.exports=router
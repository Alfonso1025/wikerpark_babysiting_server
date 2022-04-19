const {Router}=require('express')
const router=Router()
const controller=require('../controllers/users')
const authorization = require('../middleware/authorization')
const validateInput = require('../middleware/validateInput')

router.use(validateInput)

router.post('/register', controller.registerUser)
router.post('/login', controller.loginUser)
router.get('/verified', authorization, controller.isVerified )


module.exports=router
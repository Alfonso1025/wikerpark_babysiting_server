const {Router} = require('express')
const router = Router()
const controller = require('../controllers/sittingPost')
const authorization = require('../middleware/authorization')

router.post('/', authorization, controller.postSitting)
router.get('/', controller.getSits)
router.get('/sitsbyid', authorization, controller.getSitsByUserId )
router.put('/updatecarriedby/:sitId', controller.assignSitToCandidate)
router.put('/insertcandidate/:sitId', authorization, controller.insertCandidate)
router.put('/completedsit', authorization, controller.completedSit)


module.exports = router
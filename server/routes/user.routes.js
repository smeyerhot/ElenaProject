const express = require('express')
const userCtrl = require( '../controllers/user.controller')
const userMiddleware = require( '../middleware/users')
const router = express.Router()

router.route('/api/users/signup')
  .post(userCtrl.create)

router.route('/api/users')
  .get(userCtrl.list)
// router.route('/api/users/:userId')
//   .get(authCtrl.= requireSignin, userCtrl.read)
//   .put(authCtrl.= requireSignin, authCtrl.hasAuthorization, userCtrl.update)
//   .delete(authCtrl.= requireSignin, authCtrl.hasAuthorization, userCtrl.remove)

// router.param('userId', userCtrl.userByID)


router.route('/secret')
  .get(userMiddleware.testFun)
   router.get('/api/secret-route')
  .get((req, res) => {
    // console.log(req.userData)
    res.send('This is the secret content. Only logged in users can see that!');
  });
  
router.route('/secret/hello')
  .get(async function(req,res) {
    res.send("hello world");
  })


module.exports = router


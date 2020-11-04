const express = require('express')

const coordsCtrl = require('../controllers/coords.controller.js')

const router = express.Router()

router.route('/api/coords')
    .post(coordsCtrl.processCoords)
    

module.exports = router

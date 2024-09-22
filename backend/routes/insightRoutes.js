const express = require('express')
const router = express.Router()
const InsightController = require('../controllers/InsightController.js')
const verifyNullFields = require('../middlewares/verify-null-fields.js')
const verifyToken = require('../middlewares/verify-token.js')
const verifyUserExists = require('../middlewares/verify-user-exists.js')

router.post('/create', verifyToken, verifyUserExists, verifyNullFields, InsightController.createInsight)

module.exports = router
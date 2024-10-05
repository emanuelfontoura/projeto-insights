const express = require('express')
const UserController = require('../controllers/UserController.js')
const verifyToken = require('../middlewares/verify-token.js')
const verifyNullFields = require('../middlewares/verify-null-fields.js')
const verifyUserExists = require('../middlewares/verify-user-exists.js')
const router = express.Router()

router.get('/confirm-email', UserController.confirmEmailRegister)
router.post('/register', verifyNullFields, UserController.register)
router.post('/login', verifyNullFields, verifyUserExists, UserController.login)
router.post('/reset-password', verifyNullFields, UserController.setNewPassword)
router.post('/send-email-reset-password', verifyNullFields, verifyUserExists, UserController.sendEmailResetPassword)
router.get('/confirm-email-reset-password', UserController.confirmEmailResetPassword)

module.exports = router
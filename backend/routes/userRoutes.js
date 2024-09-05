const express = require('express')
const UserController = require('../controllers/UserController.js')
const verifyToken = require('../middlewares/verify-token.js')
const verifyNullFields = require('../middlewares/verify-null-fields.js')
const verifyUserExists = require('../middlewares/verify-user-exists.js')
const router = express.Router()

router.post('/login', verifyNullFields, verifyUserExists, UserController.login)
router.post('/register', verifyNullFields, UserController.register)
router.get('/dashboard', verifyToken, UserController.getUserData)
router.patch('/dashboard/edit-email', verifyToken, verifyNullFields, UserController.editUserEmail)
router.patch('/dashboard/edit-password', verifyToken, verifyNullFields, UserController.editUserPassword)
router.patch('/dashboard/edit-infos', verifyToken, UserController.editUserInfos)

// router.post('/check', UserController.checkUserToken)

module.exports = router
const express = require('express')
const UserController = require('../controllers/UserController.js')
const verifyToken = require('../middlewares/verify-token.js')
const verifyNullFields = require('../middlewares/verify-null-fields.js')
const verifyUserExists = require('../middlewares/verify-user-exists.js')
const router = express.Router()

router.post('/login', verifyNullFields, verifyUserExists, UserController.login)
router.post('/register', verifyNullFields, UserController.register)
router.get('/dashboard', verifyToken, UserController.getUserData)
router.patch('/edit-infos', verifyToken, UserController.editUserInfos)
router.post('/confirm-email', verifyToken, verifyNullFields, verifyUserExists, UserController.confirmUserEmail)

module.exports = router
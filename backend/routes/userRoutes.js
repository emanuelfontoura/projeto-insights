const express = require('express')
const UserController = require('../controllers/UserController.js')
const verifyToken = require('../middlewares/verify-token.js')
const verifyNullFields = require('../middlewares/verify-null-fields.js')
const verifyUserExists = require('../middlewares/verify-user-exists.js')
const router = express.Router()

router.post('/login', verifyNullFields, verifyUserExists, UserController.login)
router.post('/register', verifyNullFields, verifyUserExists, UserController.register)
router.post('/check', UserController.checkUserToken)
router.get('/:id', verifyUserExists, UserController.getUserById)
router.patch('/edit/:id', verifyToken, verifyNullFields, UserController.editUser)

module.exports = router
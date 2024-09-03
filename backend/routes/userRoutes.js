const express = require('express')
const UserController = require('../controllers/UserController.js')
const verifyToken = require('../middlewares/verify-token.js')
const verifyNullFields = require('../middlewares/verify-null-fields.js')
const router = express.Router()

router.post('/login', verifyNullFields, UserController.login)
router.post('/register', verifyNullFields, UserController.register)
router.post('/check', UserController.checkUserToken)
router.get('/:id', UserController.getUserById)
router.patch('/edit/:id', verifyToken, verifyNullFields, UserController.editUser)

module.exports = router
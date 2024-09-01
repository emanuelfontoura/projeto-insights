const express = require('express')
const UserController = require('../controllers/UserController.js')
const verifyToken = require('../helpers/verify-token.js')
const router = express.Router()

router.post('/login', UserController.login)
router.post('/register', UserController.register)
router.post('/check', UserController.checkUserToken)
router.get('/:id', UserController.getUserById)
router.patch('/edit/:id', verifyToken, UserController.editUser)

module.exports = router
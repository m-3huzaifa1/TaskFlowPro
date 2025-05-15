const router = require('express').Router()

const {handleRegister} = require('../controllers/handleRegister')
const {handleLogin} = require('../controllers/handleLogin')
const {handleLogout} = require('../controllers/handleLogout')

router.post('/register',handleRegister)
router.post('/login',handleLogin)
router.get('/logout', handleLogout);

module.exports = router
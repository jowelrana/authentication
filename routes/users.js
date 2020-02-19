const Router = require('express').Router()
const Authenticated = require('../middlewares/Authenticated')
const {firstStep,register, login,refresh, me} = require('../controllers/userControllers')

Router.post('/first_step', firstStep)
Router.post('/register', register)
Router.post('/login', login)
Router.post('/refresh', refresh)
Router.get('/me',Authenticated, me)

module.exports = Router

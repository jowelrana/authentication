const Router = require('express').Router()
const {firstStep} = require('../controllers/userControllers')

Router.post('/first_step', firstStep)

module.exports = Router

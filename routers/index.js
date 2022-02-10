const Router = require('express').Router
const Exchange = require('./exchange')
const Routers = Router()

Routers.use('/exchange', Exchange)

module.exports = Routers
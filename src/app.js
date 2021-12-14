
// CommonJS porque tiene mas informacion que el sistema de modulos oficial de js
const express = require('express')
const cors = require('cors')

const app = express()
const logger = require('../loggerMiddleware')

const testingRouter = require('../controllers/testing')

// settings
app.set('port', process.env.PORT || 3001)

// middleware funcion que intercepta la peticion que esta pasando por tu API
app.use(cors())
app.use(express.json())
app.use(logger)

// routes
app.use(require('./routes/index'))

if (process.env.NODE_ENV === 'test') {
  app.use('../controllers/testing', testingRouter)
}

module.exports = app

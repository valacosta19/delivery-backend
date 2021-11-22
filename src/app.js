
// CommonJS porque tiene mas informacion que el sistema de modulos oficial de js
const express = require('express')
const cors = require('cors')

const app = express()
const logger = require('../loggerMiddleware')

//settings
app.set('port', process.env.PORT || 3001)

// middleware funcion que intercepta la peticion que esta pasando por tu API
app.use(cors())
app.use(express.json())
app.use(logger)

// routes
app.use(require('./routes/index'));

module.exports = app;
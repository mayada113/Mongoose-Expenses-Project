// Server setup
const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
const api = require('./server/routes/api')


// Mongoose setup
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/expenseDB', { useNewUrlParser: true })
app.use(express.static(path.join(__dirname, 'node_modules')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/', api)


const port = 4200
app.listen(port, function () {
    console.log(`Running on port ${port}`)
})




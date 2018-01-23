'use strict'
const settings = require('nconf').argv().env().file({file: 'settings.json'}).defaults({'port': 3000})
const path = require('path')
const ejs = require('ejs')
const express = require('express')
const app = express()

ejs.delimiter = ':'
app.set('view engine', 'html')
app.engine('html', ejs.renderFile)
app.locals.layout = 'layout'

app.use('/static', express.static('static'))
app.use(require('express-ejs-layouts'))
app.use(require('serve-favicon')(path.join(__dirname, '/static/favicon.ico')))

require('./routes')(app, settings)

app.listen(settings.get('port'), () => {
  console.log(`Listening for requests at http://sndtst.com:${settings.get('port')}/`)
})

'use strict'
const settings = require('nconf').argv().env().file({ file: 'settings.json' }).defaults({ 'port': 3000 })
const path = require('path')
const ejs = require('ejs')
const express = require('express')
const app = express()
const forceDomain = require('forcedomain')

ejs.delimiter = ':'
app.set('view engine', 'html')
app.engine('html', ejs.renderFile)
app.locals.layout = 'layout'

if (settings.get('forceDomain')) {
  app.use(forceDomain(settings.get('forceDomain')))
}

app.use('/static', express.static('static'))
app.use(require('serve-favicon')(path.join(__dirname, '/static/favicon.ico')))

require('./routes')(app, settings)

app.listen(settings.get('port'), () => {
  console.log(`Starting node on http://localhost:${settings.get('port')}/`)
})

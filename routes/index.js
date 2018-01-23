'use strict'
const optionalRequire = require('optional-require')(require)

module.exports = (app, settings) => {
  app.get('/', (req, res) => {
    res.render(`pages/index`, {})
  })
  app.get('/:game', (req, res) => {
    let game = optionalRequire(`../data/game/${req.params.game}`)
    if (game) {
      res.render(`pages/view`, {
        game: game
      })
    } else {
      res.redirect('/')
    }
  })
  app.get('/platform/:platform', (req, res) => {
    let platform = optionalRequire(`../data/platform/${req.params.platform}`)
    if (platform) {
      res.render(`pages/platform/view`, {
        platform: platform
      })
    } else {
      res.redirect('/')
    }
  })
  app.get('/about/privacy', (req, res) => {
    res.render(`pages/about/privacy`, {})
  })
}

'use strict'
const optionalRequire = require('optional-require')(require)

module.exports = (app, settings) => {
  app.get('/', (req, res) => {
    res.render(`pages/index`, {})
  })
  app.get('/game/', (req, res) => {
    let games = optionalRequire('../data/games.json')
    let random = games.games[Math.floor(Math.random() * games.games.length)]
    let game = optionalRequire(`../data/game/${random.guid}`)
    if (game) {
      res.render(`pages/guess`, {
        game: game,
        page_title: 'Guess the Game'
      })
    } else {
      res.redirect('/')
    }
  })
  app.get('/:game', (req, res) => {
    let game = optionalRequire(`../data/game/${req.params.game}`)
    if (game) {
      res.render(`pages/view`, {
        game: game,
        page_title: `"${game.title}" Sound Test`
      })
    } else {
      res.redirect('/')
    }
  })
  app.get('/:game/track/:track', (req, res) => {
    let game = optionalRequire(`../data/game/${req.params.game}`)
    if (game) {
      if (req.params.track > 0 && req.params.track <= game.playlist.length) {
        let track = game.playlist[req.params.track - 1]
        res.render(`pages/track`, {
          game: game,
          track: track,
          page_title: `"${track.title}" from "${game.title}" | Sound Test`
        })
      } else {
        res.redirect(`/${req.params.game}`)
      }
    } else {
      res.redirect('/')
    }
  })
  app.get('/data/games.json', (req, res) => {
    res.json(require('../data/games.json'))
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

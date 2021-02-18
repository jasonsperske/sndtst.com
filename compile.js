'use strict'
const settings = require('nconf').argv().env().file({ file: 'settings.json' }).defaults({ 'port': 3000 })
const optionalRequire = require('optional-require')(require)
const ncp = require('ncp').ncp
const fs = require('graceful-fs')
const ejs = require('ejs')
const express = require('express')
const app = express()

ncp.limit = 16
ejs.delimiter = ':'
app.set('view engine', 'html')
app.engine('html', ejs.renderFile)

function dumpPage (url, data, filename) {
  app.render(`pages/${url}`, data, (err, html) => {
    if (err) throw err
    console.log(`build/${filename}`)
    fs.writeFileSync(`build/${filename}`, html)
  })
}

function dumpPlatforms () {
  fs.mkdirSync('build/platform', { recursive: true }, (err) => { if (err) throw err })
  const platforms = optionalRequire('./data/platforms.json')
  Object.keys(platforms).forEach((guid) => {
    let platform = optionalRequire(`./data/platform/${guid}`)
    dumpPage('platform/view', {
      platform: platform,
      data_path: `/data/platform/${guid}.json`
    }, `platform/${guid}.html`)
  })
}

function dumpGames () {
  const games = optionalRequire('./data/games.json').games
  games.forEach((game) => {
    dumpGame(game.guid)
  })
}

function dumpGame (guid) {
  const game = optionalRequire(`./data/game/${guid}`)
  fs.mkdirSync(`build/${guid}`, { recursive: true }, (err) => { if (err) throw err })
  dumpPage('view', {
    game: game,
    page_title: `"${game.title}" | Sound Test`,
    data_path: `/data/game/${guid}.json`
  }, `${game.guid}/index.html`)

  fs.mkdirSync(`build/${guid}/track`, { recursive: true }, (err) => { if (err) throw err })
  game.playlist.forEach((track, i) => {
    dumpPage('track', {
      game: game,
      track: track,
      page_title: `"${track.title}" from "${game.title}" | Sound Test`,
      data_path: `/data/game/${guid}.json`
    }, `${guid}/track/${i + 1}.html`)
  })
}

app.listen(settings.get('port'), () => {
  console.log(`Starting node on http://localhost:${settings.get('port')}/`)

  fs.mkdirSync('build', { recursive: true }, (err) => { if (err) throw err })
  fs.copyFile('static/favicon.ico', 'build/favicon.ico', (err) => { if (err) throw err })

  fs.mkdirSync('build/data', { recursive: true }, (err) => { if (err) throw err })
  ncp('data', 'build/data', (err) => {
    if (err) throw err
    console.log('✔️ Copied data')
    fs.mkdirSync('build/static', { recursive: true }, (err) => { if (err) throw err })
    ncp('static', 'build/static', (err) => {
      if (err) throw err
      console.log('✔️ Copied static assets')
      dumpPage('index', {}, 'index.html')
      fs.mkdirSync('build/about', { recursive: true }, (err) => { if (err) throw err })
      fs.mkdirSync('build/about/privacy', { recursive: true }, (err) => { if (err) throw err })
      dumpPage('about/privacy', {}, 'about/privacy/index.html')
      fs.mkdirSync('build/game', { recursive: true }, (err) => { if (err) throw err })
      dumpPage('guess', {}, 'game/index.html')
      dumpPlatforms()
      dumpGames()
    })
  })
})

'use strcit'
const fs = require('fs')
const path = require('path')
const noop = () => {}
const sort = (object) => {
  // Adapted from https://whitfin.io/sorting-object-recursively-node-jsjavascript/
  let sorted = {}
  let keys = Object.keys(object)

  keys.sort((a, b) => {
    if (a < b) return -1
    if (a > b) return 1
    return 0
  })

  keys.forEach((key) => {
    if (typeof object[key] === 'object' && !(object[key] instanceof Array)) {
      sorted[key] = sort(object[key])
    } else {
      sorted[key] = object[key]
    }
  })

  return sorted
}
const read = (filename) => {
  fs.accessSync(path.join(__dirname, './data/', filename), fs.R_OK | fs.W_OK)
  delete require.cache[require.resolve(`./data/${filename}`)]
  return require(`./data/${filename}`)
}
const save = (filename, data) => {
  fs.writeFile(path.join(__dirname, './data', filename), JSON.stringify(sort(data), null, 2) + '\n', noop)
}

fs.readdir('./data/game/', (err, filenames) => {
  if (err) {
    return
  }
  let games = []
  filenames.forEach((filename) => {
    let game = read(`game/${filename}`)
    games.push({
      guid: game.guid,
      title: game.title
    })
    save(`game/${filename}`, game)
  })
  save('games.json', { games: games })
})

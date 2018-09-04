const ReactSSR = require('react-dom/server')
const fs = require('fs')
const path = require('path')
const serverRender = require('./server.render')

module.exports = (app, express) => {
  const serverEntry = require('../server-entry.js')
  const template = fs.readFileSync(path.join(__dirname, '../build/server.ejs'), 'utf8')
  app.use('/static', express.static(path.join(__dirname, '../build/static/')))
  app.get('*', function (req, res, next){
    serverRender(serverEntry, template, req, res)
    .catch(next)
  })
}
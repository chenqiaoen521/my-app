const express = require('express')
const ReactSSR = require('react-dom/server')
const fs = require('fs')
const path = require('path')
const app = express()

module.exports = {
  devRender : function () {
    const serverEntry = require('../server-entry.js').default
    const template = fs.readFileSync(path.join(__dirname, '../build/index.html'), 'utf8')
    app.use('/static', express.static(path.join(__dirname, '../build/static/')))
    app.get('*', function (req, res){
      const appString = ReactSSR.renderToString(serverEntry)
      res.send(template.replace('<app></app>', appString))
    })
  },
  app: app
}
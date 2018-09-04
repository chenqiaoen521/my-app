//process.env.BABEL_ENV = 'production';
//process.env.NODE_ENV = 'production';

process.env.NODE_ENV = 'development'
process.env.BABEL_ENV = 'development'
const prod = require('./server.prod.js')
const devStatic = require('./server.dev.js')
const isDev = process.env.NODE_ENV === 'production'
const express = require('express')
const app = express()

if (isDev) {
  console.log('===== production =====')
  prod(app, express)
} else {
  console.log('===== development =====')
  devStatic(app)
}

app.use(function (err, req, res, next) {
	if(err) {
    res.status(500).send(err)
  } else {
    next()
  }
})

app.listen(3333, function () {
  console.log('server is listening on 3333')
})
const axios = require('axios')
const webpack = require('webpack')
const memoryFs = require('memory-fs')
const path = require('path')
const ReactDomServer = require('react-dom/server')
const serverConfig = require('../config/webpack.config.server')
const proxy = require('http-proxy-middleware')
// get template
const getTemplate = () => {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:3000')
     .then(res => {
       resolve(res.data)
     })
     .catch(reject)
  })
}

// 编译
const Module = module.constructor
const serverCompiler = webpack(serverConfig)
const mfs = new memoryFs()
let serverBundle
serverCompiler.outputFileSystem = mfs
serverCompiler.watch({}, (err, stats) => {
  if (err) {throw err}
  stats = stats.toJson()
  stats.errors.forEach((err) => concole.error(err))
  stats.warnings.forEach((warn) => concole.warn(warn))

  const bundlePath = path.join(serverConfig.output.path, serverConfig.output.filename)
  const bundle = mfs.readFileSync(bundlePath, 'utf-8')
  const m = new Module()
  m._compile(bundle, 'server-entry.js')
  serverBundle = m.exports.default
})

module.exports = function devStatic(app) {
  app.use('/static', proxy({
    target: 'http://localhost:3000'
  }))
	app.get('*', function (req, res) {
    getTemplate().then(tem => {
      const content = ReactDomServer.renderToString(serverBundle)
      res.send(tem.replace('<app></app>', content))
    })
  })
}
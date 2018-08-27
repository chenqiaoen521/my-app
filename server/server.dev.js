const axios = require('axios')
const webpack = require('webpack')
const memoryFs = require('memory-fs')
const path = require('path')
const ReactDomServer = require('react-dom/server')
const serverConfig = require('../config/webpack.config.server')
const proxy = require('http-proxy-middleware')
const asyncBoot = require('react-async-bootstrapper').default
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
let serverBundle, createStoreMap
serverCompiler.outputFileSystem = mfs
serverCompiler.watch({}, (err, stats) => {
  if (err) {throw err}
  stats = stats.toJson()
  stats.errors.forEach((err) => console.error(err))
  stats.warnings.forEach((warn) => console.warn(warn))

  const bundlePath = path.join(serverConfig.output.path, serverConfig.output.filename)
  const bundle = mfs.readFileSync(bundlePath, 'utf-8')
  const m = new Module()
  m._compile(bundle, 'server-entry.js')
  serverBundle = m.exports.default
  createStoreMap = m.exports.createStoreMap
})

const staticProxy = proxy('/static', { target: 'http://127.0.0.1:3000',changeOrigin: true });
const wsProxy = proxy('/sockjs-node', { target: 'http://127.0.0.1:3000',changeOrigin: true , ws: true});
module.exports = function devStatic(app) {
  app.use('/static', staticProxy)
  app.use('/sockjs-node', wsProxy)
	app.get('*', function (req, res) {
    getTemplate().then(tem => {
      const routerContext = {}
      const app = serverBundle(createStoreMap(),routerContext,req.url)
      /*asyncBoot(app).then(() => {
        
      })*/
      const content = ReactDomServer.renderToString(app)
      if (routerContext.url) {
        res.status(302).setHeader('Location', routerContext.url);
        res.end();
        return;
      }
      
      res.send(tem.replace('<app></app>', content))
    })
  })
}
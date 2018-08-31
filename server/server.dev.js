const axios = require('axios')
const webpack = require('webpack')
const memoryFs = require('memory-fs')
const Helmet = require('react-helmet').default
const path = require('path')
const serialize = require('serialize-javascript')
const ReactDomServer = require('react-dom/server')
const serverConfig = require('../config/webpack.config.server')
const proxy = require('http-proxy-middleware')
const bootstrapper = require('react-async-bootstrapper')
const ejs = require('ejs')
const serverRender = require('./server.render')
// get template
const getTemplate = () => {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:3000/server.ejs')
     .then(res => {
       resolve(res.data)
     })
     .catch(reject)
  })
}
// store
const getStoreState = (stores) => {
  return Object.keys(stores).map((item,i) => {
    return {[item]: stores[item].toJson()}
  })
}

//新编译
const NativeModule = require('module')
const vm = require('vm')
const getModuleFromString = (bundle, filename) => {
  const m = {exports: {}}
  const wrapper = NativeModule.wrap(bundle)
  const script = new vm.Script(wrapper, {
    filename,
    displayErrors: true
  })
  const result = script.runInThisContext()
  result.call(m.exports, m.exports, require, m)
  return m
}

// 编译
//const Module = module.constructor
const serverCompiler = webpack(serverConfig)
const mfs = new memoryFs()
let serverBundle, createStoreMap
serverCompiler.outputFileSystem = mfs
serverCompiler.watch({}, (err, stats) => {
  console.log('==============comiiler==============')
  if (err) {throw err}
  stats = stats.toJson()
  stats.errors.forEach((err) => console.error(err))
  stats.warnings.forEach((warn) => console.warn(warn))

  const bundlePath = path.join(serverConfig.output.path, serverConfig.output.filename)
  const bundle = mfs.readFileSync(bundlePath, 'utf-8')
  //const m = new Module()
  //m._compile(bundle, 'server-entry.js')
  const m = getModuleFromString(bundle, 'server-entry.js')
  serverBundle = m
  //serverBundle = m.exports.default
  //createStoreMap = m.exports.createStoreMap
})

const staticProxy = proxy('/static', { target: 'http://127.0.0.1:3000',changeOrigin: true });
const wsProxy = proxy('/sockjs-node', { target: 'http://127.0.0.1:3000',changeOrigin: true , ws: true});
module.exports = function devStatic(app) {
  app.use('/static', staticProxy)
  app.use('/sockjs-node', wsProxy)
	app.get('*', function (req, res, next) {
    getTemplate().then(tem => {
      serverRender(serverBundle.exports, tem, req, res)
      .catch(next)
      /*const routerContext = {}
      const stores = createStoreMap()
      const app = serverBundle(stores,routerContext,req.url)
      bootstrapper(app).then(() => {
        if (routerContext.url) {
          res.status(302).setHeader('Location', routerContext.url);
          res.end();
          return;
        }
        const state =getStoreState(stores)[0]
        const content = ReactDomServer.renderToString(app)
        console.log('state=='+ state)
        const helmet = Helmet.rewind()
        const html = ejs.render(tem, {
          appString: content,
          initialState: serialize(state),
          meta: helmet.meta.toString(),
          title: helmet.title.toString(),
        })
        res.send(html)
        // res.send(tem.replace('<app></app>', content))
      })*/
    })
  })
}
const bootstrapper = require('react-async-bootstrapper')
const Helmet = require('react-helmet').default
const serialize = require('serialize-javascript')
const ReactDomServer = require('react-dom/server')
const ejs = require('ejs')

// store
const getStoreState = (stores) => {
  return Object.keys(stores).reduce((item,i) => {
    item[i] = stores[i].toJson()
    return item
  }, {})
}

module.exports = (bundle, tem, req, res) => {
	return new Promise((resolve, reject) => {
    const routerContext = {}
    const stores = bundle.createStoreMap()
    const createApp = bundle.default
    const app = createApp(stores,routerContext,req.url)
    bootstrapper(app).then(() => {
      if (routerContext.url) {
        res.status(302).setHeader('Location', routerContext.url);
        res.end();
        return;
      }
      const state =getStoreState(stores)
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
      resolve()
      // res.send(tem.replace('<app></app>', content))
    }).catch(reject)
  })
}
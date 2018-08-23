const prod = require('./server.prod.js')
const devStatic = require('./server.dev.js')
const isDev = process.env.NODE_ENV === 'production'


if (!isDev) {
  prod.devRender()
} else {
  devStatic(prod.app)
}
prod.app.listen(3333, function () {
  console.log('server is listening on 3333')
})
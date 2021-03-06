const express = require('express')
const bodyParser = require('body-parser')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const WebpackConfig = require('./webpack.config')
const atob = require('atob')

const app = express()
const compiler = webpack(WebpackConfig)

app.use(webpackDevMiddleware(compiler, {
  publicPath: '/__build__/',
  stats: {
    colors: true,
    chunks: false
  }
}))

app.use(webpackHotMiddleware(compiler))

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const router = express.Router()

createSimpleRouter()
createBufferRouter()
createContentRouter()
createExtendRouter()
createInterceptorRouter()
createConfigRouter()
createCancelRouter()
createAuthRouter()

app.use(router)

const port = process.env.PORT || 8000

module.exports = app.listen(port, () => {
  console.clear()
  console.log(`Server listening on http://localhost:${port}`)
})


function createSimpleRouter() {
  router.get('/simple/get', function(req, res) {
    res.json({
      msg: 'hello world'
    })
  })
  router.get('/simpleGet/get', function(req, res) {
    setTimeout(() => {
      res.json({
        msg: 'hello world'
      })

    }, 3000)
  })
}

function createBufferRouter() {
  router.post('/buffer/post', function(req, res) {
    const msg = []
    req.on('data', chunk => {
      if (chunk) {
        msg.push(chunk)
      }
    })

    req.on('end', () => {
      res.json(Buffer.concat(msg).toJSON())
    })
  })
}

function createContentRouter() {
  router.post('/contentType/post', function(req, res) {
    res.json(req.body)
  })
}

function createExtendRouter() {
  router.post('/extend/post', function(req, res) {
    res.json(req.body)
  })
  router.get('/extend/user', function(req, res) {
    res.json({
      code: 0,
      message: 'success',
      data: {
        name: 'Roger',
        age: 22
      }
    })
  })
}

function createInterceptorRouter() {
  router.get('/interceptor/get', (req, res) => {
    res.end('hello')
  })
}

function createConfigRouter() {
  router.post('/config/post', (req, res) => {
    res.json(req.body)
  })
}

function createCancelRouter() {
  router.get('/cancel/get', (req, res) => {
    setTimeout(() => res.json(req.body), 1000)
  })

  router.post('/cancel/post', (req, res) => {
    setTimeout(() => res.json(req.body), 1000)
  })
}

function createAuthRouter() {
  router.post('/auth/post', (req, res) => {
    const auth = req.headers.authorization
    const [type, credentials] = auth.split(' ')
    console.log(atob(credentials))
    const [username, password] = atob(credentials).split(':')
    if (type === 'Basic' && username === 'Leung' && password === '123456') {
      res.json(req.body)
    } else {
      res.status(401)
      res.end('UnAuthorization')
    }
  })
}


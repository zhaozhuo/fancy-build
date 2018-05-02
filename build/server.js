const fs = require('fs')
const path = require('path')
const express = require('express')
const http = require('http')
const https = require('https')
// https://github.com/expressjs/morgan
// https://github.com/iccicci/rotating-file-stream
const morgan = require('morgan')
const fileStreamRotator = require('file-stream-rotator')
const favicon = require('serve-favicon')
const compression = require('compression')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const session = require('express-session')
// Security
const helmet = require('helmet')

// server
const config = require('../config/server')
const app = express()

app.use(helmet())
app.use(compression())
app.use(morgan('combined', {
  stream: fileStreamRotator.getStream({
    date_format: 'YYYYMMDD',
    filename: path.join(path.resolve(__dirname, '../logs/'), 'access.%DATE%.log'),
    frequency: 'daily',
    verbose: false
  })
}))

app.use((req, res, next) => {
  app.disable('x-powered-by')
  res.setHeader('X-Powered-By', 'Fancy Build')
  next()
})
// app.use(config.logger())
// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, '../favicon.ico')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(cookieParser())
app.use(session({
  secret: 'fancy',
  resave: true,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: new Date(Date.now() + 3600 * 1000)
  }
}))

// app.use(bodyParser({uploadDir:'./uploads'}));
app.set('jsonp callback name', config.jsonpCallback || 'callback')

// view engine setup
app.set('views', path.join(__dirname, '../server/views'))
app.set('view engine', 'pug')

let $root = express.static(path.join(__dirname, '../dist'))
app.use('/', $root)
app.use(/^(?!\/(v1|api)).*?$/, $root)

// apidoc
if (process.env.NODE_ENV === 'development') {
  app.use('/apidoc', express.static(path.join(__dirname, '../document/apidoc')))
}

// routers example
app.use('/v1/errorCollect', require('../server/Controller/ErrorCollect'))
app.use('/v1/user', require('../server/Controller/User'))

// catch 404 and forward to error handler
app.use((req, res, next) => {
  let err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = process.env.NODE_ENV === 'development' ? err : {}
  res.status(err.status || 500)
  res.render('error')
})

// const server = app.listen(port)
const server = http.createServer(app)
server.listen(config.port)
server.on('error', err => onError(err, config.port))
server.on('listening', () => onListening(server, 'http'))

var httpsServer = {}
if (config.https) {
  const credentials = {
    key: fs.readFileSync(config.https.key, 'utf8'),
    cert: fs.readFileSync(config.https.cert, 'utf8'),
    // ciphers : "ECDHE-RSA-AES128-GCM-SHA256:HIGH:!aNULL:!MD5:!RC4:!DHE",
    // honorCipherOrder : true
  }
  httpsServer = https.createServer(credentials, app)
  httpsServer.listen(config.https.port)
  httpsServer.on('error', err => onError(err, config.https.port))
  httpsServer.on('listening', () => onListening(httpsServer, 'https'))
}

function onError(error, port) {
  if (error.syscall !== 'listen') {
    throw error
  }
  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(port + ' requires elevated privileges')
      break
    case 'EADDRINUSE':
      console.error(port + ' is already in use')
      break
    default:
      throw error
  }
  process.exit(1)
}

function onListening(sev, pro = 'http') {
  let addr = sev.address()
  let bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port
  console.log(`${pro} Listening on ${bind}`)
}

module.exports = {
  close: () => {
    server.close()
    config.https && httpsServer.close()
  }
}

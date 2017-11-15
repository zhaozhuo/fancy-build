const fs = require('fs')
const path = require('path')
const opn = require('opn')
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

// server
const config = require('./server.config.js')
const app = express()
app.use(compression())
app.use(morgan('combined', {stream: fileStreamRotator.getStream({
  date_format: 'YYYYMMDD',
  filename: path.join(path.resolve(__dirname, '../logs/'), 'access-%DATE%.log'),
  frequency: 'daily',
  verbose: false
})}))
// app.use(config.logger())
// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, '../favicon.ico')))
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// app.use(bodyParser({uploadDir:'./uploads'}));
app.set('jsonp callback name', config.jsonpCallback || 'callback')

// view engine setup
app.set('views', path.join(__dirname, '../src/static'))
app.set('upload', path.join(__dirname, '../upload'))
app.set('view engine', 'jade')

// routers
let $root = express.static(path.join(__dirname, '../dist'))
app.use($root)
app.use(/^(?!\/v1).*?$/, $root)
app.use('/v1/user', require('../server/Controller/User'))
app.use('/v1/aesCrypto', require('../server/Controller/AesCrypto'))
app.use('/v1/xlsx', require('../server/Controller/Xlsx'))

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  let err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = process.env.NODE_ENV === 'production' ? {} : err
  res.status(err.status || 500)
  res.render('error')
})

// const server = app.listen(port)
const server = http.createServer(app)
server.listen(config.port)
server.on('error', err => onError(err, config.port))
server.on('listening', () => onListening(server, 'http'))

var httpsServer = {};
if (config.https) {
  const credentials = {
    key: fs.readFileSync(config.https.key, 'utf8'),
    cert: fs.readFileSync(config.https.cert, 'utf8'),
    // ciphers : "ECDHE-RSA-AES128-GCM-SHA256:HIGH:!aNULL:!MD5:!RC4:!DHE",
    // honorCipherOrder : true
  }
  httpsServer = https.createServer(credentials, app);
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
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(port + ' is already in use')
      process.exit(1)
      break
    default:
      throw error
  }
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

require('shelljs/global')
const ora = require('ora')
const opn = require('opn')
const path = require('path')
const chalk = require('chalk')
const express = require('express')
const webpack = require('webpack')
const favicon = require('serve-favicon')
const proxyMiddleware = require('http-proxy-middleware')

const config = require('./webpack.config')
const webpackConfig = require('./webpack.base.js')
const spinner = ora('building for ' + process.env.NODE_ENV + ' ...')

function _clear(path) {
  let directory = `${config.output.path}/${path || '*'}`
  rm('-rf', directory);
  path && mkdir('-p', directory);
}

function build_pro() {
  _clear('assets')
  _clear('views')

  spinner.start()
  webpack(webpackConfig, function (err, stats) {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false,
    }) + '\n')
    console.log(chalk.cyan('  Build complete.\n'))
    // console.log(chalk.yellow())
  })
}

function build_dev() {
  const port = config.dev.port;
  // server
  const app = express()

  // app.use(express.compress())
  // uncomment after placing your favicon in /public
  //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

  // view engine setup
  app.set('views', path.join(__dirname, '../src/static'))
  app.set('upload', path.join(__dirname, '../upload'))
  app.set('view engine', 'jade')

  const compiler = webpack(webpackConfig)
  const devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath,
    quiet: false,
    noInfo: true,
  })
  const hotMiddleware = require('webpack-hot-middleware')(compiler, {
    log: false,
    heartbeat: 2000,
  });

  app.use(devMiddleware)
  app.use(hotMiddleware)

  // proxy
  const proxyTable = config.dev.proxyTable
  proxyTable && Object.keys(proxyTable).forEach(key => app.use(proxyMiddleware(key, proxyTable[key])))

  // assets
  config.assetsCopy.data.forEach(value => app.use('/' + value.to, express.static(value.from)))

  console.log('> Starting dev server...')
  devMiddleware.waitUntilValid(() => {
    let uri = 'http://localhost:' + config.dev.port
    console.log('> Listening at ' + uri + '\n')
    config.dev.autoOpenBrowser && opn(uri)
  })

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
    res.locals.error = err
    // render the error page
    res.status(err.status || 500)
    res.render('error')
  })

  const server = app.listen(port)

  server.on('error', error => {
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
  })
}

process.env.NODE_ENV === 'development' ? build_dev() : build_pro();

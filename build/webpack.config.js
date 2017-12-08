const path = require('path')
const glob = require('glob')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const root = path.resolve(__dirname, '../')
const src = path.resolve(__dirname, '../src/')
const dist = path.resolve(__dirname, '../dist/')
// const name = __dirname.split(path.sep).slice(-2)[0]

var entry = {
  'index': './src/index.js'
}
var htmlWebpack = [
  // see https://github.com/ampedandwired/html-webpack-plugin
  // Multiple entry points -> multiple html outputs
  // https://github.com/jantimon/html-webpack-plugin/issues/218
  new HtmlWebpackPlugin({
    data: {
      title: 'myapp Test',
    },
    filename: 'index.html',
    template: './src/index.pug',
    inject: 'body', // head body
    cache: false,
    // chunks: ['views/index'],
    minify: {
      removeComments: true,
      collapseWhitespace: true,
      removeEmptyAttributes: true
    },
  })
]

glob.sync(`${src}/views/**/*.js`).forEach(i => {
  let key = path.relative(src, i).replace(path.extname(i), '')
  entry[key] = i
  htmlWebpack.push(new HtmlWebpackPlugin({
    filename: `${key}.html`,
    template: `${src}/${key}.pug`,
    chunks: [key],
    inject: 'body', // head body
    cache: false,
    minify: {
      removeComments: true,
      collapseWhitespace: true,
      removeEmptyAttributes: true
    },
    // inlineSource: '.(js|css|sass)$',
  }))
})

module.exports = {
  entry,
  output: {
    path: dist,
    publicPath: '/',
    filename: '[name].[hash:7].js',
    // chunkFilename: 'views/[name].js',
  },
  htmlWebpack,
  // variables
  prefixName: 'tencent_',
  networkRoot: '"/v1"',

  // alias
  alias: {
    lib: `${root}/lib/`,
    // node
    vue$: 'vue/dist/vue.js',
    zepto$: 'zepto/dist/zepto.min.js',
    jquery$: 'jquery/dist/jquery.min.js',
    swiper$: 'swiper/dist/js/swiper.min.js',
    lazyload$: '/vanilla-lazyload/dist/lazyload.min.js',
    'components': `${root}/src/components/`,
    'fancy_style': `${root}/src/config.sass`,
  },

  // assets
  assetsCopy: {
    data: [{
      from: 'src/assets',
      to: dist + '/assets',
    }],
    options: {
      ignore: ['.*', '*.json', '*.less', '*.sass', '*.md', '*.map'],
      debug: 'warning', // 'info',
    }
  },
  dev: {
    port: 5050,
    autoOpenBrowser: true,
    proxyTable: {
      '/v1': {
        target: 'http://localhost:5151/',
        // changeOrigin: true,
        pathRewrite: {
          '^/v1': '/v1'
        }
      },
      '/': {
        target: 'http://localhost:5050/',
        pathRewrite: {
          '^/(.*)$': '/'
        },
      },
    },
  },
  pro: {
    port: 8080,
  },
}

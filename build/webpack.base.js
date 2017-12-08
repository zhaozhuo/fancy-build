const webpack = require('webpack')
// const multi = require('multi-loader')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const FriendlyEslint = require('eslint-friendly-formatter')
const CopyWebpackPlugin = require('copy-webpack-plugin')
// https://github.com/DustinJackson/html-webpack-inline-source-plugin
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin')
// https://github.com/webpack/extract-text-webpack-plugin
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const cssExtractTextPlugin = new ExtractTextPlugin({
  filename: '[name].[hash:7].css',
  disable: false,
  allChunks: true,
})

const config = require('./webpack.config.js')
const debug = process.env.NODE_ENV !== 'production'

const sassloader = cssExtractTextPlugin.extract({
  use: 'css-loader!svg-fill-loader/encodeSharp!postcss-loader!sass-loader?indentedSyntax',
  fallback: 'vue-style-loader',
})

if (process.env.NODE_ENV === 'development') {
  // Object.keys(config.entry).forEach(name => config.entry[name] = ['./build/dev-client'].concat(config.entry[name]))
  Object.keys(config.entry).forEach(name => {
    config.entry[name] = [config.entry[name], 'webpack-hot-middleware/client?reload=true']
  })
}

module.exports = {
  entry: config.entry,
  output: config.output,
  watch: debug,
  watchOptions: {
    poll: 1000,
  },
  // stats: {
  //   children: false,
  //   verbose: false,
  //   errorDetails: false,
  // },
  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        // include: [resolve('src'), resolve('test')],
        options: {
          formatter: FriendlyEslint,
        },
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        exclude: /(node_modules)/,
        options: {
          loaders: {
            js: 'babel-loader',
            sass: false,
          },
        },
      },

      {
        test: /\.js$/,
        use: 'babel-loader?cacheDirectory',
        exclude: /(node_modules)/,
      },
      {
        test: /\.pug$/,
        use: 'pug-loader',
      },
      {
        test: /\.css$/,
        use: cssExtractTextPlugin.extract({
          use: 'css-loader?sourceMap&minimize=true',
        }),
      },
      {
        test: /\.sass$/,
        use: sassloader,
      },
      {
        test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'img/[name].[hash:7].[ext]',
        },
      },
      {
        test: /\.svg/,
        resourceQuery: /^\?fill=/,
        use: [
          'url-loader?{"limit":10000,"name":"img/[name].[hash:7].[ext]"}',
          'svg-fill-loader',
        ],
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'media/[name].[hash:7].[ext]',
        },
      },
      {
        test: /\.(eot|ttf|woff|svg)/,
        loader: 'file?name=fonts/[hash].[ext]',
      },
    ],
  },
  resolveLoader: {
    moduleExtensions: ['-loader'],
  },
  resolve: {
    alias: config.alias,
    extensions: ['.js', '.vue'],
  },
  plugins: (() => {
    let res = [
      new webpack.DefinePlugin({
        DEBUG: process.env.NODE_ENV === 'development',
        PREFIX: JSON.stringify(config.prefixName),
        NETROOT: config.networkRoot,
      }),
      cssExtractTextPlugin,
      // new webpack.ProvidePlugin({
      //   $: 'jquery',
      //   jQuery: 'jquery'
      // }),
      // https://github.com/mishoo/UglifyJS2
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
        },
        mangle: {
          except: ['$super', '$', 'exports', 'require'],
        },
      }),
      new HtmlWebpackInlineSourcePlugin(),
      // new webpack.NoErrorsPlugin(),
    ]
    // html
    res = res.concat(config.htmlWebpack)
    // server
    if (process.env.NODE_ENV === 'development') {
      res.push(
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new FriendlyErrorsPlugin(),
        // https://github.com/ampedandwired/html-webpack-plugin
      )
    } else {
      // https://github.com/kevlened/copy-webpack-plugin
      res.push(new CopyWebpackPlugin(config.assetsCopy.data, config.assetsCopy.options))
    }

    return res
  })(),
}

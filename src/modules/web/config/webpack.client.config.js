const Path = require('path')
const Webpack = require('webpack')
const Merge = require('webpack-merge')
const baseConfig = require('./webpack.base.config')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const resolve = file => Path.resolve(__dirname, file)

module.exports = Merge(baseConfig, {
  entry: {
    app: resolve('./../app/entry-client.js')
  },
  plugins: [
    new Webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity
    }),
    new VueSSRClientPlugin()
  ]
})

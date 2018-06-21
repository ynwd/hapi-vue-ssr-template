const Path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const resolve = file => Path.resolve(__dirname, file)
module.exports = {
  output: {
    path: resolve('../../../../static/web'),
    publicPath: '/static/web/',
    filename: '[name].[chunkhash].js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin()
  ]
}

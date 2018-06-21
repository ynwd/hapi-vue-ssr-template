const Path = require('path')
const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  name: 'AppAdmin',

  register: (server, options) => {
    server.app.webpack = {
      // load webpack local-module config
      clientConfig: require('./config/webpack.client.config'),
      serverConfig: require('./config/webpack.server.config'),

      // this config is for production-mode SSR
      bundle: isProd ? require('../../../static/web/vue-ssr-server-bundle.json') : null,
      clientManifest: isProd ? require('../../../static/web/vue-ssr-client-manifest.json') : null,

      // this config for renderer
      template: require('fs').readFileSync(Path.resolve(__dirname, './app/index.html'), 'utf-8'),
      basedir: Path.resolve(__dirname, '../../../static/web')
    }
    server.route(require('./routes'))
  }
}

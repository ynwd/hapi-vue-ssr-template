const DevMiddleware = require('webpack-dev-middleware')
const HotMiddleware = require('webpack-hot-middleware')
const MFS = require('memory-fs')
const Path = require('path')
const Webpack = require('webpack')

const registerMiddlewares = (server) => {
  const {
    eventBus,
    webpack: {clientConfig, serverConfig}
  } = server.app

  clientConfig.entry.app = ['webpack-hot-middleware/client', clientConfig.entry.app]
  clientConfig.output.filename = '[name].js'
  clientConfig.plugins.push(
    new Webpack.HotModuleReplacementPlugin(),
    new Webpack.NoEmitOnErrorsPlugin()
  )

  const clientCompiler = Webpack(clientConfig)
  const devMiddleware = DevMiddleware(clientCompiler, {
    publicPath: clientConfig.output.publicPath,
    noInfo: true
  })
  const hotMiddleware = HotMiddleware(clientCompiler)

  const Fs = devMiddleware.fileSystem
  const readFileClient = file => Fs.readFileSync(Path.join(clientConfig.output.path, file), 'utf-8')

  clientCompiler.plugin('done', async () => {
    const clientManifest = JSON.parse(readFileClient('vue-ssr-client-manifest.json'))
    eventBus.emit('clientManifest', clientManifest)
  })

  const serverCompiler = Webpack(serverConfig)
  const mfs = new MFS()
  const readFileServer = file => mfs.readFileSync(Path.join(clientConfig.output.path, file), 'utf-8')

  serverCompiler.outputFileSystem = mfs
  serverCompiler.watch({}, (err, stats) => {
    if (err) {
      throw err
    }

    stats = stats.toJson()
    stats.errors.forEach(console.error)
    stats.warnings.forEach(console.warn)
    const bundle = JSON.parse(readFileServer('vue-ssr-server-bundle.json'))
    eventBus.emit('bundle', bundle)
  })

  server.ext({
    type: 'onRequest',
    method: [
      middlewareHandlerFactory(devMiddleware),
      middlewareHandlerFactory(hotMiddleware)
    ]
  })
}

function middlewareHandlerFactory (middleware) {
  return async function (request, h) {
    const { req, res } = request.raw
    await new Promise((resolve, reject) => {
      middleware(req, res, err => {
        if (err) {
          throw err
        }

        resolve()
      })
    })
    return h.continue
  }
}

module.exports = registerMiddlewares

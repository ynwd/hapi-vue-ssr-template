const { createBundleRenderer } = require('vue-server-renderer')
const LRU = require('lru-cache')
const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  name: 'Renderer',

  register: (server, opts) => {
    if (isProd) {
      try {
        const { webpack } = server.app
        const { bundle, clientManifest } = webpack
        server.app.renderer = createRenderer(bundle, { clientManifest }, webpack)
      } catch (err) {
        console.log(err)
      }
      return
    }

    server.dependency('EventBus', registerListener)
  }
}

async function registerListener (server) {
  const { eventBus, webpack } = server.app
  let resolver
  let isResolved = false
  let bundle
  let clientManifest
  const resolvePromise = new Promise((resolve, reject) => { resolver = resolve })

  const updateRenderer = (bundle, clientManifest, webpack) => {
    if (bundle && clientManifest) {
      server.app.renderer = createRenderer(bundle, { clientManifest }, webpack)

      if (!isResolved) {
        isResolved = true
        resolver()
      }
    }
  }

  eventBus.on('clientManifest', _clientManifest => {
    clientManifest = _clientManifest
    updateRenderer(bundle, clientManifest, webpack)
  })

  eventBus.on('bundle', _bundle => {
    bundle = _bundle
    updateRenderer(bundle, clientManifest, webpack)
  })

  await resolvePromise
}

const createRenderer = function (bundle, options, webpack) {
  return createBundleRenderer(bundle, {
    ...options,
    cache: LRU({
      max: 10000
    }),
    runInNewContext: false,
    template: webpack.template,
    basedir: webpack.basedir
  })
}

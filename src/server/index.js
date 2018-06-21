const Glue = require('glue')

module.exports.init = async function (manifest, options) {
  const server = await Glue.compose(manifest, options)
  server.route(require('./assetServer'))
  await server.start()
  return server
}

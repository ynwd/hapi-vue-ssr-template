'use strict'

const manifest = require('./src/server/manifest')
const Server = require('./src/server')

const options = {
  relativeTo: `${__dirname}/src/modules`
}

Server.init(manifest, options)
  .then(server => {
    console.log(`${new Date()} - running at: ${server.info.uri} in ${process.env.NODE_ENV} mode`)
  })
  .catch(err => {
    console.error('err', err)
    process.exit(1)
  })

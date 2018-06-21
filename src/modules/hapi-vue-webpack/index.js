const EventEmitter = require('events')
const registerMiddleware = require('./middleware')

class EventBus extends EventEmitter {}

module.exports = {
  name: 'HapiVueWebpack',

  register: async (server, options) => {
    server.register([
      require('./eventBus'),
      require('./renderer')
    ])
    server.dependency('EventBus', registerMiddleware)
    server.app.eventBus = new EventBus()
  }
}

module.exports = {
  server: {
    port: 3000,
    host: 'localhost'
  },
  register: {
    plugins: [
      { plugin: require('inert') },
      { plugin: './web' },
      { plugin: './hapi-vue-webpack' }
    ],
    options: {
      once: true
    }
  }
}

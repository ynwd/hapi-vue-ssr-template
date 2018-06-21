module.exports = {
  method: 'GET',
  path: '/static/assets/{param*}',
  handler: {
    directory: {
      path: 'static/assets',
      redirectToSlash: true,
      listing: true
    }
  }
}

module.exports = {
  method: 'GET',
  path: '/static/web/{param*}',
  handler: {
    directory: {
      path: 'static/web',
      redirectToSlash: true,
      index: true
    }
  }
}

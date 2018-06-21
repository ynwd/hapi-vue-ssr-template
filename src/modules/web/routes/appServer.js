module.exports = {
  method: 'GET',
  path: '/{p*}',
  handler: async (request, h) => {
    const { url } = request.raw.req
    const { server } = request

    const context = {
      url
    }
    try {
      const html = await server.app.renderer.renderToString(context)
      return h.response(html).header('Content-Type', 'text/html')
    } catch (err) {
      throw err
    }
  }
}

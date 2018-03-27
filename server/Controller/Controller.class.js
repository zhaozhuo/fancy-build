const config = require('../config')
// const DEBUG = process.env.NODE_ENV === 'development'

class ControllerClass {
  constructor(req, response) {
    this.req = req
    this.response = response
    this.post = req.body || {}
    this.query = req.query || {}
  }

  send(data) {
    this.response.send(data)
  }
  getCookie(key) {
    let _key = config.cookiePrefix + key
    return this.req.cookies[_key]
  }
  setCookie(key, value, option = {}) {
    let {
      expires = new Date(Date.now() + 24 * 3600000),
      path = '/',
      httpOnly = true
    } = option

    let _key = config.cookiePrefix + key
    let _opt = { expires, path, httpOnly }
    this.response.cookie(_key, value, _opt)
  }
}

module.exports = ControllerClass

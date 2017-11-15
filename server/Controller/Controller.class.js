const DEBUG = process.env.NODE_ENV === 'development'

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

  getUserInfo() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.user = {
          name: 'denver',
          mobile: '133000000000'
        }
        resolve()
      }, 2000)
    })
  }
}

module.exports = ControllerClass

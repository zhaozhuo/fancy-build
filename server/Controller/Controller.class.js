const DEBUG = process.env.NODE_ENV === 'development'
const config = require('../config')

class ControllerClass {
  constructor() {
    this.error = false
    this.response = false
  }

  ajaxReturn(data) {
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

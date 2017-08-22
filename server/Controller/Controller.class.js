const DEBUG = process.env.NODE_ENV === 'development'

class ControllerClass {
  constructor() {
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

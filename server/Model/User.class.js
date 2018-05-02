// queue short message
class Model extends require('./Model.class') {
  constructor(logger) {
    super(`user`, false, logger || false)
  }
}
module.exports = logger => new Model(logger)

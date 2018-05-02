'use strict'
const express = require('express')
const router = express.Router()

class Application extends require('./Controller.class') {
  constructor(req, response, action) {
    super(req, response)
    this[action]()
  }

  /**
   * @api {get} /errorCollect/test 前端错误收集
   * @apiGroup ErrorCollect
   */
  test() {
    console.log(this.query)
    this.send('123')
  }
}

router.get('/test', (req, res) => new Application(req, res, 'test'))

module.exports = router

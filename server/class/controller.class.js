const express = require('express')
const router = express.Router()

const DEBUG = process.env.NODE_ENV === 'development'
const noop = function() {}

class ControllerClass {
  constructor() {
    this.test()
  }

  test() {
  }
}

module.exports = ControllerClass

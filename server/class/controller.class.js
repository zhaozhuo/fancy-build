const express = require('express')
const router = express.Router()

const DEBUG = process.env.NODE_ENV === 'development'
const noop = function() {}

class ControllerClass {
  constructor() {
  }

  test() {
    console.log('001')
  }
}

module.exports = ControllerClass

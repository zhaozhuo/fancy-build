'use strict'
const path = require('path')
const express = require('express')
const router = express.Router()
// log
const cname = path.basename(__filename, '.js')
const logger = require('../logger')(cname)

const UserModel = require('../Model/User.class')(logger)

class Application extends require('./Controller.class') {
  constructor(req, response, action) {
    super(req, response)
    this.user = null
    this[action]()
  }

  /**
   * @api {post} /user/getList 列表
   * @apiGroup User
   * @apiParam {Number} page 页码
   * @apiParam {Number} perpage 每页显示数量
   * @apiSuccess {String} code 状态码
   * @apiSuccess {String} code.100    成功
   * @apiSuccess {String} code.000    系统错误
   * @apiSuccess {Array}  data
   * @apiSuccess {Object} page
   */
  getList() {
    let {
      page = 1,
      perpage = 20,
    } = this.post

    _promise.call(this).then(
      res => this.send(res),
      err => this.sendError({ msg: err }) && logger.error(err),
    )

    async function _promise() {
      let res = await UserModel.getList({
        page,
        perpage: Math.min(perpage, 100),
        order: 'utime desc',
        count: true,
      })
      return {
        code: '100',
        data: res.data,
        pages: res.pages,
      }
    }
  }
}

router.post('/getList', (req, res) => new Application(req, res, 'getList'))

module.exports = router

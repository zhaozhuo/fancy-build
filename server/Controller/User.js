
const path = require('path')
const express = require('express')
const router = express.Router()

const cname = path.basename(__filename, '.js')
const logger = require('../logger')(cname)
// const DEBUG = process.env.NODE_ENV === 'development'
const UserModel = require('../Model/User.class')

class Application extends require('./Controller.class') {
  constructor(req, response, action) {
    super(req, response)
    this[action]()
  }

  jsonpdata() {
    this.response.jsonp({
      code: '100',
      msg: 'success',
      data: this.query
    })
  }

  async add() {
    try {
      let id = await UserModel.create({
        // name: 'name' + Math.floor(Math.random() * 1000),
        name: '</li><div>w</div>',
        age: Math.floor(Math.random() * 100),
      })
      return this.send({ code: '100', data: id })
    } catch (err) {
      logger.error(err)
      return this.send({ code: '010', msg: err })
    }
  }

  getList() {
    let {
      page = 1,
      perpage = 20,
    } = this.post

    _promise.call(this).then(
      res => this.send(res),
      err => {
        logger.error(err)
        this.send({ code: '000', msg: err })
      }
    )

    async function _promise() {
      let res = await UserModel.getList({
        page,
        perpage,
        order: { ctime: 'DESC' }
      })
      res.code = '100'
      return res
    }
  }

  async modify() {
    let data = {
      name: '<script>alert(1)</script>',
      // name: 'name' + Math.floor(Math.random() * 1000),
      age: Math.floor(Math.random() * 100),
    }
    try {
      await UserModel.setByWhere({
        data,
        where: { id: this.post.id },
      })
      return this.send({ code: '100', data: data })
    } catch (err) {
      logger.error(err)
      return this.send({ code: '010', msg: err })
    }
  }

  async delById() {
    try {
      let res = await UserModel.deleteByWhere({
        data: { id: this.post.id },
      })
      return this.send({ code: '100', data: res })
    } catch (err) {
      logger.error(err)
      return this.send({ code: '010', msg: err })
    }
  }
}

router.get('/jsonpdata', (req, res) => new Application(req, res, 'jsonpdata'))
router.post('/add', (req, res) => new Application(req, res, 'add'))
router.post('/getList', (req, res) => new Application(req, res, 'getList'))
router.post('/delById', (req, res) => new Application(req, res, 'delById'))
router.post('/modify', (req, res) => new Application(req, res, 'modify'))

// https://github.com/expressjs/multer
// const upload = multer({ dest: config.upload.temp) })

// router.post('/html5Image', upload.single('basefile'), (req, res) => new Application(req, res, 'html5Image'))

module.exports = router

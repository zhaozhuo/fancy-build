
const path = require('path')
const express = require('express')
const router = express.Router()
const multer = require('multer')

const cname = path.basename(__filename, '.js')
const logger = require('../logger')(cname)

const DEBUG = process.env.NODE_ENV === 'development'
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
        name: 'name' + Math.floor(Math.random() * 1000),
        age: Math.floor(Math.random() * 100),
      })
      return this.send({ code: '100', data: id })
    }
    catch (err) {
      logger.error(err)
      return this.send({ code: '010', msg: err })
    }
  }

  async getList() {
    let {
      page = 1,
      perpage = 20,
    } = this.post

    try {
      let res = await UserModel.getList({
        page,
        perpage,
        order: { ctime: 'DESC' }
      })
      res.code = '100'
      return this.send(res)
    }
    catch (err) {
      logger.error(err)
      return this.send({ code: '010', msg: err })
    }
  }

  async modify() {
    let data = {
      name: 'name' + Math.floor(Math.random() * 1000),
      age: Math.floor(Math.random() * 100),
    }
    try {
      let res = await UserModel.setByWhere({
        data,
        where: { id: this.post.id },
      })
      return this.send({ code: '100', data: data })
    }
    catch (err) {
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
    }
    catch (err) {
      logger.error(err)
      return this.send({ code: '010', msg: err })
    }
  }

  async html5Image() {
    let { image = '', attachtime = '', module_id = '', creator_id = '', creator_name = '', } = this.post

    if (!(module_id && this.app.uploader && this.app.uploader[module_id] && this.app.uploader[module_id].path)) {
      return this.ajaxReturn({
        code: '001',
        msg: 'module_id invalid'
      })
    }
    if (!attachtime) {
      return this.ajaxReturn({
        code: '002',
        msg: 'attachtime required'
      })
    }
    //过滤data:URL
    let base64Data = image.replace(/^data:image\/\w+;base64,/, "")
    let dataBuffer = new Buffer(base64Data, 'base64')
    let file_size = dataBuffer.length
    let file_ext = 'jpg'
    let { file_name, file_url, save_path, save_name } = this.getfileInfo(module_id, attachtime)

    let _id = Math.floor(Math.random() * 10000) + '.' + file_ext
    file_name += _id
    save_name += _id
    file_url += _id
    // create directory
    try {
      fs.existsSync(save_path) || fs.mkdirSync(save_path, '0775')
      fs.writeFileSync(save_name, dataBuffer)
    }
    catch (err) {
      return this.ajaxReturn({ code: '010', msg: DEBUG ? err : err.code })
    }

    try {
      let res = await Model.create({
        file_name,
        file_ext,
        file_size,
        creator_id,
        creator_name,

        ptime: attachtime,
        app_module: module_id,
        app_sign: this.app.app_sign,
      })
      return this.ajaxReturn({ code: '100', data: file_url })
    }
    catch (err) {
      return this.ajaxReturn({ code: '010', msg: err })
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

module.exports = router;

// required
const express = require('express')
const router = express.Router()
const logger = require('../logger')('script')
const config = require('../config')
const DEBUG = process.env.NODE_ENV === 'development'

// test
const fs = require('fs');
const crypto = require("crypto");
const redis = require('redis')
const redisClient = require('../redis')

// upload
const multer = require('multer')
const upload = multer({ dest: config.upload.temp })
const cpUpload = upload.fields([
  {
    name: 'avatar',
    maxCount: 5,
  },
  {
    name: 'gallery',
    maxCount: 8,
  },
]);

// model
const testModel = require('../Model/TestingModel.class')

// controller
class Application extends require('./Controller.class') {

  constructor(req, response) {
    super()
    this.req = req
    this.post = req.body || {}
    this.response = response
  }

  async dbInit(req, response) {
    try {
      await testModel.tableCreate(true)
      this.ajaxReturn({ code: '100', msg: 'success' })
    } catch (err) {
      this.ajaxReturn({ code: '010', msg: err })
    }
  }

  async add() {
    try {
      let data = {
        name: 'John891' + Math.floor(Math.random() * 1000),
        pid: Math.floor(Math.random() * 10),
        age: Math.floor(Math.random() * 100),
      }
      let where = { pid: 3 }
      this.ajaxReturn({ code: '100', data: await testModel.save(data, where) })
    } catch (err) {
      this.ajaxReturn({ code: '010', msg: err })
    }
  }

  async getCount() {
    try {
      this.ajaxReturn({ code: '100', data: await testModel.getCount(this.post) })
    } catch (err) {
      this.ajaxReturn({ code: '010', msg: err })
    }
  }
  async getList() {
    try {
      let res = await testModel.getList(this.post)
      res.cdoe = '100'
      this.ajaxReturn(res)
    } catch (err) {
      this.ajaxReturn({ code: '010', msg: err })
    }
  }

  async delById() {
    try {
      this.ajaxReturn({ code: '100', data: await testModel.delById(this.post.id) })
    } catch (err) {
      this.ajaxReturn({ code: '010', msg: err })
    }
  }

  async getById() {
    try {
      this.ajaxReturn({ code: '100', data: await testModel.getById(this.post.id) })
    } catch (err) {
      this.ajaxReturn({ code: '010', msg: err })
    }
  }

  async delByWhere() {
    try {
      this.ajaxReturn({ code: '100', data: await testModel.delByWhere(this.post) })
    } catch (err) {
      this.ajaxReturn({ code: '010', msg: err })
    }
  }

  async getOne() {
    try {
      this.ajaxReturn({ code: '100', data: await testModel.getOne(this.post) })
    } catch (err) {
      this.ajaxReturn({ code: '010', msg: err })
    }
  }
  // =========================== others
  jsonpdata() {
    this.response.jsonp({
      code: '100',
      msg: 'success',
      data: 'jsonp data'
    })
  }

  serverCookie() {
    this.response.cookie('test1', 'test value', {
      expires: new Date(Date.now() + 3600 * 1000 * 24),
      path: '/',
      httpOnly: true
    });
    this.ajaxReturn({
      code: '100',
      data: this.req.cookies.test1,
      msg: 'success'
    })
  }

  redisSet() {
    redisClient.set('wefwef', Date.now(), 'EX', 3600 * 2, redis.print)
    redisClient.get("wefwef", (err, reply) => this.ajaxReturn({ code: '100', msg: reply }))
  }

  upload() {
    const files = this.req.files;
    files.avatar.forEach(file => {
      if (!/image\/\w+/.test(file.mimetype)) {
        return this.ajaxReturn({ code: '001', msg: '请选择图像类型的文件' })
      }
      fs.rename(file.path, `${config.upload.path}/abc.jpg`, err => {
        if (err) {
          return this.ajaxReturn({ code: '010', msg: err })
        }
        return this.ajaxReturn({ code: '100', msg: `${config.upload.url}/abc.jpg` })
      });
    })
  }

  uploadBase64() {
    const base64Data = this.post.base64.replace(/^data:image\/\w+;base64,/, "");
    const dataBuffer = new Buffer(base64Data, 'base64');
    fs.writeFile("upload/out.png", dataBuffer, err => {
      if (err) {
        return this.ajaxReturn(err);
      }
      this.ajaxReturn({ code: '100', msg: '保存成功！' })
    });
  }

  markdown2pdf(req, response) {
    const path = require('path')
    const markdownpdf = require("markdown-pdf")
    const root = path.resolve(__dirname, '../../')
    // markdownpdf().from.string('wegweg').to(`${config.upload.path}/test1.pdf`, function (err, res) { });
    markdownpdf().from(`${root}/readme.md`).to(`${config.upload.path}/test2.pdf`, (err, res) => {
      if (err) {
        return this.ajaxReturn({ code: '010', msg: err })
      }
      this.ajaxReturn({ code: '100', msg: 'success' })
    })
  }

  aesCrypto() {
    const algorithm = 'AES-256-ECB'
    const clearEncoding = 'utf8'
    const cipherEncoding = 'base64'
    const iv = ""

    function decodeCipher(key, ciphertext) {
      let cipherChunks = [ciphertext];
      let decipher = crypto.createDecipheriv(algorithm, key, iv);
      let plainChunks = [];
      for (let i = 0; i < cipherChunks.length; i++) {
        plainChunks.push(decipher.update(cipherChunks[i], cipherEncoding, clearEncoding));
      }
      plainChunks.push(decipher.final(clearEncoding));
      return plainChunks.join('');
    }

    function encodeCipher(key, data) {
      let cipher = crypto.createCipheriv(algorithm, key, iv);
      cipher.setAutoPadding(true);
      let cipherChunks = [];
      cipherChunks.push(cipher.update(data, clearEncoding, cipherEncoding));
      cipherChunks.push(cipher.final(cipherEncoding));
      return cipherChunks.join('');
    }

    let data = this.post

    if (data.type === 'decryption') {
      if (data.key.length != 32) {
        return this.ajaxReturn({ code: '001', msg: 'keys length 32', })
      }
      if (!data.ciphertext.length) {
        return this.ajaxReturn({ code: '002', msg: 'ciphertext required', })
      }
      try {
        return this.ajaxReturn({ code: '100', data: decodeCipher(data.key, data.ciphertext), })
      } catch (e) {
        return this.ajaxReturn({ code: '010', msg: 'failed', })
      }
      return
    }

    if (data.type !== 'decryption') {
      if (data.key.length != 32) {
        return this.ajaxReturn({ code: '001', msg: 'keys length 32', })
      }
      if (!data.text.length) {
        return this.ajaxReturn({ code: '002', msg: 'ciphertext required', })
      }
      try {
        return this.ajaxReturn({ code: '100', data: encodeCipher(data.key, data.text), })
      } catch (e) {
        return this.ajaxReturn({ code: '010', msg: 'failed', })
      }
      return
    }
  }

}

// get
router.get('/jsonpdata', (req, res) => new Application(req, res).jsonpdata())
// post
router.post('/redisSet', (req, res) => new Application(req, res).redisSet())
router.post('/dbinit', (req, res) => new Application(req, res).dbInit())
router.post('/add', (req, res) => new Application(req, res).add())
router.post('/delById', (req, res) => new Application(req, res).delById())
router.post('/delByWhere', (req, res) => new Application(req, res).delByWhere())
router.post('/getById', (req, res) => new Application(req, res).getById())
router.post('/getOne', (req, res) => new Application(req, res).getOne())
router.post('/getList', (req, res) => new Application(req, res).getList())
router.post('/getCount', (req, res) => new Application(req, res).getCount())
router.post('/markdown2pdf', (req, res) => new Application(req, res).markdown2pdf())
router.post('/serverCookie', (req, res) => new Application(req, res).serverCookie())
router.post('/aesCrypto', (req, res) => new Application(req, res).aesCrypto())
router.post('/uploadfile', cpUpload, (req, res) => new Application(req, res).upload())
router.post('/uploadBase64', upload.single('basefile'), (req, res) => new Application(req, res).uploadBase64())

module.exports = router;

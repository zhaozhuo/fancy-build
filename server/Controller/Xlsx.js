const path = require("path")
const express = require('express')
const router = express.Router()
const multer = require('multer')

const config = require('../config')
const upload = multer({ dest: config.upload.temp })
const DEBUG = process.env.NODE_ENV === 'development'

const XlsxModel = require('../Model/Xlsx.class')

class Application extends require('./Controller.class') {

  constructor(req, response, action) {
    super(req, response)
    this[action]()
  }

  xlsxUpload() {
    let {
      creator = '',
      creator_id = 0
    } = this.post

    let file = this.req.file
    if (!file) this.send({ code: '001', msg: 'file required' })

    let list = []
    let header = {
      '标题': 'title',
      '姓名': 'name',
      '电话': 'phone',
      '邮箱': 'email',
      '时间': 'time',
    }
    try {
      let data = XlsxModel.getData(file.path, 2)
      data.forEach(v => {
        let n = {}
        v.forEach(vv => header[vv.title] && (n[header[vv.title]] = vv.value))
        list.push(n)
      })
      return this.send({ code: '100', data: { header, list } })
    }
    catch (error) {
      this.send({ code: '000', msg: error })
    }
  }

  xlsxExport() {
    let filename = Date.now() + '.xlsx'
    let filepath = [config.upload.temp, '/', filename].join('')
    let res = XlsxModel.setData(filepath, this.post.header, this.post.list, 'test', 'test')
    if (res == false) {
      this.send({ code: '000', msg: 'error' })
    }
    this.send({
      code: '100',
      data: filename
    })
    this.response.download(filepath, `test${Date.now()}.xlsx`)
  }

  demoExport() {
    this.response.download(config.upload.temp + '/' + this.query.filename, `test${Date.now()}.xlsx`)
  }
  demoDownload() {
    this.response.download(path.resolve(__dirname, '../') + '/test.xlsx', 'test.xlsx')
  }

}

// https://github.com/expressjs/multer
router.post('/Upload', upload.single('file'), (req, res) => new Application(req, res, 'xlsxUpload'))
router.post('/Export', (req, res) => new Application(req, res, 'xlsxExport'))
router.get('/demoDownload', (req, res) => new Application(req, res, 'demoDownload'))
router.get('/demoExport', (req, res) => new Application(req, res, 'demoExport'))

module.exports = router;

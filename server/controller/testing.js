const fs = require('fs');
const express = require('express')
const router = express.Router()

const crypto = require("crypto");
const redis = require('redis')
const redisClient = require('../redis')
const logger = require('../logger')('script')

const testing = require('../model/testing')
const ControllerClass = require('../class/controller.class')

// https://github.com/expressjs/multer
const multer = require('multer')
const upload = multer({
  dest: 'upload.temp/'
});
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

class Controller extends ControllerClass {
  constructor() {
    super()
  }

  dbInit(req, response) {
    testing.init(true, resolve => { })
    response.send({
      code: '100',
      msg: 'success'
    })
  }

  async add(req, response) {
    super.test()
    let res = { code: '000', msg: 'error' }
    let data = req.body
    try {
      let row = await testing.save({
        data: {
          name: 'John891' + Math.floor(Math.random() * 1000),
          pid: Math.floor(Math.random() * 10),
          age: Math.floor(Math.random() * 100),
          // where: {
          //   id: 11,
          // }
        },
      });
      res = {
        data: row,
        code: '100',
      }
    } catch (err) {
      res.msg = err
    }
    response.send(res)
  }

  async delById(req, response) {
    let res = { code: '000', msg: 'error' }
    let data = req.body

    try {
      await testing.delById(data.id)
      res = {
        code: '100',
        msg: 'success'
      }
    } catch (err) {
      res.msg = err
    }
    response.send(res)
  }

  async getById(req, response) {
    let res = { code: '000', msg: 'error' }
    let data = req.body

    try {
      let row = await testing.getById(data.id)
      res = {
        code: '100',
        data: row,
        msg: 'success'
      }
    } catch (err) {
      res.msg = err
    }
    response.send(res)
  }

  async getList(req, response) {
    let res = { code: '000', msg: 'error' }
    let data = req.body

    try {
      let list = await testing.getList(data)
      res = {
        code: '100',
        data: list,
        msg: 'success'
      }
    } catch (err) {
      res.msg = err
    }
    response.send(res)
  }

  async getCount(req, response) {
    let res = { code: '000', msg: 'error' }
    let data = req.body

    try {
      let count = await testing.getCount(data)
      res = {
        code: '100',
        data: count,
        msg: 'success'
      }
    } catch (err) {
      res.msg = err
    }
    response.send(res)
  }

  async delByWhere(req, response) {
    let res = { code: '000', msg: 'error' }
    let data = req.body

    try {
      await testing.delByWhere(data)
      res = {
        code: '100',
        msg: 'success'
      }
    } catch (err) {
      res.msg = err
    }
    response.send(res)
  }

  async getOne(req, response) {
    let res = { code: '000', msg: 'error' }
    let data = req.body

    try {
      let row = await testing.getOne(data)
      res = {
        code: '100',
        data: row,
        msg: 'success'
      }
    } catch (err) {
      res.msg = err
    }
    response.send(res)
  }
  // =========================== others

  markdown2pdf(req, response) {
    const path = require('path')
    const markdownpdf = require("markdown-pdf")
    const root = path.resolve(__dirname, '../../')
    markdownpdf().from.string('wegweg').to(`${root}/dist/test1.pdf`, function (err, res) { });
    markdownpdf().from(`${root}/readme.md`).to(`${root}/dist/test2.pdf`, function (err, res) {
      response.send({
        code: '100',
        msg: 'success'
      })
    })
  }

  serverCookie(req, response) {
    response.cookie('test1', 'test value', {
      expires: new Date(Date.now() + 3600 * 1000 * 24),
      path: '/',
      httpOnly: true
    });
    response.send({
      code: '100',
      data: req.cookies.test1,
      msg: 'success'
    })
  }

  jsonpdata(req, response) {
    response.jsonp({
      code: '100',
      msg: 'success',
    })
  }

  redisSet(req, response) {
    redisClient.set('wefwef', Date.now(), 'EX', 3600 * 2, redis.print);
    redisClient.get("wefwef", function (err, reply) {
      // reply is null when the key is missing
      response.send({
        code: '100',
        msg: reply
      })
    });
  }

  upload(req, response) {
    let data = req.body;
    let files = req.files;
    req.files.avatar.forEach(file => {
      if (!/image\/\w+/.test(file.mimetype)) {
        response.jsonp({
          code: '001',
          msg: '请选择图像类型的文件',
        })
        return false;
      }
      fs.rename(file.path, 'upload/abc.wef', err => {
        if (err) {
          console.log('rename error: ' + err);
        } else {
          console.log('rename ok');
        }
      });
    })
    response.jsonp({
      code: '100',
      msg: 'success',
    })
  }
  uploadBase64(req, response) {
    let data = req.body;
    let source = data.base64
    let type = data.type

    let base64Data = source.replace(/^data:image\/\w+;base64,/, "");
    let dataBuffer = new Buffer(base64Data, 'base64');
    fs.writeFile("upload/out.png", dataBuffer, err => {
      if (err) {
        response.send(err);
        return
      }
      response.jsonp({
        code: '100',
        msg: '保存成功！',
      })
    });
  }

  aesCrypto(req, response) {
    console.log('123123123123123')
    const algorithm = 'AES-256-ECB';
    const clearEncoding = 'utf8';
    const cipherEncoding = 'base64';
    const iv = "";

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

    let data = req.body;
    if (data.type === 'decryption') {
      if (data.key.length != 32) {
        response.send({
          code: '001',
          msg: 'keys length 32',
        })
      }
      if (!data.ciphertext.length) {
        response.send({
          code: '002',
          msg: 'ciphertext required',
        })
      }
      try {
        response.send({
          code: '100',
          data: decodeCipher(data.key, data.ciphertext),
        })
      } catch (e) {
        response.send({
          code: '003',
          msg: 'failed',
        })
      }
      return;
    }

    if (data.type !== 'decryption') {
      if (data.key.length != 32) {
        response.send({
          code: '001',
          msg: 'keys length 32',
        })
      }
      if (!data.text.length) {
        response.send({
          code: '002',
          msg: 'ciphertext required',
        })
      }
      try {
        response.send({
          code: '100',
          data: encodeCipher(data.key, data.text),
        })
      } catch (e) {
        response.send({
          code: '003',
          msg: 'failed',
        })
      }
    }
  }
}


const App = new Controller()

router.post('/aesCrypto', App.aesCrypto)

router.post('/upload', cpUpload, App.upload)
router.post('/uploadBase64', App.uploadBase64)

router.post('/redisSet', App.redisSet)
router.post('/dbinit', App.dbInit)
router.post('/add', App.add)
router.post('/delById', App.delById)
router.post('/delByWhere', App.delByWhere)
router.post('/getById', App.getById)
router.post('/getOne', App.getOne)
router.post('/getList', App.getList)
router.post('/getCount', App.getCount)
router.post('/markdown2pdf', App.markdown2pdf)
router.post('/serverCookie', App.serverCookie)
router.get('/jsonpdata', App.jsonpdata)

module.exports = router;

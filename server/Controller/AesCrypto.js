const express = require('express')
const router = express.Router()
const crypto = require("crypto")

const DEBUG = process.env.NODE_ENV === 'development'

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

class Application extends require('./Controller.class') {

  constructor(req, response, action) {
    super(req, response)
    this[action]()
  }

  encryption() {
    let { key = '', content = '' } = this.post
    if (key.length != 32) return this.send({ code: '001', msg: 'key length must 32' })
    if (content.length == 0) return this.send({ code: '002', msg: 'content required' })

    try {
      return this.send({ code: '100', data: encodeCipher(key, content) })
    } catch (e) {
      return this.send({ code: '010', msg: 'failed', })
    }
  }

  decryption() {
    let { key = '', content = '' } = this.post
    if (key.length != 32) return this.send({ code: '001', msg: 'key length must 32' })
    if (content.length == 0) return this.send({ code: '002', msg: 'content required' })

    try {
      return this.send({ code: '100', data: decodeCipher(key, content) })
    } catch (e) {
      return this.send({ code: '010', msg: 'failed', })
    }
  }

}

router.post('/encode', (req, res) => new Application(req, res, 'encryption'))
router.post('/decode', (req, res) => new Application(req, res, 'decryption'))

module.exports = router;


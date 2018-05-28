'use strict'
const crypto = require('crypto')
const algorithm = 'AES-256-ECB'
const clearEncoding = 'utf8'
const cipherEncoding = 'base64'

function encodeCipher(key, data, iv = '') {
  let cipher = crypto.createCipheriv(algorithm, key, iv)
  cipher.setAutoPadding(true)
  let cipherChunks = []
  cipherChunks.push(cipher.update(data, clearEncoding, cipherEncoding))
  cipherChunks.push(cipher.final(cipherEncoding))
  return cipherChunks.join('')
}
function decodeCipher(key, ciphertext, iv = '') {
  let cipherChunks = [ciphertext]
  let decipher = crypto.createDecipheriv(algorithm, key, iv)
  let plainChunks = []
  for (let i = 0; i < cipherChunks.length; i++) {
    plainChunks.push(decipher.update(cipherChunks[i], cipherEncoding, clearEncoding))
  }
  plainChunks.push(decipher.final(clearEncoding))
  return plainChunks.join('')
}

function encodeSimple(psw, text) {
  let key = crypto.createHash('md5').update(psw).digest('hex')
  try {
    return encodeCipher(key, text)
  } catch (error) { }
  return false
}
function decodeSimple(psw, text) {
  let key = crypto.createHash('md5').update(psw).digest('hex')
  try {
    return decodeCipher(key, text)
  } catch (error) { }
  return false
}

module.exports = {
  encodeCipher,
  decodeCipher,
  encodeSimple,
  decodeSimple,
}

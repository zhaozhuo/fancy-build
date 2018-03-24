// https://github.com/chriso/validator.js

const validator = {
  isString(str) {
    return typeof str === 'string'
  },
  isNumeric(str) {
    return /^[-+]?[0-9]+$/.test(str)
  },
  isFullNumber(str) {
    return /^\d+$/.test(str)
  },
  isChinese(str) {
    return /^[\u4e00-\u9fa5]+$/.test(str)
  },
  isUrl(str) {
    return /^(https?|s?ftp):\/\/\S+$/i.test(str)
  },
  isIDCard(str) {
    return /^\d{6}(19|2\d)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)?$/.test(str)
    // return /(?:^\d{15}$)|(?:^\d{17}(?:[0-9]|X)$)/.test(str);
  },
  isUserName(str, min = 2, max = 20) {
    return !this.isNumeric(str) && str.length >= min && str.length <= max && /^(?!_|\s\')[A-Za-z0-9_\-\x80-\xff\s\']+$/.test(str)
  },
  isMobile(str) {
    return /^1[3|4|5|7|8][0-9]\d{8}$/.test(str)
  },
  isEmail(str) {
    return /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(str)
  },
  isUid(str) {
    return /^[A-Za-z0-9_\-\u4e00-\u9fa5]+$/.test(str)
    // \u0391-\uFFE5 匹配双字节字符（汉字+符号）
    // \u4e00-\u9fa5 只匹配汉字，不匹配双字节字符
  },
  isPwd(str) {
    return /^.*([\W_a-zA-z0-9-])+.*$/i.test(str)
  },
  isLength(str, min = 0, max) {
    let len = str.length
    return len >= min && (typeof max === 'undefined' || len <= max)
  },
  isLowercase(str) {
    return str === str.toLowerCase()
  },
  isDecimal(str) {
    let decimal = /^[-+]?([0-9]+|\.[0-9]+|[0-9]+\.[0-9]+)$/
    return str !== '' && decimal.test(str)
  },
  isDate(date) {
    let a = new Date(typeof date === 'string' ? date.replace(/[-.]/g, '/') : date)
    return !isNaN(a) ? a : false
  },
  // 密码强度
  simplePwd(str) {
    let pattern1 = /^.*([\W_])+.*$/i
    let pattern2 = /^.*([a-zA-Z])+.*$/i
    let pattern3 = /^.*([0-9])+.*$/i
    let level = 0
    if (str.length > 10) {
      level++
    }
    if (pattern1.test(str)) {
      level++
    }
    if (pattern2.test(str)) {
      level++
    }
    if (pattern3.test(str)) {
      level++
    }
    if (level > 3) {
      level = 3
    }
    return level
  },
}

export default validator

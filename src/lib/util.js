const Util = {
  getQueryAll() {
    let res = {}
    let str = window.location.search.substr(1)
    str != null && str.replace(/([^=&]+)=([^&]*)/g, (all, key, value) => {
      value && (res[key] = decodeURIComponent(value))
    })
    return res
  },
  getQuery(name) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)")
    let r = window.location.search.substr(1).match(reg)
    return r != null ? decodeURIComponent(r[2]) : ''
  },
  getCookie(name) {
    name = PREFIX + name
    let s = document.cookie.indexOf(name)
    let e = document.cookie.indexOf(";", s)
    return s == -1 ? '' : decodeURIComponent(document.cookie.substring(s + name.length + 1, (e > s ? e : document.cookie.length)))
  },
  setCookie(name, value, seconds, path, domain, secure) {
    name = PREFIX + name
    seconds = seconds ? seconds : 3600000
    let expires = new Date()
    expires.setTime(expires.getTime() + seconds)
    document.cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value) +
      (expires ? '; expires=' + expires.toUTCString() : '') +
      (path ? '; path=' + path : '/') +
      (domain ? '; domain=' + domain : '') +
      (secure ? '; secure' : '')
  },
  //截取汉字
  /*String.prototype.substr2 = function(a,b){
    let s = this.replace(/([^\x00-\xff])/g,"\x00$1")
    return(s.length<b) ? this : s.substring(a,b).replace(/\x00/g,'')
  }*/
  // 字符串截取 dot 补充字符
  subString(str, len, dot) {
    let cn = /[^\x00-\xff]/g
    let strLen = str.replace(cn, "**").length
    let newLen = 0
    let newStr = ''
    let tmpChar = ''

    for (let i = 0; i < strLen; i++) {
      tmpChar = str.charAt(i).toString()
      if (tmpChar.match(cn) != null) {
        newLen += 2
      } else {
        newLen++
      }
      if (newLen > len) {
        break
      }
      newStr += tmpChar
    }
    if (dot && strLen > len) {
      newStr += dot
    }
    return newStr
  },
  // 生成随机id
  mkRid(n) {
    let a = []
    a[n || 8] = ''
    return a.join('x').replace(/[xy]/g, function (c) {
      let r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  },
  urlhttp(url) {
    return url.replace(/^http(s?):/i, '')
  },
  loadJs(src, callback) {
    if (Array.isArray(src)) {
      if (src.length > 1) return this.loadJs(src.shift(), () => this.loadJs(src, callback))
      return this.loadJs(src[0], callback)
    }
    let script = document.createElement('script')
    script.src = src
    // script.setAttribute('async', 'async')
    document.getElementsByTagName('head')[0].appendChild(script)
    if (callback) script.onload = callback
  },
  loadCss(cfg) {
    let head = document.getElementsByTagName('head')[0]
    if (cfg.content) {
      let sty = document.createElement('style')
      sty.type = 'text/css'
      // IE
      if (sty.styleSheet) sty.styleSheet.cssText = cfg.content
      else sty.innerHTML = cfg.content
      head.appendChild(sty)
    } else if (cfg.url) {
      let link = document.createElement('link')
      link.href = cfg.url
      link.rel = 'stylesheet'
      link.type = 'text/css'
      head.appendChild(link)
    }
  },
}

module.exports = Util

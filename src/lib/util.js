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
    let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
    let r = window.location.search.substr(1).match(reg)
    return r != null ? decodeURIComponent(r[2]) : ''
  },
  getCookie(name) {
    let arr
    let reg = new RegExp('(^| )' + PREFIX + name + '=([^;]*)(;|$)')
    return (arr = document.cookie.match(reg)) ? decodeURIComponent(arr[2]) : ''
  },
  setCookie(name, value, seconds, path, domain, secure) {
    let _name = PREFIX + name
    let _seconds = seconds || 3600000
    let expires = new Date()
    expires.setTime(expires.getTime() + _seconds)
    document.cookie = _name + '=' + encodeURIComponent(value) +
      (expires ? '; expires=' + expires.toUTCString() : '') +
      (path ? '; path=' + path : '/') +
      (domain ? '; domain=' + domain : '') +
      (secure ? '; secure' : '')
  },
}

module.exports = Util

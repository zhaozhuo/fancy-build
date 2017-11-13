import reqwest from 'reqwest'
const noop = function() {}
const post = function(url, data, callback) {
  let option = {}
  if (typeof url === 'object') {
    option = url
    url = option.url
    data = option.data
  } else {
    if (typeof data === 'function') {
      callback = data
      data = {}
    }
  }
  let success = option.success || callback || noop
  let error = option.error || noop
  if (NETROOT) {
    url = NETROOT + url
  }
  reqwest({
    url,
    data,
    type: 'json',
    method: 'post',
    timeout: option.timeout || 5000,
    error: err => error(err),
    success: res => {
      if (res.msg === 'nologin') window.location = '/'
      success(res)
    },
  })
}

// const jsonp = function(url, data, callback) {
//   if (!callback) {
//     callback = data
//     data = {}
//   }
//   let opt = {
//     url: url,
//     data: data,
//     type: 'jsonp',
//     jsonpCallback: 'callback',
//     success: res => callback(res),
//     error: ex => {},
//   }
//   data.jsonpCallback && (opt.jsonpCallback = data.jsonpCallback)
//   return reqwest(opt)
// }

const getScript = function(src, callback) {
  if (Array.isArray(src)) {
    if (src.length > 1) return getScript(src.shift(), () => getScript(src, callback))
    return this.loadJs(src[0], callback)
  }
  let script = document.createElement('script')
  script.src = src
  document.getElementsByTagName('head')[0].appendChild(script)
  if (callback) script.onload = callback
}

module.exports = {
  post,
  getScript,
}

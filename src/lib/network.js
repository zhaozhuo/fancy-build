import reqwest from 'reqwest'
function noop() { }
function post(param, callback) {
  let {
    data = null,
    type = 'json',
    method = 'post',
    timeout = 5000,
  } = param
  const url = ((DEBUG && param.mock) ? '/mock/' : NETROOT) + param.url
  const promise = new Promise((resolve, reject) => {
    reqwest({
      url,
      data,
      type,
      method,
      timeout,
      error: () => {
        let err = '请求失败，请稍后重试！'
        return reject(err)
      },
      success: res => {
        if (res.msg === 'nologin') {
          window.location = '/'
          return
        }
        return resolve(res)
      }
    })
  })

  if (typeof param.success === 'function') {
    promise.then(param.success, param.error || noop)
  } else if (typeof callback === 'function') {
    promise.then(callback.bind(null, null), callback)
  }
  return promise
}

function getScript(src, callback) {
  if (Array.isArray(src)) {
    if (src.length > 1) return getScript(src.shift(), () => getScript(src, callback))
    return this.loadJs(src[0], callback)
  }
  const script = document.createElement('script')
  script.src = src
  document.getElementsByTagName('head')[0].appendChild(script)
  if (callback) script.onload = callback
}

module.exports = {
  post,
  getScript,
}

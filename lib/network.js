import reqwest from 'reqwest'

function post(param) {
  param.url = (NETROOT || '') + param.url
  param.type = param.type || 'json'
  param.method = param.method || 'post'
  param.timeout = param.timeout || 5000
  reqwest(param)
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

export default {
  post,
  getScript,
}

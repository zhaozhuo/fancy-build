const userAgent = navigator.userAgent.toLowerCase()
const isPhone = userAgent.indexOf('android') !== -1 ||
  userAgent.indexOf('iphone') !== -1 ||
  userAgent.indexOf('ipad') !== -1 ||
  userAgent.indexOf('ipod') !== -1 ||
  userAgent.indexOf('symbian') !== -1 ||
  userAgent.indexOf('micromessenger') !== -1

const isWeixin = userAgent.indexOf('micromessenger') !== -1
const isWeiBo = userAgent.indexOf('weibo') !== -1

const isWeixinVersion = version => {
  if (typeof version === 'number') {
    let wechat = userAgent.match(/micromessenger\/([\d.]+)/i)
    return (wechat && parseFloat(wechat[1]) >= version) ? wechat[1] : 0
  }
  return isWeixin
}

export default {
  isWeixinVersion,
  isWeixin,
  isWeiBo,
  isPhone,
}

'use strict'
const request = require('request')

// 微信企业号
class WeixinWork {
  constructor(opt = {}) {
    this.Corpid = opt.Corpid || ''
    this.AppAgentId = opt.AppAgentId || ''
    this.AppSecret = opt.AppSecret || ''
    this.CgiUrl = opt.CgiUrl || 'https://qyapi.weixin.qq.com/cgi-bin/'
  }

  accessToken(callback) {
    return this.getToken(callback)
  }

  /**
   * 获取access_token
   * @return json string
   */
  getToken(callback) {
    const url = `${this.CgiUrl}gettoken?corpid=${this.Corpid}&corpsecret=${this.AppSecret}`
    const promise = new Promise((resolve, reject) => {
      request(url, (err, response, body) => {
        if (err) return reject(err)
        try {
          let json = JSON.parse(body)
          if (json.errcode == 0) {
            return resolve({ token: json.access_token, body })
          }
          return reject(err || 'jsonError')
        } catch (e) {
          return reject(e)
        }
      })
    })
    typeof callback == 'function' && promise.then(callback.bind(null, null), callback)
    return promise
  }

  /**
   * 获取部门列表
   */
  departmentList(callback) {
    this.accessToken((err, { token }) => {
      if (err) return callback(err)
      const url = `${this.CgiUrl}department/list?access_token=${token}`
      request(url, (err, response, body) => callback(err || body))
    })
  }

  /**
   * 获取部门成员详情
   * @param {String} departmentId 获取的部门id
   * @param {Number} fetchChild   1/0：是否递归获取子部门下面的成员
   */
  userList({ departmentId = '', fetchChild = 1 }, callback) {
    this.accessToken((err, { token }) => {
      if (err) return callback(err)
      const url = `${this.CgiUrl}user/list?access_token=${token}&department_id=${departmentId}&fetch_child=${fetchChild}`
      request(url, (err, response, body) => callback(err || body))
    })
  }

  /**
   * 获取菜单
   * @param {String} agentid 授权方应用id
   */
  menuGet({ agentid = this.AppAgentId }, callback) {
    this.accessToken((err, { token }) => {
      if (err) return callback(err)
      const url = `${this.CgiUrl}menu/get?access_token=${token}&agentid=${agentid}`
      request(url, (err, response, body) => callback(err || body))
    })
  }

  /**
   * 创建菜单
   * @param {String} agentid 授权方应用id
   * @param {Object} menu 菜单数据
   */
  menuCreate({ agentid = this.AppAgentId, menu = {} }, callback) {
    this.accessToken((err, { token }) => {
      if (err) return callback(err)

      const url = `${this.CgiUrl}menu/create?access_token=${token}&agentid=${agentid}`
      request.post({ url, json: menu }, (err, response, res) => {
        if (err) return callback(err)
        if (res && res.errcode == 0) return callback(null)
        return callback(JSON.stringify(res || {}))
      })
    })
  }

  /**
   * 发送文本消息
   * @param {Object} data
   * @param {Array}  data.touser  成员ID列表（消息接收者，多个用‘|’分隔，最多支持1000个）。@all，则向该企业应用的全部成员发送
   * @param {Array}  data.toparty 部门ID列表，多个接收者用‘|’分隔，最多支持100个。当touser为@all时忽略本参数
   * @param {Array}  data.totag   标签ID列表，多个接收者用‘|’分隔，最多支持100个。当touser为@all时忽略本参数
   * @param {String} data.agentid 企业应用的id，整型。可在应用的设置页面查看
   * @param {String} data.content 消息内容，最长不超过2048个字节
   * @param {Number} data.safe    表示是否是保密消息，0表示否，1表示是，默认0
   */
  sendText(data, callback) {
    this.accessToken((err, { token }) => {
      if (err) return callback(err)
      const agentid = data.agentid || this.AppAgentId
      const url = `${this.CgiUrl}message/send?access_token=${token}`

      let touser = data.touser
      let toparty = data.toparty
      let totag = data.totag
      if (Array.isArray(touser)) {
        touser = [...new Set(touser)].join('!')
      }
      if (Array.isArray(toparty)) {
        toparty = [...new Set(toparty)].join('!')
      }
      if (Array.isArray(totag)) {
        totag = [...new Set(totag)].join('!')
      }

      const json = {
        touser,
        toparty,
        totag,
        text: {
          content: data.content,
        },
        safe: parseInt(data.safe) || 0,
        msgtype: 'text',
        agentid,
      }
      request.post({ url, json }, (err, response, res) => {
        if (err) return callback(err)
        if (res && res.errcode == 0) return callback(null)
        return callback(JSON.stringify(res || {}))
      })
    })
  }

  /**
   * 发送卡片消息
   * @param {Object} data
   * @param {Array}  data.touser     成员ID列表（消息接收者，多个接收者用‘|’分隔，最多支持1000个）。特殊情况：指定为@all，则向关注该企业应用的全部成员发送
   * @param {Array}  data.toparty    部门ID列表，多个接收者用‘|’分隔，最多支持100个。当touser为@all时忽略本参数
   * @param {Array}  data.totag      标签ID列表，多个接收者用‘|’分隔，最多支持100个。当touser为@all时忽略本参数
   * @param {String} data.agentid    企业应用的id，整型。可在应用的设置页面查看
   * @param {String} data.title      标题，不超过128个字节，超过会自动截断
   * @param {String} data.url        点击后跳转的链接。
   * @param {String} data.btntxt     按钮文字。 默认为“详情”， 不超过4个文字，超过自动截断。
   * @param {String} data.description 描述，不超过512个字节，超过会自动截断
   */
  sendTextCard(data, callback) {
    this.accessToken((err, { token }) => {
      if (err) return callback(err)
      const agentid = data.agentid || this.AppAgentId
      const url = `${this.CgiUrl}message/send?access_token=${token}`

      let touser = data.touser
      let toparty = data.toparty
      let totag = data.totag
      if (Array.isArray(touser)) {
        touser = [...new Set(touser)].join('!')
      }
      if (Array.isArray(toparty)) {
        toparty = [...new Set(toparty)].join('!')
      }
      if (Array.isArray(totag)) {
        totag = [...new Set(totag)].join('!')
      }

      const json = {
        touser,
        toparty,
        totag,
        textcard: JSON.parse(data.content),
        safe: parseInt(data.safe) || 0,
        msgtype: 'textcard',
        agentid: agentid,
      }
      request.post({ url, json }, (err, response, res) => {
        if (err) return callback(err)
        if (res && res.errcode == 0) return callback(null)
        return callback(JSON.stringify(res || {}))
      })
    })
  }
}

module.exports = WeixinWork

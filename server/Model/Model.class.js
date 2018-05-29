'use strict'
// @2018-05-30
const mysql = require('mysql')
const db = require('../mysql')
const logger = require('../logger')('Model')

function htmlspecialchars(str) {
  if (!str || typeof str !== 'string') return str
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }
  return str.replace(/[&<>"']/g, m => map[m])
}
function htmlspecialcharsDecode(str) {
  if (!str || typeof str !== 'string') return str
  const map = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#039;': "'" }
  return str.replace(/&amp;|&lt;|&gt;|&quot;|&#039;/g, m => map[m])
}

function strEscape(str, specialchars = true) {
  return mysql.escape(specialchars ? htmlspecialchars(str) : str)
}

// specialchars boolean array
function dataEscape(data, specialchars = true, definition = false) {
  let filter = Array.isArray(specialchars) ? specialchars : []
  for (let i in data) {
    if (typeof data[i] === 'object' && data[i].hasOwnProperty('$inc')) {
      data[i] = [i, (data[i]['$inc'] || 1)].join('+')
      continue
    }
    if (definition && definition.hasOwnProperty(i)) {
      let d = definition[i]
      d.format && (data[i] = d.format(data[i]))
      if (d.validate) {
        let valid = d.validate(data[i], htmlspecialcharsDecode)
        if (valid !== true) return valid
      }
    }
    let v = data[i]
    let y = specialchars ? !filter.includes(i) : false
    data[i] = typeof v === 'object' ? strEscape(JSON.stringify(v), y) : strEscape(v, y)
  }
  return data
}

const alias = {
  $or: 'or',
  $gt: '>',
  $gte: '>=',
  $lt: '<',
  $lte: '<=',
  $ne: '!=',
  $eq: '=',
  $in: 'IN',
  $notIn: 'NOT IN',
  $like: 'LIKE',
  $notLike: 'NOT LIKE',
}
// mysql where query
function queryWhere(data, $as, field, parents, le = 0) {
  let res = []
  let level = le + 1
  let _as = $as ? `${$as}.` : ''
  if (['$in', '$notIn'].includes(field)) {
    return `${_as}${parents} ${alias[field]} (${data.length ? strEscape(data) : null})`
  }
  if (['$like', '$notLike'].includes(field)) {
    return `${_as}${parents} ${alias[field]} ${strEscape('%' + data + '%')}`
  }
  if (['$eq', '$ne', '$gte', '$gt', '$lte', '$lt'].includes(field)) {
    if (data == null) {
      if ('$eq' === field) return `${_as}${parents} IS NULL`
      if ('$ne' === field) return `${_as}${parents} IS NOT NULL`
    }
    return [_as + parents, strEscape(data)].join(` ${alias[field]} `)
  }
  if (typeof data === 'object') {
    if (data === null) return `${_as}${field} IS NULL`
    if (Array.isArray(data)) {
      if (data.length) {
        for (let value of data) {
          res.push(`${queryWhere(value, $as, false, false, level)}`)
        }
      } else {
        res.push(`${queryWhere('', $as, field, false, level)}`)
      }
    } else {
      for (let i in data) {
        res.push(queryWhere(data[i], $as, i, field, level))
      }
    }
    if (field === '$or') {
      return res.length > 0 ? `(${res.join(' OR ')})` : res.join(' OR ')
    }
    return res.length > 1 && level > 1 ? `(${res.join(' AND ')})` : res.join(' AND ')
  }
  return [_as + field, strEscape(data)].join(' = ')
}
function queryOrder(data, $as) {
  if (typeof data === 'string') {
    return data
  }
  let res = []
  let _as = $as ? `${$as}.` : ''
  for (let i in data) {
    res.push(`${_as}${i} ${data[i]}`)
  }
  return res.join(',')
}
//   let where = {
//     valid: '1',
//     name: {
//       $like: 'name'
//     },
//     status: {
//       $notIn: [1, 2, 3, 0, 13]
//     },
//     ctime: {
//       $gt: '2017-08-01 00:00:00',
//       $lt: '2017-09-07 00:00:00',
//     },
//     $or: [
//       { id1: 10 },
//       { id2: 10 },
//       {
//         id3: {
//           $gt: 13,
//           $lt: 15,
//         },
//       },
//       {
//         id5: {
//           $in: [1, 2, 3, 4],
//           $like: '"\\like'
//         }
//       }
//     ],
//   }

// Basic MODEL
class ModelClass {
  constructor(table, definition = false, log = false) {
    this.model = db.pool
    this.table = db.prefix + table
    this.definition = definition
    this.queryWhere = queryWhere
    this.queryOrder = queryOrder
    this.htmlspecialchars = htmlspecialchars
    this.htmlspecialcharsDecode = htmlspecialcharsDecode
    this.logger = log === false ? false : (log || logger)
  }

  query(sql, callback) {
    const promise = new Promise((resolve, reject) => {
      this.logger && this.logger.info(sql)
      this.model.query(sql, (err, res) => {
        if (err) {
          this.logger && this.logger.error(err)
          return reject(err.code)
        }
        return resolve(res)
      })
    })
    typeof callback === 'function' && promise.then(callback.bind(null, null), callback)
    return promise
  }

  // return insertId
  create(data = {}, callback = false, option = {}) {
    let { specialchars = true, onlySql = false } = typeof callback === 'function' ? option : callback

    const _data = dataEscape(data, specialchars, this.definition)
    const promise = new Promise((resolve, reject) => {
      if (typeof _data === 'string') return reject(_data)
      const keys = Object.keys(_data)
      const values = Object.values(_data)
      const sql = `INSERT INTO ${this.table} (${keys.join(',')}) VALUES (${values.join(',')})`
      if (onlySql) return resolve(sql)

      this.logger && this.logger.info(sql)
      this.model.query(sql, (err, res) => {
        if (err) {
          this.logger && this.logger.error(err)
          return reject(err.code)
        }
        return resolve(res.insertId)
      })
    })

    typeof callback === 'function' && promise.then(callback.bind(null, null), callback)
    return promise
  }

  // param.fields
  // param.values  ex: [ [1,2,3], [3,4,5] ]
  // "fieldCount": 0,
  // "affectedRows": 5,
  // "insertId": 1,
  // "serverStatus": 2,
  // "warningCount": 0,
  // "message": "&Records: 5  Duplicates: 0  Warnings: 0",
  // "protocol41": true,
  // "changedRows": 0
  createMultiple(param = {}, callback) {
    const field = Array.isArray(param.fields) ? param.fields.join(',') : param.fields
    const values = param.values
    const sql = `INSERT INTO ${this.table} (${field}) VALUES ?`

    const promise = new Promise((resolve, reject) => {
      this.logger && this.logger.info(sql)
      this.model.query(sql, [values], (err, res) => {
        if (err) {
          this.logger && this.logger.error(err)
          return reject(err.code)
        }
        return resolve(res)
      })
    })

    typeof callback == 'function' && promise.then(callback.bind(null, null), callback)
    return promise
  }

  // param.data
  // param.update
  duplicateUpdate(param = {}, callback = true, option = {}) {
    let { specialchars = true, onlySql = false } = typeof callback === 'function' ? option : callback
    let tmp = Object.is(param.data, param.update) ? Object.assign({}, param.update) : param.update

    const _data = dataEscape(param.data, specialchars, this.definition)
    const _update = dataEscape(tmp, specialchars, this.definition)

    const promise = new Promise((resolve, reject) => {
      if (typeof _data === 'string') return reject(_data)
      const keys = Object.keys(_data)
      const values = Object.values(_data)
      const upvalues = Object.entries(_update).map(v => v.join('='))
      const sql = `INSERT INTO ${this.table} (${keys.join(',')}) VALUES (${values.join(',')}) ON DUPLICATE KEY UPDATE ${upvalues.join(',')}`
      if (onlySql) return resolve(sql)

      this.logger && this.logger.info(sql)
      this.model.query(sql, (err, res) => {
        if (err) {
          this.logger && this.logger.error(err)
          return reject(err.code)
        }
        return resolve(res.insertId)
      })
    })

    typeof callback === 'function' && promise.then(callback.bind(null, null), callback)
    return promise
  }

  // param.data     // {id : 12, name: 'name'}
  // param.where
  setByWhere(param = {}, callback = false, option = {}) {
    let { specialchars = true, onlySql = false } = typeof callback === 'function' ? option : callback

    const _data = dataEscape(param.data, specialchars, this.definition)
    const promise = new Promise((resolve, reject) => {
      if (typeof _data === 'string') return reject(_data)
      const values = Object.entries(_data).map(v => v.join('='))
      const where = param.where ? ` WHERE ${this.queryWhere(param.where)}` : ''
      const sql = `UPDATE ${this.table} SET ${values.join(',')}${where}`
      if (onlySql) return resolve(sql)

      this.logger && this.logger.info(sql)
      this.model.query(sql, (err, res) => {
        if (err) {
          this.logger && this.logger.error(err)
          return reject(err.code)
        }
        return resolve(res.changedRows)
      })
    })

    typeof callback == 'function' && promise.then(callback.bind(null, null), callback)
    return promise
  }

  // return affectedRows
  deleteByWhere(param = {}, callback = false, option = {}) {
    let { onlySql = false } = typeof callback === 'function' ? option : callback

    const sql = `DELETE FROM ${this.table} WHERE ${this.queryWhere(param.where)}`
    if (onlySql) return sql

    const promise = new Promise((resolve, reject) => {
      this.logger && this.logger.info(sql)
      this.model.query(sql, (err, res) => {
        if (err) {
          this.logger && this.logger.error(err)
          return reject(err.code)
        }
        return resolve(res.affectedRows)
      })
    })
    typeof callback == 'function' && promise.then(callback.bind(null, null), callback)
    return promise
  }

  // param.where
  // param.order     // 排序 ｛id: 'desc', 'time': 'asc'}
  // param.fields    // 字段  'id,pid,time'
  getOne(param = {}, callback = false, option = {}) {
    let { onlySql = false } = typeof callback === 'function' ? option : callback
    let {
      where,
      order,
      fields = '*',
      $as = '',
    } = param
    let _as = $as ? ` ${$as}` : ''

    const _where = where ? ` WHERE ${this.queryWhere(where, $as)}` : ''
    const _order = order ? ` ORDER BY ${this.queryOrder(order, $as)}` : ''
    const _field = Array.isArray(fields) ? fields.join(',') : (fields || '*')
    const sql = `SELECT ${_field} FROM ${this.table}${_as}${_where}${_order} LIMIT 1`
    if (onlySql) return sql

    const promise = new Promise((resolve, reject) => {
      this.logger && this.logger.info(sql)
      this.model.query(sql, (err, res) => {
        if (err) {
          this.logger && this.logger.error(err.sqlMessage)
          return reject(err.code)
        }
        return resolve(res[0])
      })
    })
    typeof callback == 'function' && promise.then(callback.bind(null, null), callback)
    return promise
  }

  // param.where
  // param.order     // 排序 ｛id: 'desc', 'time': 'asc'}
  // param.fields    // 字段  'id,pid,time'
  // param.page      // 当前页
  // param.perpage   // 每页数量
  // param.count     // 是否查询总数
  getList(param = {}, callback = false, option = {}) {
    let { onlySql = false } = typeof callback === 'function' ? option : callback
    let {
      where,
      order,
      fields = '*',
      page = 1,
      perpage = 10,
      count = false,
      $as = '',
    } = param
    page = Math.max(1, parseInt(page))
    perpage = Math.max(1, parseInt(perpage))

    const self = this
    const _where = where ? ` WHERE ${this.queryWhere(where, $as)}` : ''
    const _order = order ? ` ORDER BY ${this.queryOrder(order, $as)}` : ''
    const _field = Array.isArray(fields) ? fields.join(',') : fields
    const _start = (page - 1) * perpage
    const _as = $as ? ` ${$as}` : ''

    const promise = new Promise((resolve, reject) => {
      count ? __count() : __list()
      function __count() {
        const sql = `SELECT COUNT(1) FROM ${self.table}${_as}${_where}`
        self.logger && self.logger.info(sql)
        self.model.query(sql, (err, res) => {
          if (err) {
            self.logger && self.logger.error(err)
            return reject(err.code)
          }
          count = res[0] ? res[0]['COUNT(1)'] : 0
          return count ? __list(count) : resolve({
            data: [],
            pages: {
              page,
              perpage,
              count,
              pagecount: Math.ceil(count / perpage),
            }
          })
        })
      }
      function __list(count = 0) {
        const sql = `SELECT ${_field} FROM ${self.table}${_as}${_where}${_order} LIMIT ${_start}, ${perpage}`
        if (onlySql) return resolve(sql)

        self.logger && self.logger.info(sql)
        self.model.query(sql, (err, res) => {
          if (err) {
            self.logger && self.logger.error(err)
            return reject(err.code)
          }
          return resolve({
            data: res,
            pages: {
              page,
              perpage,
              count,
              pagecount: Math.ceil(count / perpage),
            }
          })
        })
      }
    })
    typeof callback == 'function' && promise.then(callback.bind(null, null), callback)
    return promise
  }

  // return number
  getCount(where = null, callback) {
    let sql = `SELECT COUNT(1) from ${this.table}${where ? ` WHERE ${this.queryWhere(where)}` : ''}`
    this.logger && this.logger.info(sql)

    const promise = new Promise((resolve, reject) => {
      this.model.query(sql, (err, res) => {
        if (err) {
          this.logger && this.logger.error(err)
          return reject(err.code)
        }
        return resolve(res[0] ? res[0]['COUNT(1)'] : 0)
      })
    })
    typeof callback == 'function' && promise.then(callback.bind(null, null), callback)
    return promise
  }
}

module.exports = ModelClass

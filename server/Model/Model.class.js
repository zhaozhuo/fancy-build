const mysql = require('mysql')
const db = require('../mysql')
const logger = require('../logger')('Model')

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
function queryWhere(data, field, parents, le = 0) {
  let res = []
  let level = le + 1
  if (['$in', '$notIn'].includes(field)) {
    return `${parents} ${alias[field]} (${mysql.escape(data)})`
  }
  if (['$like', '$notLike'].includes(field)) {
    return `${parents} ${alias[field]} ${mysql.escape('%' + data + '%')}`
  }
  if (['$eq', '$ne', '$gte', '$gt', '$lte', '$lt'].includes(field)) {
    return [parents, mysql.escape(data)].join(` ${alias[field]} `)
  }
  if (typeof data === 'object') {
    if (Array.isArray(data)) {
      for (let value of data) {
        res.push(`${queryWhere(value, false, false, level)}`)
      }
    } else {
      for (let i in data) {
        res.push(queryWhere(data[i], i, field, level))
      }
    }
    if (field === '$or') {
      return res.length > 0 ? `(${res.join(' OR ')})` : res.join(' OR ')
    }
    return res.length > 1 && level > 1 ? `(${res.join(' AND ')})` : res.join(' AND ')
  }
  return [field, mysql.escape(data)].join(' = ')
}
function queryOrder(data) {
  if (typeof data === 'string') {
    return data
  }
  let res = []
  for (let i in data) {
    res.push(`${i} ${data[i]}`)
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

function htmlspecialchars(str) {
  if (typeof str !== 'string' || !str) return str
  let map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }
  return str.replace(/[&<>"']/g, m => map[m])
}

function htmlspecialchars_decode(str) {
  if (typeof str !== 'string' || !str) return str
  let map = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#039;': "'",
  }
  return str.replace(/[&<>"']/g, m => map[m])
}

// Basic MODEL
class ModelClass {
  constructor(table) {
    this.model = db.pool
    this.table = db.prefix + table
    this.queryWhere = queryWhere
    this.queryOrder = queryOrder
  }

  // return insertId
  create(data = {}, callback) {
    let keys = Object.keys(data)
    let values = Object.values(data).map(v => mysql.escape(typeof v == 'object' ? JSON.stringify(v) : v))
    let sql = `INSERT INTO ${this.table} (${keys.join(',')}) VALUES (${values.join(',')})`
    logger.info(sql)

    const promise = new Promise((resolve, reject) => {
      this.model.query(sql, (err, res) => {
        if (err) {
          logger.error(err)
          return reject(err.code)
        }
        return resolve(res.insertId)
      })
    })
    if (callback && typeof callback == 'function') {
      promise.then(callback.bind(null, null), callback)
    }
    return promise
  }

  // param.field
  // param.values  ex: [ [1,2,3], [3,4,5] ]
  createMultiple(param = {}, callback) {
    let field = Array.isArray(param.fields) ? param.fields.join(',') : param.fields
    let values = param.values
    let sql = `INSERT INTO ${this.table} (${field}) VALUES ?`
    logger.info(sql)

    const promise = new Promise((resolve, reject) => {
      this.model.query(sql, [values], (err, res) => {
        if (err) {
          logger.error(err)
          return reject(err.code)
        }
        return resolve(res)
      })
    })

    if (callback && typeof callback == 'function') {
      promise.then(callback.bind(null, null), callback)
    }
    return promise
  }

  // param.data     // {id : 12, name: 'name'}
  // param.where
  setByWhere(param = {}, callback) {
    let values = Object.entries(param.data).map(v => v[0] + '=' + mysql.escape(typeof v[1] == 'object' ? JSON.stringify(v[1]) : v[1]))
    let where = param.where ? ` WHERE ${this.queryWhere(param.where)}` : ''
    let sql = `UPDATE ${this.table} SET ${values.join(',')}${where}`
    logger.info(sql)

    const promise = new Promise((resolve, reject) => {
      this.model.query(sql, (err, res) => {
        if (err) {
          logger.error(err)
          return reject(err.code)
        }
        return resolve(res.insertId)
      })
    })
    if (callback && typeof callback == 'function') {
      promise.then(callback.bind(null, null), callback)
    }
    return promise
  }

  // return affectedRows
  deleteByWhere(param = {}, callback) {
    let sql = `DELETE FROM ${this.table} WHERE ${this.queryWhere(param.data)}`
    logger.info(sql)

    const promise = new Promise((resolve, reject) => {
      this.model.query(sql, (err, res) => {
        if (err) {
          logger.error(err)
          return reject(err.code)
        }
        return resolve(res.affectedRows)
      })
    })
    if (callback && typeof callback == 'function') {
      promise.then(callback.bind(null, null), callback)
    }
    return promise
  }

  // param.where
  // param.order     // 排序 ｛id: 'desc', 'time': 'asc'}
  // param.fields    // 字段  'id,pid,time'
  getOne(param = {}, callback) {
    let where = param.where ? ` WHERE ${this.queryWhere(param.where)}` : ''
    let order = param.order ? ` ORDER BY ${this.queryOrder(param.order)}` : ''
    let field = Array.isArray(param.fields) ? param.fields.join(',') : (param.fields || '*')
    let sql = `SELECT ${field} FROM ${this.table}${where}${order} LIMIT 1`
    logger.info(sql)

    const promise = new Promise((resolve, reject) => {
      this.model.query(sql, (err, res) => {
        if (err) {
          logger.error(err.sqlMessage)
          return reject(err.code)
        }
        return resolve(res[0])
      })
    })
    if (callback && typeof callback == 'function') {
      promise.then(callback.bind(null, null), callback)
    }
    return promise
  }

  // param.where
  // param.order     // 排序 ｛id: 'desc', 'time': 'asc'}
  // param.fields    // 字段  'id,pid,time'
  // param.page      // 当前页
  // param.perpage   // 每页数量
  // param.count     // 是否查询总数
  getList(param = {}, callback) {
    let {
      where,
      order,
      fields = '*',
      page = 1,
      perpage = 10,
      count = false,
    } = param
    page = Math.max(1, parseInt(page))
    perpage = Math.max(1, parseInt(perpage))

    let self = this
    let _where = where ? ` WHERE ${this.queryWhere(where)}` : ''
    let _order = order ? ` ORDER BY ${this.queryOrder(order)}` : ''
    let _field = Array.isArray(fields) ? fields.join(',') : fields
    let _start = (page - 1) * perpage

    const promise = new Promise((resolve, reject) => {
      count ? __count() : __list()
      function __count() {
        let sql = `SELECT COUNT(*) FROM ${self.table}${_where}`
        logger.info(sql)
        self.model.query(sql, (err, res) => {
          if (err) {
            logger.error(err)
            return reject(err.code)
          }
          count = res[0] ? res[0]['COUNT(*)'] : 0
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
        let sql = `SELECT ${_field} FROM ${self.table}${_where}${_order} LIMIT ${_start}, ${perpage}`
        logger.info(sql)
        self.model.query(sql, (err, res) => {
          if (err) {
            logger.error(err)
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
    if (callback && typeof callback == 'function') {
      promise.then(callback.bind(null, null), callback)
    }
    return promise
  }

  // return number
  getCount(where = null, callback) {
    let sql = `SELECT COUNT(*) from ${this.table}${where ? ` WHERE ${this.queryWhere(where)}` : ''}`
    logger.info(sql)

    const promise = new Promise((resolve, reject) => {
      this.model.query(sql, (err, res) => {
        if (err) {
          logger.error(err)
          return reject(err.code)
        }
        return resolve(res[0] ? res[0]['COUNT(*)'] : 0)
      })
    })
    if (callback && typeof callback == 'function') {
      promise.then(callback.bind(null, null), callback)
    }
    return promise
  }
}

module.exports = ModelClass

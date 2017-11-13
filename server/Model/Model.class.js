const mysql = require('mysql')
const logger = require('../logger')
const db = require('../mysql')
const noop = function () { }
const DEBUG = process.env.NODE_ENV === 'development'

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
function queryWhere(data, field, parents, level = 0) {
  let res = []
  level++
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
  let res = []
  for (let i in data) {
    res.push(`${i} ${data[i]}`)
  }
  return res.join(',')
}
// test
function testQuery() {
  let where = {
    p_valid: '1',
    p_type: '4',
    p_searchcriteria2: {
      $like: '易用'
    },
    p_searchcriteria5: {
      $like: '目'
    },
    p_status: {
      $notIn: [1, 2, 3, 0, 13]
    },
    p_creattime: {
      $gt: '2017-08-01 00:00:00',
      $lt: '2017-09-07 00:00:00',
    },
    $or: [
      { id1: 10 },
      { id2: 10 },
      {
        id3: {
          $gt: 13,
          $lt: 15,
        },
      },
      {
        id5: {
          $in: [1, 2, 3, 4],
          $like: '"\\like'
        }
      }
    ],
  }
  let order = {
    id: 'desc',
    time: 'asc',
  }
  console.log(queryWhere(where))
  console.log(queryOrder(order))
}

// Basic MODEL
class ModelClass {

  constructor(table) {
    this.model = db.pool
    this.table = db.prefix + table
    this.queryWhere = queryWhere
    this.queryOrder = queryOrder
    this.logger = logger('Model.' + table)
  }

  // return insertId
  create(data = {}) {
    return new Promise((resolve, reject) => {
      let keys = Object.keys(data)
      let values = Object.values(data).map(v => mysql.escape(typeof v == 'object' ? JSON.stringify(v) : v))
      let sql = `INSERT INTO ${this.table} (${keys.join(',')}) VALUES (${values.join(',')})`

      this.logger.info(sql)
      this.model.query(sql, (err, res) => {
        if (err) {
          this.logger.error(err)
          return reject(DEBUG ? err : err.code)
        }
        return resolve(res.insertId)
      })
    })
  }

  // param.data     // {id : 12, name: 'name'}
  // param.where
  setByWhere(param = {}) {
    return new Promise((resolve, reject) => {
      let values = Object.entries(param.data).map(v => v[0] + '=' + mysql.escape(typeof v[1] == 'object' ? JSON.stringify(v[1]) : v[1]))
      let where = param.where ? ` WHERE ${this.queryWhere(param.where)}` : ''
      let sql = `UPDATE ${this.table} SET ${values.join(',')}${where}`

      this.logger.info(sql)
      this.model.query(sql, (err, res) => {
        if (err) {
          this.logger.error(err)
          return reject(DEBUG ? err : err.code)
        }
        return resolve(res.insertId)
      })
    })
  }

  // return affectedRows
  deleteByWhere(param = {}) {
    return new Promise((resolve, reject) => {
      let sql = `DELETE FROM ${this.table} WHERE ${this.queryWhere(param.data)}`
      this.logger.info(sql)
      this.model.query(sql, (err, res) => {
        if (err) {
          this.logger.error(err)
          return reject(DEBUG ? err : err.code)
        }
        return resolve(res.affectedRows)
      })
    })
  }

  // param.where
  // param.order     // 排序 ｛id: 'desc', 'time': 'asc'}
  // param.fields    // 字段  'id,pid,time'
  getOne(param = {}) {
    return new Promise((resolve, reject) => {
      let where = param.where ? ` WHERE ${this.queryWhere(param.where)}` : ''
      let order = param.order ? ` ORDER BY ${this.queryOrder(param.order)}` : ''
      let field = Array.isArray(param.fields) ? param.fields.join(',') : param.fields
      let sql = `SELECT ${_field} FROM ${this.table}${_where}${_order} LIMIT 1, 1`

      this.logger.info(sql)
      this.model.query(sql, (err, res) => {
        if (err) {
          this.logger.error(err)
          return reject(DEBUG ? err : err.code)
        }
        return resolve(res[0])
      })
    })
  }

  // param.where
  // param.order     // 排序 ｛id: 'desc', 'time': 'asc'}
  // param.fields    // 字段  'id,pid,time'
  // param.page      // 当前页
  // param.perpage   // 每页数量
  // param.count     // 是否查询总数
  getList(param = {}) {
    let self = this
    return new Promise((resolve, reject) => {
      let {
        where,
        order,
        fields = '*',
        page = 1,
        perpage = 20,
        count = false,
      } = param
      page = Math.max(1, parseInt(page))
      perpage = Math.max(1, parseInt(perpage))

      let _where = where ? ` WHERE ${this.queryWhere(where)}` : ''
      let _order = order ? ` ORDER BY ${this.queryOrder(order)}` : ''
      let _field = Array.isArray(fields) ? fields.join(',') : fields
      let _start = (page - 1) * perpage
      let _end = _start + perpage

      count ? __count() : __list()

      function __count() {
        let sql = `SELECT COUNT(*) FROM ${self.table}${_where}`
        self.logger.info(sql)
        self.model.query(sql, (err, res) => {
          if (err) {
            self.logger.error(err)
            return reject(DEBUG ? err : err.code)
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
        let sql = `SELECT ${_field} FROM ${self.table}${_where}${_order} LIMIT ${_start}, ${_end}`
        self.logger.info(sql)
        self.model.query(sql, (err, res) => {
          if (err) {
            self.logger.error(err)
            return reject(DEBUG ? err : err.code)
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
  }

  // return number
  getCount(where = null) {
    return new Promise((resolve, reject) => {
      let sql = `SELECT COUNT(*) from ${this.table}${where ? ` WHERE ${this.queryWhere(where)}` : ''}`
      this.logger.info(sql)
      this.model.query(sql, (err, res) => {
        if (err) {
          this.logger.error(err)
          return reject(DEBUG ? err : err.code)
        }
        return resolve(res[0] ? res[0]['COUNT(*)'] : 0)
      })
    })
  }

}
module.exports = ModelClass

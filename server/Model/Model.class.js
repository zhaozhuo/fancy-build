const mysql = require('mysql')
const logger = require('../logger')('sql')
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
  let res = [];
  level++
  if (['$in', '$notIn'].includes(field)) {
    return `${parents} ${alias[field]} (${data})`
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
  }

  // return insertId
  create(data = {}) {
    return new Promise((resolve, reject) => {
      let keys = Object.keys(data)
      let values = Object.values(data).map(v => mysql.escape(typeof v == 'object' ? JSON.stringify(v) : v))
      let sql = `INSERT INTO ${this.table} (${keys.join(',')}) VALUES (${values.join(',')})`
      logger.info(sql)

      try {
        this.model.query(sql, (err, res) => {
          if (err) {
            logger.error(err)
            return reject(DEBUG ? err : err.code)
          }
          return resolve(res.insertId)
        })
      } catch (error) {
        logger.error(error)
        return reject(error)
      }
    })
  }

  // id
  // fields = ['p_id', 'p_pid'] or 'p_id,p_pid'
  getById(id = 0, fields = []) {
    return new Promise((resolve, reject) => {
      let _field = Array.isArray(fields) && fields.length ? fields.join(',') : '*'
      let sql = `SELECT ${_field} from ${this.table} WHERE id = ${mysql.escape(id)}`
      logger.info(sql)

      try {
        this.model.query(sql, (err, res) => {
          if (err) {
            logger.error(err)
            return reject(DEBUG ? err : err.code)
          }
          return resolve(res[0] || [])
        })
      } catch (error) {
        logger.error(error)
        return reject(error)
      }
    })
  }

  // param.where
  // param.order     // 排序 ｛id: 'desc', 'time': 'asc'}
  // param.fields    // 字段  'id,pid,time'
  // param.page      // 当前页
  // param.perpage   // 每页数量
  // param.count     // 是否查询总数
  getList(param = {}) {
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

      let _table = this.table
      let _model = this.model
      let _where = where ? ` WHERE ${this.queryWhere(where)}` : ''
      let _order = order ? ` ORDER BY ${this.queryOrder(order)}` : ''
      let _field = Array.isArray(fields) ? fields.join(',') : fields
      let _start = (page - 1) * perpage
      let _end = _start + perpage

      count ? __count() : __list()

      function __count() {
        let sql = `SELECT COUNT(*) FROM ${_table}${_where}`
        logger.info(sql)

        try {
          _model.query(sql, (err, res) => {
            if (err) {
              logger.error(err)
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
        } catch (error) {
          return reject(error)
        }
      }

      function __list(count = 0) {
        let sql = `SELECT ${_field} FROM ${_table}${_where}${_order} LIMIT ${_start}, ${_end}`
        logger.info(sql)

        try {
          _model.query(sql, (err, res) => {
            if (err) {
              logger.error(err)
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
        } catch (error) {
          logger.error(error)
          return reject(error)
        }

      }
    })
  }

  // return number
  getCount(where = null) {
    return new Promise((resolve, reject) => {
      let _where = where ? ` WHERE ${this.queryWhere(where)}` : '';
      let sql = `SELECT COUNT(*) from ${this.table}${_where}`
      logger.info(sql)

      try {
        this.model.query(sql, (err, res) => {
          if (err) {
            logger.error(err)
            return reject(DEBUG ? err : err.code)
          }
          return resolve(res[0] ? res[0]['COUNT(*)'] : 0)
        })
      }
      catch (error) {
        logger.error(error)
        reject(error)
      }
    })
  }

  // param.data.id
  // param.data.values = {p_id : 12, p_name: 'name'}
  // param.error(string)
  // param.success(string)
  setById(param = {}) {
    let _error = param.error || noop;
    let data = param.data || {};
    if (!data.id) return _error('id required')
    if (!data.values) return _error('values required')

    let _values = [];
    for (let i in data.values) {
      _values.push(`${i} = ${mysql.escape(data.values[i])}`)
    }
    _sql = `UPDATE ${this.table} SET ${_values.join(',')} WHERE p_id=${mysql.escape(data.id)}`;

    this.model.query(_sql, (err, res, fields) => {
      if (err) {
        logger.warn(err);
        return _error("search error")
      }
      logger.info(_sql)
      param.success && param.success(res)
    })
  }

}
module.exports = ModelClass

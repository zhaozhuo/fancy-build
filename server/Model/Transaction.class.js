'use strict'
// @2018-05-30
const db = require('../mysql')
const logger = require('../logger')('Transaction')

class ModelClass {
  constructor(log = false) {
    this.conn = false
    this.logger = log === false ? false : (log || logger)
  }

  set(callback) {
    let self = this
    const promise = new Promise((resolve, reject) => {
      db.pool.getConnection((err, conn) => {
        if (err) {
          self.logger.error(err)
          return reject(err.code)
        }
        conn.beginTransaction(e => {
          if (e) {
            self.logger.error(e)
            conn.release()
            return reject(e.code)
          }
          self.conn = conn
          return resolve(conn)
        })
      })
    })
    typeof callback === 'function' && promise.then(callback.bind(null, null), callback)
    return promise
  }

  commit(callback) {
    const promise = new Promise((resolve, reject) => {
      this.conn.commit(err => {
        if (err) {
          this.logger.error(err)
          this.conn.release()
          return reject(err.code)
        }
        this.conn.release()
        return resolve()
      })
    })
    typeof callback === 'function' && promise.then(callback.bind(null, null), callback)
    return promise
  }

  rollback() {
    this.conn.rollback(() => this.conn.release())
  }
  release() {
    this.conn.release()
  }
  query(sql, callback) {
    const promise = new Promise((resolve, reject) => {
      this.conn.query(sql, (err, res) => {
        if (err) {
          this.logger.error(err)
          this.rollback()
          return reject(err.code)
        }
        return resolve(res)
      })
    })
    typeof callback === 'function' && promise.then(callback.bind(null, null), callback)
    return promise
  }
}

module.exports = ModelClass

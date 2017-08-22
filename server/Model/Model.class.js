const DEBUG = process.env.NODE_ENV === 'development'

class ModelClass {
  constructor(db) {
    this.model = db
  }

  tableCreate(force = false) {
    return new Promise(async (resolve, reject) => {
      try {
        let res = this.model.sync({ force })
        resolve(res.dataValues)
      } catch (err) {
        reject(DEBUG ? err : err.original.code)
      }
    })
  }

  save(param = {}) {
    return new Promise(async (resolve, reject) => {
      let res, where
      if (!param.data) {
        return reject('data required')
      }
      if (param.data.where) {
        where = {
          where: param.data.where
        }
        delete param.data.where
      }
      try {
        if (where) {
          res = await this.model.update(param.data, where)
          resolve(res[0])
        } else {
          res = await this.model.create(param.data)
          resolve(res.dataValues)
        }
      } catch (err) {
        reject(DEBUG ? err : err.original.code)
      }
    });
  }

  // param id
  delById(id = 0) {
    return new Promise(async (resolve, reject) => {
      let where = { id }
      try {
        let res = await this.model.destroy({ where })
        resolve(res)
      } catch (err) {
        reject(DEBUG ? err : err.original.code)
      }
    })
  }

  delByWhere(where = {}) {
    return new Promise(async (resolve, reject) => {
      try {
        let res = await this.model.destroy({ where })
        resolve(res)
      } catch (err) {
        reject(DEBUG ? err : err.original.code)
      }
    })
  }

  getById(id = 0) {
    return new Promise(async (resolve, reject) => {
      try {
        let res = await this.model.findById(id)
        resolve(res)
      } catch (err) {
        reject(DEBUG ? err : err.original.code)
      }
    })
  }

  getOne(where = {}) {
    return new Promise(async (resolve, reject) => {
      try {
        let res = await this.model.findOne({ where })
        resolve(res)
      } catch (err) {
        reject(DEBUG ? err : err.original.code)
      }
    })
  }

  // async getOrCreate(param = {}) {
  //   let _error = param.error || noop;
  //   if (!param.data) return _error('data required');
  //   if (!param.data.value) return _error('data value required');
  //   if (!param.data.where) return _error('data where required');

  //   try {
  //     await this.model.findOrCreate({
  //       where: param.data.where,
  //       defaults: param.data.value,
  //     }).spread((obj, created) => {
  //       let res = obj.get({
  //         plain: false
  //       })
  //       param.success && param.success(res)
  //     })
  //     // param.success && param.success(res.dataValues)
  //   } catch (err) {
  //     _error(DEBUG ? err : err.original.code)
  //   }
  // }

  // param.data: query where
  getCount(where = {}) {
    return new Promise(async (resolve, reject) => {
      try {
        let res = await this.model.count({ where })
        resolve(res)
      } catch (err) {
        reject(DEBUG ? err : err.original.code)
      }
    })
  }

  // param.page
  // param.perpage
  // param.where
  // param.fields
  // param.order
  // param.count
  getList(param = {}) {
    let opt = {}
    let page = Math.max(0, parseInt(param.page || 1))

    opt.limit = Math.max(1, parseInt(param.perpage || 20))
    opt.offset = (page - 1) * opt.limit

    if (param.where) opt.where = param.where
    if (param.fields) opt.attributes = param.fields
    if (param.order) opt.order = param.order

    return new Promise(async (resolve, reject) => {
      try {
        let query = param.count ? await this.model.findAndCountAll(opt) : await this.model.findAll(opt)
        let res = {
          page: page,
          perpage: opt.limit,
          count: query.count || -1,
          next: (opt.offset + opt.limit) < query.count ? 1 : 0,
          data: [],
        }
        for (let v of (query.rows || query)) {
          res.data.push(v.dataValues)
        }
        resolve(res)
      } catch (err) {
        reject(DEBUG ? err : err.original.code)
      }
    })
  }

}

module.exports = ModelClass

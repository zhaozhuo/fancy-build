const DEBUG = process.env.NODE_ENV === 'development'

class ModelClass {
  constructor(db) {
    this.model = db
  }

  tableCreate(force = false) {
    return new Promise(async (resolve, reject) => {
      try {
        let res = this.model.sync({ force })
        return resolve(res.dataValues)
      }
      catch (err) {
        return reject(DEBUG ? err : err.original.code)
      }
    })
  }

  getCount(where = {}) {
    return new Promise(async (resolve, reject) => {
      try {
        return resolve(await this.model.count({ where }))
      }
      catch (err) {
        return reject(DEBUG ? err : err.original.code)
      }
    })
  }

  getList(param = {}) {
    let {
      where,
      fields,
      page = 1,
      perpage = 30,
      count = false,
      order = [['id', 'DESC']],
    } = param

    page = Math.max(1, parseInt(page))
    perpage = Math.max(1, parseInt(perpage))

    let opt = {
      offset: (page - 1) * perpage,
      limit: perpage,
    }
    if (where) opt.where = where
    if (order) opt.order = order
    if (fields) opt.attributes = fields

    return new Promise(async (resolve, reject) => {
      try {
        let query = count ? await this.model.findAndCountAll(opt) : await this.model.findAll(opt)
        let res = {
          data: [],
          pages: {
            page,
            perpage,
            count: query.count || -1,
            next: (opt.offset + perpage) < query.count ? 1 : 0,
          },
        }
        for (let v of (query.rows || query)) {
          res.data.push(v.dataValues)
        }
        return resolve(res)
      }
      catch (err) {
        return reject(DEBUG ? err : err.original.code)
      }
    })
  }

  save(data, where) {
    return new Promise(async (resolve, reject) => {
      let res = false
      if (!data) {
        return reject('data required')
      }
      try {
        if (where) {
          res = await this.model.update(data, { where })
          return resolve(res[0])
        }
        res = await this.model.create(data)
        return resolve(res.dataValues)
      }
      catch (err) {
        reject(DEBUG ? err : err.original.code)
      }
    });
  }

  getById(id = 0) {
    return new Promise(async (resolve, reject) => {
      try {
        return resolve(await this.model.findById(id))
      }
      catch (err) {
        return reject(DEBUG ? err : err.original.code)
      }
    })
  }

  getOne(where = {}) {
    return new Promise(async (resolve, reject) => {
      try {
        return resolve(await this.model.findOne({ where }))
      }
      catch (err) {
        return reject(DEBUG ? err : err.original.code)
      }
    })
  }

  delById(id = 0) {
    return new Promise(async (resolve, reject) => {
      let where = { id }
      try {
        return resolve(await this.model.destroy({ where }))
      }
      catch (err) {
        return reject(DEBUG ? err : err.original.code)
      }
    })
  }

  delByWhere(where = {}) {
    return new Promise(async (resolve, reject) => {
      try {
        return resolve(await this.model.destroy({ where }))
      }
      catch (err) {
        return reject(DEBUG ? err : err.original.code)
      }
    })
  }

}

module.exports = ModelClass

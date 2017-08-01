const DEBUG = process.env.NODE_ENV === 'development'
const noop = function() {}

class ModelClass {
  constructor(db) {
    this.model = db
  }

  async init(force, resolve, reject) {
    try {
      let res = this.model.sync({
        force: !!force
      })
      resolve && resolve(res.dataValues)
    } catch (err) {
      reject && reject(DEBUG ? err : err.original.code)
    }
  }

  async save(param = {}) {
    let _error = param.error || noop;
    if (!param.data) return _error('data required');

    try {
      let res
      if (param.data.where) {
        let where = {
          where: param.data.where
        }
        delete param.data.where
        res = await this.model.update(param.data, where)
        param.success && param.success(res[0])
      } else {
        res = await this.model.create(param.data)
        param.success && param.success(res.dataValues)
      }
    } catch (err) {
      _error(DEBUG ? err : err.original.code)
    }
  }

  // param.data.id
  async delById(param = {}) {
    let _error = param.error || noop;
    if (!param.data || !param.data.id) return _error('id required');

    let where = {
      id: param.data.id
    }
    try {
      let res = await this.model.destroy({
        where
      })
      param.success && param.success(res)
    } catch (err) {
      _error(DEBUG ? err : err.original.code)
    }
  }

  // param.data: query where
  async delByWhere(param = {}) {
    let _error = param.error || noop;
    if (!param.data) return _error('data required');

    try {
      let res = await this.model.destroy({
        where: param.data
      })
      param.success && param.success(res)
    } catch (err) {
      _error(DEBUG ? err : err.original.code)
    }
  }

  // param.data.id
  async getById(param = {}) {
    let _error = param.error || noop;
    if (!param.data || !param.data.id) return _error('id required');

    try {
      let res = await this.model.findById(param.data.id)
      param.success && param.success(res.dataValues)
    } catch (err) {
      _error(DEBUG ? err : err.original.code)
    }
  }

  // param.data: query where
  async getOne(param = {}) {
    let _error = param.error || noop;
    if (!param.data) return _error('data required');

    try {
      let res = await this.model.findOne({
        where: param.data
      })
      param.success && param.success(res)
    } catch (err) {
      _error(DEBUG ? err : err.original.code)
    }
  }

  async getOrCreate(param = {}) {
    let _error = param.error || noop;
    if (!param.data) return _error('data required');
    if (!param.data.value) return _error('data value required');
    if (!param.data.where) return _error('data where required');

    try {
      await this.model.findOrCreate({
        where: param.data.where,
        defaults: param.data.value,
      }).spread((obj, created) => {
        let res = obj.get({
          plain: false
        })
        param.success && param.success(res)
      })
      // param.success && param.success(res.dataValues)
    } catch (err) {
      _error(DEBUG ? err : err.original.code)
    }
  }

  // param.data: query where
  async getCount(param = {}) {
    let _error = param.error || noop;
    if (!param.data) return _error('data required');

    try {
      let res = await this.model.count({
        where: param.data
      })
      param.success && param.success(res)
    } catch (err) {
      _error(DEBUG ? err : err.original.code)
    }
  }

  // param.data.page
  // param.data.perpage
  // param.data.where
  // param.data.fields
  // param.data.order
  // param.data.count
  async getList(param = {}) {
    let _error = param.error || noop;
    if (!param.data) return _error('data required');

    let opt = {}
    let page = Math.max(0, parseInt(param.data.page || 1))

    opt.limit = Math.max(1, parseInt(param.data.perpage || 20))
    opt.offset = (page - 1) * opt.limit

    if (param.data.where) opt.where = param.data.where
    if (param.data.fields) opt.attributes = param.data.fields
    if (param.data.order) opt.order = param.data.order

    try {
      let query = param.data.count ? await this.model.findAndCountAll(opt) : await this.model.findAll(opt)
      let res = {
        page: page,
        perpage: opt.limit,
        count: query.count || -1,
        next: (opt.offset + opt.limit) < query.count ? 1 : 0,
        data: [],
      }
      for (let v of(query.rows || query)) {
        res.data.push(v.dataValues)
      }
      param.success && param.success(res)
    } catch (err) {
      _error(DEBUG ? err : err.original.code)
    }
  }

}

module.exports = ModelClass

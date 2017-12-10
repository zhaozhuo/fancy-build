const env = process.env.NODE_ENV === 'development' ? 'dev' : 'pro'

const config = {
  dev: {
    port: 5151,
    jsonpCallback: 'callback',
    mysql: {
      host: 'localhost',
      port: 3306,
      database: 'fancy',
      username: 'root',
      password: 'abc123123',
    },
    // https: {
    //   port: 5252,
    //   key: `${root}/cert/private.key`,
    //   cert: `${root}/cert/cert.crt`,
    // },
    redis: {
      host: '127.0.0.1',
      port: 6379,
      password: '',
    },
  },
  pro: {
    port: 8181,
    jsonpCallback: 'callback',
    mysql: {
      host: 'localhost',
      port: 3306,
      database: 'fancy',
      username: 'root',
      password: 'abc123123123123123',
    },
    // https: {
    //   port: 8282,
    //   key: `${root}/cert/private.key`,
    //   cert: `${root}/cert/cert.crt`,
    // },
    redis: {
      host: '127.0.0.1',
      port: 6379,
      password: '',
    },
  },
}

module.exports = config[env]

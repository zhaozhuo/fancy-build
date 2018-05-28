
const config = {
  development: {
    port: 8181,
    jsonpCallback: 'callback',
    mysql: {
      host: 'localhost',
      port: 3306,
      database: 'fancy',
      username: 'fancy',
      password: '123456',
    },
    redis: {
      host: '127.0.0.1',
      port: 6379,
      password: '',
    },
    upload: {
      temp: 'upload.temp',
      path: 'upload',
      url: '/upload',
    }
  },
  testing: {
    port: 8181,
    jsonpCallback: 'callback',
    mysql: {
      host: 'localhost',
      port: 3306,
      database: 'fancy',
      username: 'fancy',
      password: 'abc123123',
    },
    redis: {
      host: '127.0.0.1',
      port: 6379,
      password: '',
    },
    upload: {
      temp: 'upload.temp',
      path: 'upload',
      url: '/upload',
    }
  },
  production: {
    port: 8181,
    // https: {
    //   port: 8282,
    //   key: `${root}/cert/private.key`,
    //   cert: `${root}/cert/cert.crt`,
    // },
    jsonpCallback: 'callback',
    mysql: {
      host: 'localhost',
      port: 3306,
      database: 'fancy',
      username: 'root',
      password: 'abc123123123123123',
    },
    redis: {
      host: '127.0.0.1',
      port: 6379,
      password: '',
    },
    upload: {
      temp: 'upload.temp',
      path: 'upload',
      url: '/upload',
    }
  },
}

module.exports = config

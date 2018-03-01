## 互联网+生态

### 开发环境

* python  = v2.7
* node    > v8.9.4

### 开发工具安装插件(以 VSCode 为例)

- Eslint
- EditorConfig
- Vetur
- Sass

> VSCode用户配置增加如下
``` bash
  "prettier.printWidth": 200,
  "prettier.singleQuote": true,
  "prettier.semi": false,
  "prettier.trailingComma": "all",
  "eslint.validate": [
      "javascript",
      "javascriptreact",
      "vue"
  ]
```

## Build Setup

``` bash

# tnpm install
npm config set registry http://r.tnpm.oa.com && npm config set proxy http://r.tnpm.oa.com:80

# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).


## https证书生成

  mkdir cert

  * 生成私钥key文件
    openssl genrsa 1024 > cert/private.key

  * 通过私钥文件生成CSR证书签名
    openssl req -new -key cert/private.key -out cert/csr.pem

  * 通过私钥文件和CSR证书签名生成证书文件
    openssl x509 -req -days 365 -in cert/csr.pem -signkey cert/private.key -out cert/cert.crt


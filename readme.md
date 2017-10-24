# express webpack build

> install

  * nmp install 或 tnpm install

> 后端服务

  * npm run s:dev 开发环境
  * npm run s:pro 生产环境


> 前端服务

  * npm run w:dev 开发环境
  * npm run w:pro 生产环境
  * npm run w:build 预编译(保留watch)


> https证书生成

  * 生成私钥key文件
    openssl genrsa 1024 > private.key

  * 通过私钥文件生成CSR证书签名
    openssl req -new -key private.key -out csr.pem

  * 通过私钥文件和CSR证书签名生成证书文件
    openssl x509 -req -days 365 -in csr.pem -signkey private.key -out cert.crt

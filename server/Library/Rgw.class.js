'use strict'
const s3 = require('s3')
const path = require('path')
const cname = path.basename(__filename, '.js')
const logger = require('../logger')(cname)
// Rgw上传配置示例
// const rgwOptions = {
//   maxAsyncS3: 20, // this is the default
//   s3RetryCount: 3, // this is the default
//   s3RetryDelay: 1000, // this is the default
//   multipartUploadThreshold: 20971520, // this is the default (20 MB)
//   multipartUploadSize: 15728640, // this is the default (15 MB)
//   s3Options: {
//     accessKeyId: '',
//     secretAccessKey: '',
//     region: 'default',
//     endpoint: 's3sz.sumeru.mig',
//     sslEnabled: false,
//     s3ForcePathStyle: true
//     // any other options are passed to new AWS.S3()
//     // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property
//   }
// }

// https://github.com/aws/aws-sdk-js
// https://github.com/andrewrk/node-s3-client
class Rgw {
  constructor(opt = {}) {
    this.client = s3.createClient(opt)
    this.s3 = new s3.AWS.S3(opt.s3Options)
  }

  /**
   * 查看Bucket列表
   * @return {Array} data
   * @return {Array} data.Buckets
   * @return {Object} data.Buckets.0
   * @return {String} data.Buckets.0.Name
   * @return {String} data.Buckets.0.CreationDate
   * @return {Object} data.Owner
   * @return {String} data.Owner.ID
   * @return {String} data.Owner.DisplayName
   */
  listBuckets(param = {}, callback) {
    this.s3.listBuckets(param, callback)
  }

  /**
   * 新建Bucket
   * @param Bucket 桶名
   * @param ACL private
   *
   * 权限ACL有如下几种"private", "public­-read", "public-­read­-write", "authenticated-­read"
   * private: 所有者拥有所有权FULL_CONTROL.
   * public-read: 所有者拥有所有权FULL_CONTROL 匿名用户拥有READ权限.
   * public-read-write: 所有者拥有所有权FULL_CONTROL 匿名用户拥有READ和WRITE权限.
   * authenticated-read: 匿名用户有FULL_CONTROL 认证用户拥有 READ 权限.
   */
  createBucket(param = {}, callback) {
    this.s3.createBucket(param, callback)
  }

  /**
   * 判断Bucket是否存在
   * @param Bucket 桶名
   */
  headBucket(param = {}, callback) {
    this.s3.headBucket(param, callback)
  }

  /**
   * 删除Bucket
   * @param Bucket 桶名
   */
  deleteBucket(param = {}, callback) {
    this.s3.deleteBucket(param, callback)
  }

  /**
   * 查看Bucket访问权限
   * @param Bucket 桶名
   */
  getBucketAcl(param = {}, callback) {
    this.s3.getBucketAcl(param, callback)
  }

  /**
   * 设置Bucket访问权限
   * @param Bucket 桶名
   * @param ACL private
   */
  putBucketAcl(param = {}, callback) {
    this.s3.putBucketAcl(param, callback)
  }

  /**
   * 删除文件
   * @param Bucket 桶名
   * @param Key
   */
  deleteObject(param = {}, callback) {
    this.s3.deleteObject(param, callback)
  }

  /**
   * 判断文件是否存在
   * @param Bucket 桶名
   * @param Key
   */
  headObject(param = {}, callback) {
    this.s3.headObject(param, callback)
  }

  /**
   * 拷贝文件
   * @param Bucket 桶名
   * @param CopySource
   * @param Key
   */
  copyObject(param = {}, callback) {
    this.s3.copyObject(param, callback)
  }

  /**
   * 查看文件访问权限
   * @param Bucket 桶名
   * @param Key
   */
  getObjectAcl(param = {}, callback) {
    this.s3.getObjectAcl(param, callback)
  }

  /**
   * 设置文件访问权限
   * @param Bucket 桶名
   * @param Key
   * @param ACL
   */
  putObjectAcl(param = {}, callback) {
    this.s3.putObjectAcl(param, callback)
  }

  /**
   * 使用私有链接下载
   * 对于私有Bucket，可以生成私有链接（又称为“签名URL”）供用户访问，下面是生成私有链 接下载，该链接在*秒后失效
   * @param Bucket 桶名
   * @param Key
   * @param Expires 过期时间(60)
   */
  getSignedUrl(param = {}, callback) {
    const url = this.s3.getSignedUrl('getObject', param)
    return typeof callback === 'function' ? callback(null, url) : url
  }

  /**
   * 使用私有链接上传
   * 对于私有Bucket，可以生成私有链接（又称为“签名URL”）供用户访问，下面是生成私有链 接上传，该链接在*秒后失效
   * @param Bucket 桶名
   * @param Key
   * @param Expires 过期时间(600)
   */
  uploadSignedUrl(param = {}, callback) {
    this.s3.getSignedUrl('putObject', param, callback)
  }

  /**
   * 列出桶内使用分块上传接口但未完成的分块上传的对象的分块
   * @param Bucket 桶名
   * @param Key
   * @param UploadId
   */
  listParts(param = {}, callback) {
    this.s3.listParts(param, callback)
  }

  /**
   * 查询桶内使用分块上传但未完成的分块上传
   * @param Bucket 桶名
   */
  listMultipartUploads(param = {}, callback) {
    this.s3.listMultipartUploads(param, callback)
  }

  /**
   * 文件上传
   * @param filePath  文件路径
   * @param savePath  文件名
   * @param Bucket    桶名
   */
  uploadFile(param = {}, callback) {
    const uploader = this.client.uploadFile({
      localFile: param.filePath,
      s3Params: {
        Bucket: param.Bucket || 'partner',
        Key: param.savePath
        // other options supported by putObject, except Body and ContentLength.
        // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
      }
    })
    const promise = new Promise((resolve, reject) => {
      uploader.on('error', (err) => {
        logger.error('unable to upload:', err.stack)
        reject(err)
      })
      uploader.on('progress', () => {
        logger.info('progress', uploader.progressMd5Amount, uploader.progressAmount, uploader.progressTotal)
      })
      uploader.on('end', () => {
        logger.info('done uploading')
        resolve('success')
      })
    })
    typeof callback === 'function' && promise.then(callback.bind(null, null), callback)
    return promise
  }

  /**
   * 文件下载
   * @param filePath  文件路径
   * @param savePath  文件名
   * @param Bucket    桶名
   */
  getFile(param = {}, callback) {
    const downloader = this.client.downloadFile({
      localFile: param.filePath,
      s3Params: {
        Bucket: param.Bucket || 'partner',
        Key: param.savePath
        // other options supported by putObject, except Body and ContentLength.
        // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
      }
    })
    const promise = new Promise((resolve, reject) => {
      downloader.on('error', err => {
        logger.error('unable to download:', err.stack)
        return reject(err.stack)
      })
      downloader.on('end', () => resolve(param.filePath))
    })
    typeof callback === 'function' && promise.then(callback.bind(null, null), callback)
    return promise
  }
}

module.exports = Rgw

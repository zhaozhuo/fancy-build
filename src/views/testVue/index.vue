<style lang="sass">
  @import "../../config.sass"
  .test
    max-width: $mainWidth
    margin: 10px auto 0
    position: relative
    .result
      position: fixed
      top: 0
      width: $mainWidth
      height: 50px
      margin: 0 auto
      textarea
        width: 100%
        height: 100%
        background: rgba(#000, 0.9)
        color: #fff
        padding: 10px 0
        font-size: 20px
    input
      height: 3em
    button
      display: inline-block
      padding: 10px 30px
      margin: 10px 20px 10px 0
    dl
      margin: 80px 0 50px
    dt
      font-size: 22px
      color: #000
      line-height: 40px


</style>

<template lang="jade">
  .test
    .result
      textarea(:value="result")

    dl
      dt AES加解密
      dd
        p
          label 密钥
            input(v-model="aesKey" type="text" style="width: 300px")
          label 明文
            input(v-model="aesText" type="text" style="width: 300px")
        p
          label 密文
            textarea(v-model="aesCiphertext" style="border: 1px soild #ccc;width: 100%;height: 200px")
        p
          button(@click="aesCrypto('encryption')") 加密
          button(@click="aesCrypto('decryption')") 解密
    dl
      dt mysql query
      dd
        button(@click="dbinit") dbinit
        button(@click="redisSet") redis set
        button(@click="add") add
        button(@click="delById") delById
        button(@click="delByWhere") delByWhere
        button(@click="getById") getById
        button(@click="getOne") getOne
        button(@click="getCount") getCount
        button(@click="getList") getList
        button(@click="markdown2pdf") markdown2pdf
        button(@click="serverCookie") serverCookie
        button(@click="jsonpdata") jsonpdata

    dl
      dt uploader
      dd
        input(type="file" autocomplete="off" @change="fileChange")
      dd
        form(method='post', action='http://localhost:5151/testing/upload', enctype='multipart/form-data')
          input(name='avatar', type='file', multiple='mutiple')
          input(name='submit', type='submit',value='upload')

</template>

<script>
  export default {
    data() {
      return {
        title: 'test',
        data: {},
        result: '',
        aesKey: 'KqQeGpZUQ0WwcJd1eHXwZA59RoiiHrSd',
        aesText: '',
        aesCiphertext: ''
      }
    },
    mounted() {

    },
    methods: {
      aesCrypto(type) {
        let self = this;
        $.ajax({
            url : '/api/testing/aesCrypto',
            data: {
              type,
              key: this.aesKey,
              text: this.aesText,
              ciphertext: this.aesCiphertext,
            },
            type: 'post',
            dataType: 'json',
            timeout: 5e3,
            error: () => console.log(),
            success: res => {
              this.result = JSON.stringify(res)
              if(res.code == '100') {
                if(type === 'encryption'){
                  self.aesCiphertext = res.data;
                }else{
                  self.aesText = res.data;
                }
              }
            }
        });
      },
      redisSet() {
        $.ajax({
          url : '/api/testing/redisSet',
          type: 'post',
          dataType: 'json',
          timeout: 5e3,
          error: err => console.log(err),
          success: res => this.result = JSON.stringify(res),
        });
      },
      fileChange(e) {
        let file = e.target.files[0];
        if( !/image\/\w+/.test(file.type) ) {
          alert("请选择图像类型的文件");
          return false;
        }
        if( window.FileReader ) {
          let self = this;
          let fr = new FileReader();
          fr.readAsDataURL(file);
          fr.onloadend = function(e){
            $.ajax({
                url : '/api/testing/uploadBase64',
                data: {
                  base64: e.target.result,
                  type: file.type,
                },
                type: 'post',
                dataType: 'json',
                timeout: 5e3,
                error: err => self.result = err,
                success: res => self.result = JSON.stringify(res)
            });
          };
        }
      },
      dbinit() {
        $.ajax({
          url : '/api/testing/dbinit',
          type: 'post',
          dataType: 'json',
          timeout: 5e3,
          error: err => console.log(err),
          success: res => this.result = JSON.stringify(res),
        });
      },
      add() {
        $.ajax({
          url : '/api/testing/add',
          data: {
            name: 123,
            aa: 234,
          },
          type: 'post',
          dataType: 'json',
          timeout: 5e3,
          error: err => console.log(err),
          success: res => this.result = JSON.stringify(res),
        });
      },
      delById() {
        $.ajax({
          url : '/api/testing/delById',
          data: {
            id: 3,
          },
          type: 'post',
          dataType: 'json',
          timeout: 5e3,
          error: err => console.log(err),
          success: res => this.result = JSON.stringify(res),
        });
      },
      delByWhere() {
        $.ajax({
          url : '/api/testing/delByWhere',
          data: {
            id: {
              $lt: 10
            },

          },
          type: 'post',
          dataType: 'json',
          timeout: 5e3,
          error: err => console.log(err),
          success: res => this.result = JSON.stringify(res),
        });
      },
      getById() {
        $.ajax({
          url : '/api/testing/getById',
          data: {
            id: 12
          },
          type: 'post',
          dataType: 'json',
          timeout: 5e3,
          error: err => console.log(err),
          success: res => this.result = JSON.stringify(res),
        });
      },
      getOne() {
        $.ajax({
          url : '/api/testing/getOne',
          data: {
            id: {
              $gt: 20,
            }
          },
          type: 'post',
          dataType: 'json',
          timeout: 5e3,
          error: err => console.log(err),
          success: res => this.result = JSON.stringify(res),
        });
      },
      getCount() {
        $.ajax({
          url : '/api/testing/getCount',
          data: {
            id: {
              $gt: 11,
            }
          },
          type: 'post',
          dataType: 'json',
          timeout: 5e3,
          error: err => console.log(err),
          success: res => this.result = JSON.stringify(res),
        });
      },
      getList() {
        $.ajax({
          url : '/api/testing/getList',
          data: {
            count: true,
            page: 5,
            perpage: 8,
            order: [
              ['pid', 'DESC'],
            ],
            where: {
              pid: {
               $lt: 10,
              },
            }
          },
          type: 'post',
          dataType: 'json',
          timeout: 5e3,
          error: err => console.log(err),
          success: res => {
            res.data.data.forEach(v => {
              console.log(v.pid)
            })
            this.result = JSON.stringify(res)
          }
        });
      },
      markdown2pdf() {
        $.ajax({
          url : '/api/testing/markdown2pdf',
          data: {},
          type: 'post',
          dataType: 'json',
          timeout: 5e3,
          error: err => console.log(err),
          success: res => {

            this.result = JSON.stringify(res)
          }
        });
      },
      serverCookie() {
        $.ajax({
          url : '/api/testing/serverCookie',
          data: {},
          type: 'post',
          dataType: 'json',
          timeout: 5e3,
          error: err => console.log(err),
          success: res => {
            this.result = JSON.stringify(res)
          }
        });
      },

      jsonpdata() {
        $.ajax({
          url : '/api/testing/jsonpdata',
          data: {},
          dataType: 'jsonp',
          jsonp: 'callback',
          timeout: 5e3,
          error: err => console.log(err),
          success: res => {
            this.result = JSON.stringify(res)
          }
        });
      }

    },
  };
</script>

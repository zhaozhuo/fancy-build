<style lang="sass">
  @import "../../config.sass"
  .api
    margin: 0 35% 0 20px
    button
      display: inline-block
      padding: 10px 30px
      margin: 10px 20px 10px 0
    h2
      font-size: 2rem

    .example
      margin: 30px 0 30px
      padding: 0 10px
    .result

</style>

<template lang="jade">
  .api
    h2 custom api
    .example
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
    .result(v-html="result")

</template>

<script>
  import Util from 'lib/util'
  export default {
    mounted() {
    },
    methods: {
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
              $lt: 11,
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
            page: 1,
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

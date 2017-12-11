<style lang="sass">
  @import "../../config.sass"
  .api
    margin: 0 35% 0 20px
    button
      display: inline-block
      padding: 10px 30px
      margin: 10px 20px 10px 0

    .example
      padding: 1rem 0
    .list
      ul
        display: flex
        &:nth-child(2n + 1)
          background: #eee
        &:first-child
          background: #ccc
          li
            &.op
              line-height: $row-height * 1.5
              padding: 0 1rem
        li
          line-height: $row-height * 1.5
          width: 10rem
          &.id
            width: 5rem
            text-align: center
          &.op
            width: 5rem
            padding: $row-height * 0.25 1rem
            text-align: right
            line-height: $row-height / 2
          &.name
            flex: 1 1 0

</style>

<template lang="pug">
  .api
    h2 custom api
    .example
      button(@click="add") add
      button(@click="getList") getList
      button(@click="jsonpdata") jsonpdata
    .list
      ul
          li.id ID
          li.name Name
          li.age Age
          li.ctime Create Time
          li.op Operate
      ul(v-for="v in data")
        li.id {{v.id}}
        li.name {{v.name}}
        li.age {{v.age}}
        li.ctime {{v.ctime}}
        li.op
          a(href="javascript:" @click="delById(v.id)") delete
          br
          a(href="javascript:" @click="modify(v.id)") modify

</template>

<script>
import network from 'lib/network'

export default {
  data() {
    return {
      data: [],
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    add() {
      network.post({
        url: '/user/add',
        data: {
          name: 123,
          aa: 234,
        },
        error: err => console.log(err),
        success: res => {
          res.code == '100' && this.getList()
          console.log(abc)
        }
      })
    },
    getList() {
      network.post({
        url: '/user/getList',
        data: {
          page: 1,
          perpage: 10,
        },
        error: err => console.log(err),
        success: res => (this.data = res.data),
      })
    },
    delById(id) {
      network.post({
        url: '/user/delById',
        data: {
          id,
        },
        error: err => console.log(err),
        success: res =>
          this.data.splice(this.data.findIndex(v => v.id == id), 1),
      })
    },
    modify(id) {
      network.post({
        url: '/user/modify',
        data: {
          id,
        },
        error: err => console.log(err),
        success: res => {
          let val = this.data.find(v => v.id == id)
          val.name = res.data.name
          val.age = res.data.age
        },
      })
    },
    jsonpdata() {
      network.post({
        url: '/user/jsonpdata',
        data: {
          aa: 'abc',
          bb: 'def',
        },
        type: 'jsonp',
        jsonpCallback: 'callback',
        error: err => console.log(err),
        success: res => {
          console.log(res)
        },
      })
    },
  },
}
</script>

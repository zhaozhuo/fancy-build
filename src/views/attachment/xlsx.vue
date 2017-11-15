<style lang="sass">
  @import "../../config.sass"
  .xlsx
    margin: 0 35% 0 20px
    .demo
      ul
        padding: 1rem
        li
          padding: 0.5rem
          &.msg
            padding-left: 5rem
            color: red
          button
            display: inline-block
            padding: 0.5rem 2rem
            margin-right: 0.5rem
    .result
      ul
        display: flex
        padding: 1rem
        &:nth-child(2n + 1)
          background: #eee
        &:first-child
          background: #ccc
        li
          padding: 0.5rem
          width: 10rem
          &:nth-child(2)
            flex: 1 1 0

</style>

<template lang="pug">
  .xlsx
    h2 xlsx file upload export
    .demo
      ul
        li
          a(href="/v1/xlsx/demoDownload") 下载测试表格
        li
          input(type='file' @change="change")
        li
          button(@click="xlsxUpload()") upload
          button(@click="xlsxExport()") export
        li.msg(v-show="msg") {{msg}}

    .result
      ul.header
        li 标题
        li 姓名
        li 电话
        li 邮箱
        li 时间
      ul(v-for="v of list")
        li {{v.title}}
        li {{v.name}}
        li {{v.phone}}
        li {{v.email}}
        li {{v.time}}


</template>

<script>
import network from 'lib/network'
export default {
  data() {
    return {
      file: null,
      msg: '',
      header: '',
      list: '',
    }
  },
  mounted() {},
  methods: {
    change(e) {
      let f = e.target.files[0]
      if (!/xlsx?$/.test(f.name)) {
        alert('请选择xlsx类型文件')
        return false
      }
      this.file = f
    },
    xlsxUpload() {
      if (!this.file) return false
      let formdata = new FormData()
      formdata.append('creator', 'test')
      formdata.append('creator_id', 1)
      formdata.append('file', this.file)
      // let self = this
      network.post({
        url: '/xlsx/upload',
        data: formdata,
        processData: false,
        error: err => console.log(err),
        success: res => {
          if (res.code == '100') {
            this.header = res.data.header
            this.list = res.data.list
          } else {
            this.msg = res.msg
          }
        },
      })
    },
    xlsxExport() {
      if (!(this.header && this.list)) return
      network.post({
        url: '/xlsx/export',
        data: {
          header: this.header,
          list: this.list,
        },
        error: err => console.log(err),
        success: res => {
          if (res.code == '100') {
            window.location = '/v1/xlsx/demoExport?filename='+ res.data
          } else {
            this.msg = res.msg
          }
        },
      })
    },
  },
}
</script>

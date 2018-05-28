<style lang="sass">
  @import "~styleConfig"
  .index
    margin: 20px
    min-height: calc(100vh - 210px)
    text-align: center
    border: 1px solid $borderColor
    border-radius: $borderRadius
    padding: 10px
    ul
      display: flex
      border-bottom: 1px solid $borderColor
      line-height: 4em
      &.head
        background: rgba($colorAlerm, 0.4)
        color: #fff
        border-bottom: none
      &:not(.head)
        &:hover
          background: rgba($borderColor, 0.4)
      li
        flex: 1
</style>

<template lang="pug">
.index-view
  Header
  .index
    ul.head
      li id
      li name
      li age
    template(v-if="userlist.length")
      ul(v-for="v of userlist")
        li {{v.id}}
        li {{v.name}}
        li {{v.age}}
    template(v-else)
      ul
        li 暂无数据
  Footer
</template>

<script>
import Network from 'lib/network'
import Header from '@/components/header'
import Footer from '@/components/footer'

export default {
  data() {
    return {
      userlist: []
    }
  },
  components: {
    Header,
    Footer,
  },
  mounted() {
    Network.post({
      url: 'user/getList',
      data: {},
      success: res => {
        this.userlist = res.data
      },
    })
  },
  methods: {},
}
</script>

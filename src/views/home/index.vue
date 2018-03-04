<style lang="sass">
  @import "~styleConfig"
  .index
    width: 960px
    margin: 0 auto
    height: calc(100vh - 170px)
    line-height: calc(100vh - 170px)
    text-align: center
    border: 1px solid #eee
</style>

<template lang="pug">
.index-view
  Header
  .index home
  Footer
</template>

<script>
import Network from 'lib/network'
import Header from '@/components/header'
import Footer from '@/components/footer'

export default {
  data() {
    return {}
  },
  components: {
    Header,
    Footer,
  },
  mounted() {
    Network.post({
      mock: true,
      url: 'user/getList',
      data: {},
      success: res => {
        console.log(res)
      },
    })
  },
  methods: {},
}
</script>

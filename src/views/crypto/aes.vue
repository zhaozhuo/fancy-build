<style lang="sass">
  @import "../../config.sass"
  .aes
    margin: 0 35% 0 20px

    ul
      padding: 1rem
      li
        padding: 0.5rem
        &:last-child
          padding-left: 5rem
        &.msg
          padding-left: 5rem
          color: red
        label
          display: inline-block
          line-height: $row-height
          margin-right: 0.5rem
          width: 4rem
          text-align: right
        input
          width: 30rem
          height: $row-height
          border: 1px solid $borderColor
          padding: 0 0.2rem
          color: $colorFont
        textarea
          width: 30rem
          height: 10rem
          border: 1px solid $borderColor
          padding: 0 0.2rem
        button
          display: inline-block
          padding: 0.5rem 2rem
          margin-right: 0.5rem

</style>

<template lang="pug">
  .aes
    h2 AES Encryption & Decryption
    ul
      li
        label 密钥
        input(v-model="key" type="text" placeholder="请输入32位密钥" maxlength="32")
      li
        label 加密文本
        input(v-model="content" type="text" placeholder="请输入待加密的文本")
      li
        label 密文
        textarea(v-model="ciphertext")
      li
        label 解密文本
        input(:value="content2" type="text")

      li.msg(v-show="msg") {{msg}}
      li
        button(@click="encryption()") 加密
        button(@click="decryption()") 解密

</template>

<script>
import network from 'lib/network'
export default {
  data() {
    return {
      key: 'KqQeGpZUQ0WwcJd1eHXwZA59RoiiHrSd',
      content: '',
      content2: '',
      ciphertext: '',
      msg: '',
    }
  },
  mounted() {},
  methods: {
    encryption() {
      console.log(1)
      let self = this
      network.post({
        url: '/aesCrypto/encode',
        data: {
          key: this.key,
          content: this.content,
        },
        error: err => console.log(err),
        success: res => {
          if (res.code == '100') {
            this.ciphertext = res.data
            this.content2 = ''
          } else {
            this.msg = res.msg
          }
        },
      })
    },
    decryption() {
      let self = this
      network.post({
        url: '/aesCrypto/decode',
        data: {
          key: this.key,
          content: this.ciphertext,
        },
        error: err => console.log(err),
        success: res => {
          if (res.code == '100') {
            this.content2 = res.data
          } else {
            this.msg = res.msg
          }
        },
      })
    },
  },
}
</script>

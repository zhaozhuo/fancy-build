require('./css.sass')
// node modules
require('script!zepto')
require("font-awesome/css/font-awesome.css");
import Vue from 'vue'
import sidebar from 'components/sidebar/'

new Vue({
  el: '.viewport',
  data: {
    appview: '',
    title: 'aaa',
    sidebar: {
      data: {
        api: {
          name: 'Node Api',
          items: [
            {
              name: 'user ajax',
              url: '/user/',
            },
            {
              name: 'Aes Crypto',
              url: '/aes/',
            },
            {
              name: 'xlsx upload',
              url: '/xlsx/',
            },
          ],
        },
        active: {
          name: 'Active',
          items: [
            {
              name: 'test2-1',
              url: '2-1',
            },
            {
              name: 'test2-2',
              url: '2-2',
            },
          ],
        },
        mobile: {
          name: 'mobile',
          items: [
            {
              name: 'test3-1',
              url: '3-1',
            },
            {
              name: 'test3-2',
              url: '3-2',
            },
            {
              name: 'test3-3',
              url: '3-3',
            },
          ],
        }
      },
    }
  },
  components: {
    sidebar,
    testVue: rs => require(['./views/testVue/'], rs),
    user: rs => require(['./views/user/'], rs),
    aes: rs => require(['./views/crypto/aes.vue'], rs),
    xlsx: rs => require(['./views/attachment/xlsx.vue'], rs),
  },
  mounted() {
    const router = window.location.pathname.split('/').slice(1, 3).filter(v => !!v && v != 'index.html').join('/') || 'index'
    if (!(router in this.$options.components)) {
      window.history.replaceState(null, '', '/')
      return this.appview = 'index'
    }
    this.appview = router;
  },
})

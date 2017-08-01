require('./css.sass');
// node modules
require('script!zepto')
import Vue from 'vue';


new Vue({
  el: '.viewport',
  data: {
    appview: '',
    title: 'aaa'
  },
  components: {
    testVue(resolve) {
      require(['./views/testVue/'], resolve)
    },
  },
  mounted() {
    this.appview = 'testVue';
  },
})

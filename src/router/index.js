import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'index',
      component: rs => require(['@/views/home/'], rs),
      beforeEnter: (to, from, next) => {
        document.title = '首页'
        next()
      }
    },
    {
      path: '/abc/',
      name: 'HelloWorld',
      component: rs => require(['@/components/header/'], rs),
      beforeEnter: (to, from, next) => {
        document.title = 'abc'
        next()
      }
    },
  ]
})

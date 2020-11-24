// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// eslint-disable-next-line import/no-duplicates
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import store from './store'
import VueResource from 'vue-resource'
// eslint-disable-next-line import/no-duplicates
import { Message } from 'element-ui'

// 设置反向代理，前端请求默认发送到 http://localhost:8083/api
var axios = require('axios')
axios.defaults.baseURL = 'http://localhost:8083/api'
axios.defaults.withCredentials = true
// 全局注册，之后可在其他组件中通过 this.axios 发送数据
Vue.prototype.$axios = axios
Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(VueResource)
Vue.prototype.$message = Message

/* 拦截器，首先判断访问路径是否需要登录，需要：判断store中有无user信息，有：放行 无：跳转登录，并存储访问路径（以便登录后跳转） */
router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
    if (store.state.user) {
      axios.get('/authentication').then(resp => {
        console.log(resp)
        if (resp.data) {
          next()
        } else {
          // 否则跳转到登录页面
          // 并存储访问的页面路径（以便在登录后跳转到访问页）
          next({
            path: 'login',
            query: {
              redirect: to.fullPath
            }
          })
        }
      })
    } else {
      next({
        path: 'login',
        query: {redirect: to.fullPath}
      })
    }
  } else {
    next()
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store,
  components: {App},
  template: '<App/>'
})

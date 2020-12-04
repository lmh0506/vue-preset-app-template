import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/vant.js'
import './common/css/index.scss'
// import './common/iconfont/iconfont'
import './directives/index'

// import { removeUserInfo, removeToken, getToken } from '@/common/js/cache'

import VConsole from 'vconsole'
// eslint-disable-next-line no-unused-vars
var vConsole = new VConsole()

Vue.config.productionTip = false

// 获取url上的参数
// function getUrlQuery () {
//   const params = location.search.substr(1).split('&')
//   const query = {}
//   params.map(item => {
//     const [key, val] = item.split('=')
//     query[key] = val
//   })
//   return query
// }

// const urlQuery = getUrlQuery()

const init = () => {
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app')
}

init()

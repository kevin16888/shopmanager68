// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import CusBread from '@/components/cusBread.vue'
import '@/assets/css/base.css'
import ELEMENT from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
import moment from 'moment'
import HttpServer from '@/http.js'

// 把不是vue插件的axios变成vue插件
Vue.use(HttpServer)
Vue.use(ELEMENT)
Vue.config.productionTip = false
Vue.component(CusBread.name,CusBread);

//全局过滤器---处理日期格式
Vue.filter('fmtdate',(v)=>{
  return moment(v).format('YYYY-MM-DD');
})

//全局自定义面包屑组件
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

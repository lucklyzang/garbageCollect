
import Vue from 'vue'
import router from './router'
import store from './store'
import Vant from 'vant';
import 'vant/lib/index.css';
//初始化样式
import './common/stylus/index.styl'
//移动端适配
import 'lib-flexible/flexible.js'
import App from './App'
Vue.use(Vant);
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

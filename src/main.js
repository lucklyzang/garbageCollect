
import Vue from 'vue'
import router from './router'
import store from './store'
import Vant from 'vant';
import 'vant/lib/index.css';
import moment from 'moment'
import {setStore, getStore} from '@/common/js/utils.js'
Vue.filter('dateformat', function(dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  return moment(dataStr).format(pattern)
});
Vue.prototype.$moment = moment
//初始化样式
import './common/stylus/index.less'
//移动端适配
import 'lib-flexible/flexible.js'
import App from './App'
Vue.use(Vant);
Vue.config.productionTip = false;
// 页面刷新时重新存入用户信息
store.commit('storeUserInfo',JSON.parse(getStore('userInfo')));
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

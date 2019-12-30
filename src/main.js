
import Vue from 'vue'
import router from './router'
import store from './store'
import Vant from 'vant';
import 'vant/lib/index.css';
import moment from 'moment'
import {setStore, getStore, IsPC} from '@/common/js/utils.js'
import echarts from 'echarts'
// import SocketIO from 'socket.io-client';
import VueSocketIO from 'vue-socket.io';

Vue.prototype.$echarts = echarts
// 全局挂载时间格式化方法
Vue.filter('dateformat', function(dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  return moment(dataStr).format(pattern)
});
Vue.prototype.$moment = moment;
// 全局挂载监听设备物理返回按键的方法
function gotoURL(callback){
  window.onpopstate = null;
  window.onpopstate = function(){
    callback()
  }
}
Vue.prototype.gotoURL = gotoURL;
//初始化样式
import './common/stylus/index.less'
//移动端适配
import 'lib-flexible/flexible.js'
import App from './App'
Vue.use(Vant);
Vue.config.productionTip = false;
// 页面刷新时重新存入用户信息
store.commit('storeUserInfo',JSON.parse(getStore('userInfo')));
// 页面刷新后重新存入当前标题
store.commit('refreshChangeTitleTxt', getStore('currentTitle'));
// 页面刷新后重新存入收集历史详情信息
store.commit('refreshStoreCollectInfo',JSON.parse(getStore('currentItem')));
store.commit('refreshStoreCurrentName',JSON.parse(getStore('refreshCurrentItem')));
// 页面刷新后重新存入收集批次号
store.commit('createBatchNumber', getStore('currentBatchNumber'));
// 页面刷新重新存入请求token
store.commit('changeToken', getStore('questToken'));
if (IsPC()) {
  Vue.use(new VueSocketIO({
     debug: true,
     connection: 'http://localhost:10001'
  }))
};

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

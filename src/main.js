
import Vue from 'vue'
import router from './router'
import store from './store'
import { Steps,Step,Button} from 'element-ui';
//初始化样式
import './common/stylus/index.styl'
//移动端适配
import 'lib-flexible/flexible.js'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import App from './App'
Vue.use(MintUI)
Vue.use(Steps)
Vue.use(Step)
Vue.use(Button)
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

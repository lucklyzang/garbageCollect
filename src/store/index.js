import Vue from 'vue';
import Vuex from 'vuex';
import codeModule from './codeModle.js'
import login from './login.js'
import scratchCodeMsg from './scratchCodeMsg.js'
Vue.use(Vuex);
export default new Vuex.Store({
  modules:{
    codeModule,
    login,
    scratchCodeMsg
  }
});
import Vue from 'vue';
import Vuex from 'vuex';
import codeModule from './codeModle.js'
Vue.use(Vuex);
export default new Vuex.Store({
  modules:{
    codeModule
  }
});
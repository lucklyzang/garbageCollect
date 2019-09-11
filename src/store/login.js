export default {
  state:{
    userInfo: null,
    routerFlag: true
  },
  getters:{
    userInfo : state => state.userInfo,
    routerFlag : state => state.routerFlag
  },
  mutations:{
    storeUserInfo (state, playLoad) {
      state.userInfo = playLoad
    },
    changeRouterFlag (state, playLoad) {
      state.routerFlag = playLoad
    }
  },
  actions:{}
}
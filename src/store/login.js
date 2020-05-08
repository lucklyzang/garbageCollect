export default {
  state:{
    userInfo: null,
    routerFlag: true,
    token: null, //请求token
    // 是否扫码登录
    loginSweepCode: false,
    // 过期方式
    overDueWay: false
  },
  getters:{
    userInfo : state => state.userInfo,
    routerFlag : state => state.routerFlag,
    loginSweepCode : state => state.loginSweepCode,
    token : state => state.token,
    overDueWay: state => state.overDueWay
  },
  mutations:{
    storeUserInfo (state, playLoad) {
      state.userInfo = playLoad
    },
    changeRouterFlag (state, playLoad) {
      state.routerFlag = playLoad
    },
    changeLoginMethod (state, playLoad) {
      state.loginSweepCode = playLoad
    },
    // 修改token状态
    changeToken (state, playLoad) {
      if (playLoad && playLoad != 'null') {
        state.token = playLoad
      }
    },
    // 修改过期方式
     changeOverDueWay (state, playLoad) {
      state.overDueWay = playLoad
    }
  },
  actions:{}
}
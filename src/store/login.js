export default {
  state:{
    userInfo: null
  },
  getters:{
    userInfo : state => state.userInfo
  },
  mutations:{
    storeUserInfo (state, playLoad) {
      state.userInfo = playLoad
    }
  },
  actions:{}
}
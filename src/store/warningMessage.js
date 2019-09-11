export default {
  state:{
    warningInfo: null,
    collectInfo: null,
    currentName: null
  },
  getters:{
    warningInfo : state => state.warningInfo,
    collectInfo : state => state.collectInfo,
    currentName : state => state.currentName
  },
  mutations:{
    storeWarningInfo (state, playLoad) {
      state.warningInfo = playLoad
    },
    initWaningInfo (state) {
      state.warningInfo = null
    },
    storeCollectInfo (state, playLoad) {
      state.collectInfo = playLoad
    },
    initCollectInfo (state) {
      state.collectInfo = null
    },
    storeCurrentName (state, playLoad) {
      state.currentName = playLoad
    },
    initCurrentName (state) {
      state.currentName = null
    }
  },
  actions:{}
}
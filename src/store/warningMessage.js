export default {
  state:{
    warningInfo: null,
    collectInfo: null, //收集历史当前选中项的详细信息
    currentName: null //当前收集历史详情要展示的对应项(未入库、已入库、已出库、已完成)
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
    refreshStoreCollectInfo (state, playLoad) {
      state.collectInfo = playLoad
    },
    initCollectInfo (state) {
      state.collectInfo = null
    },
    storeCurrentName (state, playLoad) {
      state.currentName = playLoad
    },
    refreshStoreCurrentName (state, playLoad) {
      state.currentName = playLoad
    },
    initCurrentName (state) {
      state.currentName = null
    }
  },
  actions:{}
}
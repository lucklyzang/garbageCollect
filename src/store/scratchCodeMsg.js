export default {
  state:{
    extraKeshiMsg: null, //科室信息暂存
    extraYihuMsg: null, //医护信息暂存
    extraLajiMsg: null, //医废信息暂存
    extraLyczMsg: null //医废重量信息暂存
  },
  getters:{
    extraKeshiMsg: state => state.extraKeshiMsg,
    extraYihuMsg: state => state.extraYihuMsg,
    extraLajiMsg: state => state.extraLajiMsg,
    extraLyczMsg: state => state.extraLyczMsg
  },
  mutations:{
    changeExtraKeshiMsg (state,payLoad) {
      state.extraKeshiMsg = payLoad
    },
    changeExtraYihuMsg (state,payLoad) {
      state.extraYihuMsg = payLoad
    },
    changeExtraLajiMsg (state,payLoad) {
      state.extraLajiMsg = payLoad
    },
    changeExtraLyczMsg (state,payLoad) {
      state.extraLyczMsg = payLoad
    },
    // 重置临时存储的扫码信息
    initExtraKeshiMsg (state) {
      state.extraKeshiMsg = null
    },
    initExtraYihuMsg (state) {
      state.extraYihuMsg = null
    },
    initExtraLajiMsg (state) {
      state.extraLajiMsg = null
    },
    initExtraLyczMsg (state) {
      state.extraLyczMsg = null
    }
  },
  actions:{}
}
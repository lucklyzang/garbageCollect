export default {
  state:{
    navTitle: '',
    // 科室信息汇总
    garColMsg: [
      {
        keshiCode: [],
        yihuCode: [],
        lajiCode: [],
        lanyaCz: [],
      }
    ]
  },
  getters:{
    navTopTitle: state => state.navTitle,
    keshiCode: state => state.garColMsg[0].keshiCode,
    yihuCode: state => state.garColMsg[0].yihuCode,
    lajiCode: state => state.garColMsg[0].lajiCode
  },
  mutations:{
    changeTitleTxt (state,payLoad) {
      state.navTitle = payLoad.tit
    },
    // 存储扫码信息
      // 存储科室暂存点信息
      storageKeshiCode (state,payLoad) {
        state.garColMsg[0].keshiCode.push(payLoad)
      },
      // 存储医护人员信息
      storageYihuCode (state,payLoad) {
        state.garColMsg[0].yihuCode.push(payLoad)
      },
       //存储垃圾袋信息信息
       storageLajiCode (state,payLoad) {
        state.garColMsg[0].lajiCode.push(payLoad)
      }, 
      // 存储蓝牙称重信息
      storageLanyaCz (state,payLoad) {
        state.garColMsg[0].lanyaCz.push(payLoad)
      }
  },
  actions:{}
}
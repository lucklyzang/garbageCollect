export default {
  state:{
    navTitle: '医废监测',
    // 流程开始判断
    judgeFlowPosition: null,
    // 申请医废收集时间
    applicationCollectTime: null,
    // 到达收集医废时间
    startCollectTime: null,
    // 批次号
    batchNumber: null,
    // 是否显示打印按钮
    showPrintBtn: false,
    // 是否展示其它科室收集按钮
    showOtherBtn: false,
    // 是否展示医废收集按钮
    showCollectBtn: true,
    // 是否展示确定按钮
    showSureBtn: false,
    totalWeight: 0,
    outStorageTime: null,
    // 批次号列表
    batchs: null,
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
    lajiCode: state => state.garColMsg[0].lajiCode,
    lanyaCz: state => state.garColMsg[0].lanyaCz,
    judgeFlowValue: state => state.judgeFlowPosition,
    applicationCollectTime: state => state.applicationCollectTime,
    startCollectTime: state => state.startCollectTime,
    batchNumber: state => state.batchNumber,
    showPrintBtn: state => state.showPrintBtn,
    showOtherBtn: state => state.showOtherBtn,
    totalWeight: state => state.totalWeight,
    outStorageTime: state => state.outStorageTime,
    batchs: state => state.batchs,
    showCollectBtn: state => state.showCollectBtn,
    showSureBtn: state => state.showSureBtn,
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
      },
      // 医废收集流程位置修改 
      changeFlowState (state,payLoad) {
        state.judgeFlowPosition = payLoad
      },
      // 更改申请医废收集时间
      changeApplicationCollectTime (state,payLoad) {
        state.applicationCollectTime = payLoad
      },
      // 更改到达医废收集时间
       changeStartCollectTime (state,payLoad) {
        state.startCollectTime = payLoad
      },
      // 创建批次号
      createBatchNumber (state,payLoad) {
        state.batchNumber = payLoad
      },
      //当前科室数据提交并打印后清空store
      clearTrashStore (state) {
        state.startCollectTime = null;
        state.garColMsg[0].keshiCode = [];
        state.garColMsg[0].yihuCode = [];
        state.garColMsg[0].lajiCode = [];
        state.garColMsg[0].lanyaCz = [];
      },
      //更改打印按钮状态
      changePrintBtn (state,payLoad) {
        state.showPrintBtn = payLoad
      },
      //更改其它科室收集按钮状态
      changeOtherBtn (state,payLoad) {
        state.showOtherBtn = payLoad
      },
      //更改医废收集按钮状态
      changeCollectBtn (state,payLoad) {
        state.showCollectBtn = payLoad
      },
      //更改确定按钮状态
      changeSureBtn (state,payLoad) {
        state.showSureBtn = payLoad
      },
      // 更改重量状态
      changeTotalWeight (state,payLoad) {
        state.totalWeight = payLoad
      },
      // 重置重量
      initTotalWeight (state) {
        state.totalWeight = 0
      },
      // 更改出库时间
      changeOutStorageTime (state,payLoad) {
        state.outStorageTime = payLoad
      },
      //重置出库时间
      initoutStorageTime (state) {
        state.outStorageTime = null
      },
      // 更改出库批次
      changeBatchs (state,payLoad) {
        state.batchs = payLoad
      },
      //重置出库批次
      initBatchs (state) {
        state.batchs = null
      }
  },
  actions:{}
}
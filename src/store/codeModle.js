 import { setStore, getStore, removeStore } from '@/common/js/utils'

export default {
  state:{
    navTitle: '医废监测',
    // 流程扫描节点
    currentActive: -1,
    // 流程扫描节点暂存
    codeStep: 0,
    // 流程开始判断
    judgeFlowPosition: null,
    // 判断是否进行下个流程
    isPlus: false,
    // 申请医废收集时间
    applicationCollectTime: null,
    // 是否点击过撤销按钮
    clickBackoutBtn: false,
    // 到达收集医废时间
    startCollectTime: null,
    // 批次号
    batchNumber: null,
    // 撤销时判断是否清除当前收集的垃圾信息与重量
    clearCurrentLajicode: false,
    // 是否显示打印按钮
    showPrintBtn: false,
    // 是否展示其它科室收集按钮
    showOtherBtn: false,
    // 是否展示医废收集按钮
    showCollectBtn: true,
    // 是否展示确定按钮
    showSureBtn: false,
    // 是否显示撤销按钮
    showBackoutBtn: true,
    // 是否展示扫码科室信息框
    astOfficeShow: false,
    // 是否展示扫码医护信息框
    staffCodeShow: false,
    // 是否展示扫码医废袋信息框
    bagCodeShow: false,
    // 是否展示扫码垃圾重量信息框
    bluetoothWeighShow: false,
    totalWeight: 0,
    outStorageTime: null,
    // 批次号列表
    batchs: null,
    // 记录重量为0的次数
    recordZeroCount: 0,
    // 科室信息汇总
    garColMsg: [
      {
        keshiCode: [], //科室信息
        yihuCode: [], //医护人员信息
        lajiCode: [], //医废信息
        lanyaCz: [], //医废重量信息
      }
    ],
    // 进入公共扫码页区分调用方法
    callPeriod: false,
    // 是否重新提交收集的数据
    isRepeatSubmit: false,
    // 手动输入重量框显示
    manualWeighShow: false,
    isBlueWeight: false,
    // 是否当前科室收集
    isCollectCurrentOffice: true,
    // 重量是否已经存储
    isStoreWeight: false
  },
  getters:{
    navTopTitle: state => state.navTitle,
    currentActive: state => state.currentActive,
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
    showBackoutBtn: state => state.showBackoutBtn,
    clearCurrentLajicode: state => state.clearCurrentLajicode,
    clickBackoutBtn: state => state.clickBackoutBtn,
    astOfficeShow: state => state.astOfficeShow,
    staffCodeShow: state => state.staffCodeShow,
    bagCodeShow: state => state.bagCodeShow,
    bluetoothWeighShow: state => state.bluetoothWeighShow,
    callPeriod: state => state.callPeriod,
    codeStep: state => state.codeStep,
    isPlus: state => state.isPlus,
    recordZeroCount: state => state.recordZeroCount,
    isRepeatSubmit: state => state.isRepeatSubmit,
    manualWeighShow: state => state.manualWeighShow,
    isBlueWeight: state => state.isBlueWeight,
    isCollectCurrentOffice: state => state.isCollectCurrentOffice,
    garColMsg: state => state.garColMsg,
    isStoreWeight: state => state.isStoreWeight,
  },
  mutations:{
    // 改变页面标题
    changeTitleTxt (state,payLoad) {
      state.navTitle = payLoad.tit
    },
    // 页面刷新后改变页面标题
    refreshChangeTitleTxt (state,payLoad) {
      state.navTitle = payLoad
    },
    // 改变流程节点状态
    changeCurrentActive (state, payLoad) {
      state.currentActive = payLoad
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
      //存储垃圾袋信息
      storageLajiCode (state,payLoad) {
        state.garColMsg[0].lajiCode.push(payLoad)
      },
      //更改垃圾袋信息
      changeStorageLajiCode (state,payLoad) {
        state.garColMsg[0].lajiCode = payLoad
      },  
      // 存储蓝牙称重信息
      storageLanyaCz (state,payLoad) {
        state.garColMsg[0].lanyaCz.push(payLoad)
      },
      //更改蓝牙称重信息1
      changeStorageLanyaCz (state,payLoad) {
        state.garColMsg[0].lanyaCz = payLoad
      },
      //更改蓝牙称重信息2
      changeStorageLanyaCzOther (state,payLoad) {
        state.garColMsg[0].lanyaCz.push(payLoad)
      },
      //清除存储垃圾袋信息
       initStorageLajiCode (state) {
        state.garColMsg[0].lajiCode = []
      }, 
      //清除存储蓝牙称重信息
      initStorageLanyaCz (state) {
        state.garColMsg[0].lanyaCz = []
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
        if (!payLoad) {
          state.batchNumber = ''
        } else {
          state.batchNumber = payLoad
        }
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
      //更改撤销按钮状态
      changeBackoutBtn (state,payLoad) {
        state.showBackoutBtn = payLoad
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
      },
      // 改变是否清除当前垃圾收集状态
      changeCurrentLajicodeState (state,payLoad) {
        state.clearCurrentLajicode = payLoad
      },
      // 改变是否点击撤销按钮状态
      changeClickBackoutBtn (state,payLoad) {
        state.clickBackoutBtn = payLoad
      },
      // 更改显示扫码科室信息框显示状态
      changeAstOfficeShow (state,payLoad) {
        state.astOfficeShow = payLoad
      },
      // 更改显示医护人员信息框显示状态
      changeStaffCodeShow (state,payLoad) {
        state.staffCodeShow = payLoad
      },
      // 更改显示扫码垃圾袋框显示状态
      changeBagCodeShow (state,payLoad) {
        state.bagCodeShow = payLoad
      },
      // 更改显示扫码垃圾重量显示状态
      changebluetoothWeighShow (state,payLoad) {
        state.bluetoothWeighShow = payLoad
      },
      // 更改公共扫码页调用方法的状态
      changeCallPeriod (state,payLoad) {
        state.callPeriod = payLoad
      },
      // 流程扫描节点暂存状态更改
      changeCodeStep (state,payLoad) {
        state.codeStep = payLoad
      },
      // 改变是否进行下一步的状态
      changeIsPlus (state,payLoad) {
        state.isPlus = payLoad
      },
      // 改变记录为0的状态
      ChangeRecordZeroCount (state,payLoad) {
        state.recordZeroCount = payLoad
      },
      // 改变是否重新提交数据的状态
       changeRepeatSubmit (state,payLoad) {
        state.isRepeatSubmit = payLoad
      },
      // 改变称重方式的状态
      changeManualWeighShow (state,payLoad) {
        state.manualWeighShow = payLoad
      },
      // 改变是否蓝牙称重状态
      changeIsBlueWeight (state,payLoad) {
        state.isBlueWeight = payLoad
      },
      // 改变是否当前科室收集的状态
      changeIsCollectCurrentOffice (state,payLoad) {
        state.isCollectCurrentOffice = payLoad
      },
      // 给科室信息汇总字段重新赋值
      changeGarColMsg (state,payLoad) {
        state.garColMsg = payLoad
      },
      // 改变重量是否已经存储状态
      changeIsStoreWeight (state,payLoad) {
        state.isStoreWeight = payLoad
      }
  },
  actions:{}
}
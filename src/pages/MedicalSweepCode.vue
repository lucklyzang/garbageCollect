
<template>
    <div class="content-wrapper">
      <HeaderTop :title="navTopTitle">
        <van-icon name="arrow-left" slot="left" @click="backTo"></van-icon> 
        <van-icon name="manager-o" slot="right" @click="skipMyInfo"></van-icon> 
      </HeaderTop>
      <ul class="left-dropDown" v-show="leftDownShow">
        <li v-for="(item, index) in leftDropdownDataList" :class="{liStyle:liIndex == index}" @click="leftLiCLick(index)">{{item}}</li>
      </ul>
      <div class="content">
        <div class="content-header">
          <ProgressStyle :percentage="currentPercentage"></ProgressStyle>
        </div>
        <div class="content-middle">
          <div class="ast-office" v-if="showAstOfficeShow">
            <p>科室: {{judgeFlowValue == 0 ? keshiCode[keshiCode.length-1].number : extraKeshiMsg.number ? extraKeshiMsg.number : ''}}</p>
            <p>医院: {{judgeFlowValue == 0 ? keshiCode[keshiCode.length-1].proName : extraKeshiMsg.proName ? extraKeshiMsg.proName : ''}}</p>
            <p>房间: {{judgeFlowValue == 0 ? keshiCode[keshiCode.length-1].depName : extraKeshiMsg.depName ? extraKeshiMsg.depName : ''}}</p>
          </div>
          <div class="bag-code" v-if="showBagCodeShow">
            <p>医废类型: {{judgeFlowValue == 2 ? lajiCode[lajiCode.length-1].id : extraLajiMsg ? extraLajiMsg.id : ''}}</p>
            <p>医院: {{judgeFlowValue == 2 ? lajiCode[lajiCode.length-1].proName : extraLajiMsg ? extraLajiMsg.proName : ''}}</p>
            <p>房间: {{judgeFlowValue == 2 ? lajiCode[lajiCode.length-1].depName : extraLajiMsg ? extraLajiMsg.depName : ''}}</p>
            <p>医废编号: {{judgeFlowValue == 2 ? lajiCode[lajiCode.length-1].barCode : extraLajiMsg ? extraLajiMsg.barCode : ''}}</p>
          </div>
          <div class="bluetooth-weigh" v-if="showBluetoothWeighShow">
            <p>重量: {{judgeFlowValue == 3 ? lanyaCz[lanyaCz.length-1] ? lanyaCz[lanyaCz.length-1]: '' : extraLyczMsg}}kg</p>
          </div>
          <div v-if="manualWeighShow">
            <van-cell-group>
              <van-field v-model="manualWeight"  label="医废重量(kg)" placeholder="请输入医废重量" />
            </van-cell-group>
          </div>
          <div class="staff-code" v-if="showStaffCodeShow">
            <p>医院: {{judgeFlowValue == 1 ? yihuCode[yihuCode.length-1].proName : extraYihuMsg ? extraYihuMsg.proName : ''}}</p>
            <p>姓名: {{judgeFlowValue == 1 ? yihuCode[yihuCode.length-1].workerNumber : extraYihuMsg ? extraYihuMsg.workerNumber : ''}}</p>
            <p>房间: {{judgeFlowValue == 1 ? yihuCode[yihuCode.length-1].depName : extraYihuMsg ? extraYihuMsg.depName : ''}}</p>
          </div>
        </div>
        <div class="content-footer">
          <span class="showBackoutButton" v-show="showBackoutButton">
            <van-button type="info" @click="backOut"  size="normal">撤销</van-button>
          </span>
          <span class="showCollectButton" v-show="showCollectButton">
            <van-button type="info" @click="sweepAstoffice" size="normal">医废收集</van-button>
          </span>
          <span class="showSureButton" v-show="showSureButton" >
            <van-button type="info" @click="sureCurrentCodeMsg" size="normal">确定</van-button>
          </span>
          <span class="showPrintBtn"  v-show="showPrintButton">
            <van-button type="info" @click="finishCollect" size="normal">打印单据</van-button>
          </span>
          <span class="showOtherButton" v-show="showOtherButton">
            <van-button type="info" @click="collectSure" size="normal">其它科室</van-button>
          </span>
        </div>
      </div>
      <!-- <FooterBottom></FooterBottom> -->
        <!-- 收集数据提交成功弹框 -->
        <van-dialog
          v-model="chooseBackoutShow"
          title="医废选择撤销"
          :show-cancel-button="false"
          :close-on-popstate="true"
          @confirm="chooseBackout"
          :close-on-click-overlay="true"
        >
          <div class="changeBtn">
            <van-checkbox v-model="checkedAll" @click="toggleCheckedAll">全选</van-checkbox>
          </div>
          <div class="content-middle-list">
            <div class="content-middle-list-item" v-for="(item, index) in barMessageList">
              <div class="change-btn-position">
                <van-checkbox v-model="item.check"  @change="oneChecked(item.check)"></van-checkbox>
              </div>
              <div class="list-item">
                <div class="list-strip">
                  <p>科室: {{item['depName']}}</p>
                  <p class="list-sign">条码标识: {{item['barCode']}}</p>
                  <p class="list-times">医废类型: {{item['wasteName']}}</p>
                  <p class="list-code">重量: {{item['barWeight']}}kg</p>
                </div>
              </div>
            </div>
          </div>
        </van-dialog>
        <!-- pc端提示扫码枪扫码弹框 -->
         <van-dialog
          v-model="barCodeScannerShow"
          title="请用扫码枪扫描对应二维码"
          :close-on-click-overlay="true"
          :close-on-popstate="true"
          @confirm=""
          @cancel=""
          >
        </van-dialog>
        <!-- 打印选择弹框 -->
        <van-dialog
          v-model="choosePrintType"
          title="请选择打印类型"
          show-cancel-button
          confirmButtonText="常规打印"
          cancelButtonText="不干胶打印"
          :close-on-click-overlay="true"
          :close-on-popstate="true"
          @confirm="conventionPrint"
          @cancel="gluePrint"
          >
        </van-dialog>
        <!-- 打印选择不干胶弹框 -->
         <van-dialog
          v-model="chooseGluePrintType"
          title="请选择不干胶打印类型"
          show-cancel-button
          confirmButtonText="明细"
          cancelButtonText="汇总"
          :close-on-click-overlay="true"
          :close-on-popstate="true"
          @confirm="gluePrintDetail"
          @cancel="gluePrintCollect"
          >
        </van-dialog>
      <!-- 汇总打印内容 -->
      <section class="bills-data" v-if="pcPrintShowCollect" ref="printCode"
        style="position:fixed;
        top:0;
        left:0;
        width:100%;
        height:85vh;
        overflow: auto;
        background: #fff;
        z-index:1000"
      >
        <div v-if="lajiCode.length == 1">
          <!-- 第一联 -->
          <div class="div-wrapper" v-for="(item, index) in lajiCode"
            style="height:240px;
            width:100%;
            border-bottom:1px dashed #333;
            background:transparent;
            padding-top:40px;"
          >
            <p style="text-align:center;margin-bottom:20px;font-size:18px">医废回收小票</p>
            <p style="padding-left:5px;font-size:14px;width:100%;min-height:24px;word-wrap: break-word">科室: {{keshiCode[index].depName}}</p>
            <p style="padding-left:5px;font-size:14px;width:100%;min-height:24px;word-wrap: break-word">垃圾类型: {{lajiCode[index].id}}</p>
            <p style="padding-left:5px;font-size:14px;width:100%;min-height:24px;word-wrap: break-word">垃圾重量: {{Number(lanyaCz[index]).toFixed(2)}}kg</p>
            <p style="padding-left:5px;font-size:14px;width:100%;min-height:24px;word-wrap: break-word">收集人: {{userInfo.workerName}}</p>
            <p style="padding-left:5px;font-size:14px;width:100%;min-height:24px;word-wrap: break-word">交接人: {{yihuCode[index].workerNumber}}</p>
            <p style="padding-left:5px;font-size:14px;width:100%;min-height:24px;word-wrap: break-word">时间: {{collectTime}}</p>
          </div>
          <!-- 第二联 -->
          <div class="div-wrapper" v-for="(item, index) in lajiCode"
            style="height:240px;
            width:100%;
            border-bottom:1px dashed #333;
            background:transparent;
            padding-top:40px;"
          >
            <p style="text-align:center;margin-bottom:20px;font-size:18px">医废回收小票</p>
            <p style="padding-left:5px;font-size:14px;width:100%;min-height:24px;word-wrap: break-word">科室: {{keshiCode[index].depName}}</p>
            <p style="padding-left:5px;font-size:14px;width:100%;min-height:24px;word-wrap: break-word">垃圾类型: {{lajiCode[index].id}}</p>
            <p style="padding-left:5px;font-size:14px;width:100%;min-height:24px;word-wrap: break-word">垃圾重量: {{Number(lanyaCz[index]).toFixed(2)}}kg</p>
            <p style="padding-left:5px;font-size:14px;width:100%;min-height:24px;word-wrap: break-word">收集人: {{userInfo.workerName}}</p>
            <p style="padding-left:5px;font-size:14px;width:100%;min-height:24px;word-wrap: break-word">交接人: {{yihuCode[index].workerNumber}}</p>
            <p style="padding-left:5px;font-size:14px;width:100%;min-height:24px;word-wrap: break-word">时间: {{collectTime}}</p>
          </div>
        </div>
        <div v-else>
          <!-- 第一联 -->
          <div class="div-wrapper" v-for="(item, index) in pcMapList"
            style="height:240px;
            width:100%;
            border-bottom:1px dashed #333;
            background:transparent;
            padding-top:40px;"
          >
            <p style="text-align:center;margin-bottom:20px;font-size:18px">医废回收小票</p>
            <p style="padding-left:5px;font-size:14px;width:100%;min-height:24px;word-wrap: break-word">科室: {{keshiCode[0].depName}}</p>
            <p style="padding-left:5px;font-size:14px;width:100%;min-height:24px;word-wrap: break-word">垃圾类型: {{pcMapList[index]['type']}}</p>
            <p style="padding-left:5px;font-size:14px;width:100%;min-height:24px;word-wrap: break-word">垃圾重量: {{Number(pcMapList[index]['weight']).toFixed(2)}}kg</p>
            <p style="padding-left:5px;font-size:14px;width:100%;min-height:24px;word-wrap: break-word">收集人: {{userInfo.workerName}}</p>
            <p style="padding-left:5px;font-size:14px;width:100%;min-height:24px;word-wrap: break-word">交接人: {{yihuCode[yihuCode.length-1].workerNumber}}</p>
            <p style="padding-left:5px;font-size:14px;width:100%;min-height:24px;word-wrap: break-word">时间: {{collectTime}}</p>
          </div>
          <!-- 第二联 -->
          <div class="div-wrapper" v-for="(item, index) in pcMapList"  
            style="height:240px;
            width:100%;
            border-bottom:1px dashed #333;
            background:transparent;
            padding-top:40px;">
            <p style="text-align:center;margin-bottom:20px;font-size:18px">医废回收小票</p>
            <p style="padding-left:5px;font-size:14px;width:100%;min-height:24px;word-wrap: break-word">科室: {{keshiCode[0].depName}}</p>
            <p style="padding-left:5px;font-size:14px;width:100%;min-height:24px;word-wrap: break-word">垃圾类型: {{pcMapList[index]['type']}}</p>
            <p style="padding-left:5px;font-size:14px;width:100%;min-height:24px;word-wrap: break-word">垃圾重量: {{Number(pcMapList[index]['weight']).toFixed(2)}}kg</p>
            <p style="padding-left:5px;font-size:14px;width:100%;min-height:24px;word-wrap: break-word">收集人: {{userInfo.workerName}}</p>
            <p style="padding-left:5px;font-size:14px;width:100%;min-height:24px;word-wrap: break-word">交接人: {{yihuCode[yihuCode.length-1].workerNumber}}</p>
            <p style="padding-left:5px;font-size:14px;width:100%;min-height:24px;word-wrap: break-word">时间: {{collectTime}}</p>
          </div>
        </div>
      </section>
      <!-- 选择称重方式弹框 -->
      <van-dialog
      v-model="chooseWightMethodsShow"
      title="请选择称重方式"
      show-cancel-button
      :confirmButtonText="weightMethodsText()"
      cancelButtonText="手动输入"
      cancel-button-color="red"
      :close-on-popstate="true"
      :close-on-click-overlay="true"
      @confirm="chooseWightSure"
      @cancel="chooseWightCancle"
      >
    </van-dialog>

    <!-- 选择医废撤销方式弹框 -->
    <van-dialog
    v-model="chooseBackoutMethodsShow"
    title="请选择撤销方式"
    show-cancel-button
    confirmButtonText="科室撤销"
    cancelButtonText="医废选择撤销"
    :close-on-popstate="true"
    :close-on-click-overlay="true"
    @confirm="chooseBackoutSure"
    @cancel="chooseBackoutCancle"
    >
  </van-dialog>
    </div>
</template>

<script>
import HeaderTop from '../components/HeaderTop'
import FooterBottom from '../components/FooterBottom'
import CommonProgress from '../components/CommonProgress'
import ProgressStyle from '../components/ProgressStyle'
import {judgeStagingPoint,judgeMedicalPerson} from '../api/rubbishCollect.js'
import {getDictionaryData} from '@/api/login.js'
import { formatTime, setStore, getStore, removeStore, IsPC, scanCode, testWeight, Dictionary, judgeDataType} from '@/common/js/utils'
import { mapGetters, mapMutations } from 'vuex'
import Vue from 'vue'
import Print from '@/plugs/print'
Vue.use(Print) 
export default {
   components:{
      HeaderTop,
      FooterBottom,
      CommonProgress,
      ProgressStyle
    },
  data () {
    return {
      manualWeight: '',
      leftDownShow: false,
      liIndex: null,
      leftDropdownDataList: ['刷新','我的','测试'],
      progressTitleList: ['扫描科室','扫描医废','医废称重','扫描医护'],
      currentPercentage: '0',
      temporaryActive: -1,
      barCodeList: [],
      pcMapList: [],
      printCount: 0,
      pcPrintShowCollect: false,
      pcPrintShowDetail: false,
      isPdaCollect: false,
      chooseGluePrintType: false,
      pcPrintShowGlueDetail: false,
      pcPrintShowGlueCollect: false,
      chooseWightMethodsShow: false,
      chooseBackoutMethodsShow: false,
      choosePrintType: false,
      contentMiddleShow: true,
      checkedAll: false,
      chooseBackoutShow: false,
      barCodeScannerShow: false,
      isPcCallBack: false,
      barMessageList: [],
      id: '',
      recordCount: 0,
      ifGlue: false,
      socketData: []
    };
  },
  computed: {
     ...mapGetters([
      'navTopTitle',
      'keshiCode',
      'yihuCode',
      'lajiCode',
      'lanyaCz',
      'judgeFlowValue',
      'applicationCollectTime',
      'startCollectTime',
      'batchNumber',
      'showPrintBtn',
      'showOtherBtn',
      'userInfo',
      'showCollectBtn',
      'showSureBtn',
      'showBackoutBtn',
      'astOfficeShow',
      'staffCodeShow',
      'bagCodeShow',
      'bluetoothWeighShow',
      'extraKeshiMsg',
      'extraYihuMsg',
      'extraLajiMsg',
      'extraLyczMsg',
      'currentActive',
      'codeStep',
      'isPlus',
      'recordZeroCount',
      'isRepeatSubmit',
      'manualWeighShow',
      'isBlueWeight',
      'isCollectCurrentOffice',
      'garColMsg',
      'isStoreWeight'
    ]),
    showCurrentActive () {
      return this.currentActive
    },
    showCollectButton () {
      return this.showCollectBtn
    },
    showSureButton () {
      return this.showSureBtn
    },
    showPrintButton () {
      return this.showPrintBtn
    },
    showOtherButton () {
      return this.showOtherBtn
    },
    showBackoutButton () {
      return this.showBackoutBtn
    },
    showAstOfficeShow () {
      return this.astOfficeShow
    },
    showStaffCodeShow () {
      return this.staffCodeShow
    },
    showBagCodeShow () {
      return this.bagCodeShow
    },
    showBluetoothWeighShow () {
      return this.bluetoothWeighShow
    },
    collectTime () {
     return  formatTime('YYYY-MM-DD HH:mm:ss')  
    }
  },

  mounted () {
    // 控制设备物理返回按键
    if (!IsPC()) {
      let that = this;
      pushHistory();
      that.gotoURL(() => { 
        pushHistory()
        if (this.keshiCode && this.keshiCode.length > 0) {
          this.$dialog.confirm({
            message: '返回上一级后,将清空本次收集的医废数据'
          })
          .then(() => {
            this.$router.push({path: 'home'});  //输入要返回的上一级路由地址
            this.changeTitleTxt({tit: '医废监测'});
            setStore('currentTitle','医废监测');
            this.initSweepCodeInfo(); 
            this.clearPartStorage()
          })
          .catch(() => {
          })
        } else {
          this.$router.push({path: 'home'});  //输入要返回的上一级路由地址
          this.changeTitleTxt({tit: '医废监测'});
          setStore('currentTitle','医废监测');
          this.initSweepCodeInfo();
          this.clearPartStorage()
        }
      })
    };
    // 判断流程从哪步开始
    this.judgeFlowPosition();
    // 判断是否执行扫码枪方法
    this.isExecute();
    // 二维码回调方法绑定到window下面,提供给外部调用
    let me = this;
    window['scanQRcodeCallback'] = (code) => {
      me.scanQRcodeCallback(code);
    },
    window['getWeightCallback'] = (code) => {
      me.getWeightCallback(code);
    }
  },

  sockets: {
    connect () {
      console.log('建立链接');
      this.id = this.$socket.id;
      // 监听connect事件
      this.$socket.emit('weight', 'getweight')
    },
    disconnect () {
      console.log('断开链接')
    },
    reconnect () {
      console.log('重新链接')
    },
    message (data) {
      if (IsPC()) {
        this.changeExtraLyczMsg('');
        this.changeExtraLyczMsg(data.replace('kg', ''));
      }     
    }
  },

  watch: {
    temporaryActive : {
      handler(newVal,oldVal) {
        switch (newVal) {
          case -1 :
            this.currentPercentage = '0';
            break;
          case 0 :
            this.currentPercentage = '13';
            break;
          case 1 :
            this.currentPercentage = '43';
            break;
          case 2 :
            this.currentPercentage = '68';
            break;
          case 3 :
            this.currentPercentage = '100';
            break;
        }
      },
      immediate: true
    }
  },

  methods: {
    ...mapMutations([
      'changeTitleTxt',
      'storageKeshiCode',
      'storageYihuCode',
      'storageLajiCode',
      'storageLanyaCz',
      'changeStartCollectTime',
      'changeApplicationCollectTime',
      'changeCollectBtn',
      'changeSureBtn',
      'changeBackoutBtn',
      'initStorageLajiCode',
      'initStorageLanyaCz',
      'clearTrashStore',
      'changeTotalWeight',
      'changeStorageLajiCode',
      'changeStorageLanyaCz',
      'changeClickBackoutBtn',
      'changeStaffCodeShow',
      'changePrintBtn',
      'changeOtherBtn',
      'changeAstOfficeShow',
      'changeBagCodeShow',
      'changebluetoothWeighShow',
      'changeExtraKeshiMsg',
      'changeExtraYihuMsg',
      'changeExtraLajiMsg',
      'changeExtraLyczMsg',
      'changeCurrentActive',
      'changeCodeStep',
      'changeIsPlus',
      'changeFlowState',
      'ChangeRecordZeroCount',
      'changeRepeatSubmit',
      'changeManualWeighShow',
      'changeIsBlueWeight',
      'changeIsCollectCurrentOffice',
      'changeIsStoreWeight',
      'changeStorageLanyaCzOther'
    ]),

    weightMethodsText () {
      let currentText;
      IsPC() ?  currentText = '连接电子秤' : currentText = '蓝牙称重';
      return currentText
    },

    //添加按钮事件向服务端发送数据
    clickButton (data) {                      
       this.$socket.emit('weight', 'getweight')
    },

    // 断开socket连接
    sendDisconnect () {
			this.$socket.disconnect()
    },
    
    // 重连socket
    againConnect () {
      this.$socket.connect()
    },

    // 返回上一页
    backTo () {
      if (this.keshiCode && this.keshiCode.length > 0) {
        this.$dialog.confirm({
          message: '返回上一级后,将清空本次收集的医废数据',
          closeOnPopstate: true
        })
        .then(() => {
          this.$router.push({path: 'home'});
          this.changeTitleTxt({tit:'医废监测'});
          setStore('currentTitle','医废监测');
          //清除当前流程的扫码信息
          this.initSweepCodeInfo();
          this.clearPartStorage()
        })
        .catch(() => {
        })
      } else {
        this.$router.push({path: 'home'});
        this.changeTitleTxt({tit:'医废监测'});
        setStore('currentTitle','医废监测');
        //清除当前流程的扫码信息
        this.initSweepCodeInfo();
        this.clearPartStorage()
      }
    },

    // 右边下拉框菜单点击
    leftLiCLick (index) {
      this.liIndex = index;
      if (this.liIndex == 1) {
        if (this.keshiCode && this.keshiCode.length > 0) {
          this.$dialog.confirm({
            message: '跳转到我的页面后,将清空本次收集的医废数据',
            closeOnPopstate: true
          })
          .then(() => {
            this.$router.push({path: 'myInfo'});
            this.changeTitleTxt({tit:'我的'});
            setStore('currentTitle','我的');
            //清除当前流程的扫码信息
            this.initSweepCodeInfo();
            this.clearPartStorage()
          })
          .catch(() => {
          })
        } else {
          this.$router.push({path: 'myInfo'});
          this.changeTitleTxt({tit:'我的'});
          setStore('currentTitle','我的');
          //清除当前流程的扫码信息
          this.initSweepCodeInfo();
          this.clearPartStorage()
        }
      }  else if (this.liIndex == 0) {
        // 清除扫码字典数据
        removeStore('hospitalData');
        removeStore('careData');
        removeStore('departmentData');
        removeStore('pointData');
        removeStore('wasteTypeData')
        // 请求科室字典数据
        getDictionaryData(this.userInfo.proId).then((res) => {
          if (res && res.data.code == 200) {
            this.$dialog.alert({
              message: '刷新完毕',
              closeOnPopstate: true
            })
            .then(()=>{
              this.leftDownShow = false;
            });
            // 存入医院数据
            setStore('hospitalData', res.data.data['hospital']);
            // 存入医护数据
            setStore('careData', res.data.data['cares']);
            // 存入科室数据
            setStore('departmentData', res.data.data['departments'])
            // 存入暂存点数据
            setStore('pointData', res.data.data['points'])
            // 存入医废类型数据
            setStore('wasteTypeData', res.data.data['wasteType'])
          }
        })
      } else if (this.liIndex == 2) {
        this.$router.push({path: 'testPage'});
        this.changeTitleTxt({tit:'测试页'});
        setStore('currentTitle','测试页')
      }
    },

    // 跳转到我的页面
    skipMyInfo () {
      this.leftDownShow = !this.leftDownShow;
    },

    // 判断流程从哪步开始(当前科室与其它科室收集开始流程不同)
    judgeFlowPosition () {
      if (this.judgeFlowValue == -1) {
        this.changeCurrentActive(0);
        this.temporaryActive = -1;
        // 此时确定按钮还未出现,让进度进到0，可以获取到科室的扫描回调
        this.changeCodeStep(0)
      } else if (this.judgeFlowValue == 0) {
        this.changeCurrentActive(0);
        this.temporaryActive = 0;
        this.changeCodeStep(0);
        this.changeAstOfficeShow(true);
        this.changeIsPlus(true)
      } else if (this.judgeFlowValue == 1) {
        this.changeCollectBtn(false);
        this.changeBackoutBtn(true);
        this.changeSureBtn(true);
        this.changePrintBtn(false);
        this.changeOtherBtn(false);
        this.changeClickBackoutBtn(false);
        this.changeBagCodeShow(false);
        this.changeStaffCodeShow(true);
        this.changebluetoothWeighShow(false);
        this.changeManualWeighShow(false);
        this.changeAstOfficeShow(false);
        this.changeCurrentActive(1);
        this.temporaryActive = 1;
        this.changeCodeStep(1);
        this.changeIsPlus(true)
      } else if (this.judgeFlowValue == 2) {
        this.changeCurrentActive(2);
        this.temporaryActive = 2;
        this.changeCodeStep(2);
        this.changeIsPlus(true);
      } else if (this.judgeFlowValue == 3) {
        if (!getStore('weightMethods')) {
          if (this.isBlueWeight) {
            this.changebluetoothWeighShow(true);
            this.changeManualWeighShow(false);
            this.changeExtraLyczMsg(this.lanyaCz[this.lanyaCz.length-1])
          } else {
            this.changeManualWeighShow(true);
            this.changebluetoothWeighShow(false);
            this.manualWeight = this.lanyaCz[this.lanyaCz.length-1]
          }
        } else {
          if (getStore('weightMethods') == 'manual') {
            this.changeManualWeighShow(true);
            this.changebluetoothWeighShow(false);
            this.manualWeight = this.lanyaCz[this.lanyaCz.length-1]
          } else if (getStore('weightMethods') == 'bluetooth') {
            this.changebluetoothWeighShow(true);
            this.changeManualWeighShow(false);
            this.changeExtraLyczMsg(this.lanyaCz[this.lanyaCz.length-1])
          };
          this.changeCurrentActive(3);
          this.temporaryActive = 3;
          this.changeCodeStep(3);
          this.changeIsPlus(true);
        };
        this.changeCurrentActive(3);
        this.temporaryActive = 3;
        this.changeCodeStep(3);
        this.changeIsPlus(true)
      } else {
        this.initSweepCodeInfo()
      }
    },
    
    // 撤销操作
    backOut () {
      if (this.lajiCode.length == 0) {
        this.$dialog.alert({
          message: '当前没有要撤销的医废',
          closeOnPopstate: true
        })
        .then(()=>{})
      } else {
        this.chooseBackoutMethodsShow = true;
      }
    },

    // 科室撤销
    chooseBackoutSure () {
      this.chooseBackoutMethodsShow = false;
      this.changeClickBackoutBtn(true);
      this.initStorageLajiCode();
      this.initStorageLanyaCz();
      this.$router.push({path:'judgeCurrentDepantment'})
    },

    // 医废选择撤销
    chooseBackoutCancle () {
      this.chooseBackoutMethodsShow = false;
      this.barMessageList = [];
      let lajiCodeMsg;
      // 当前一次垃圾垃圾收集如果没有存入重量，则删除store中该次医废收集
      if (this.lajiCode.length > this.lanyaCz.length) {
        lajiCodeMsg = this.lajiCode;
        lajiCodeMsg.splice(lajiCodeMsg.length-1,1);
        this.initStorageLajiCode();
        this.changeStorageLajiCode(lajiCodeMsg);
        // 退回到该科室收集流程的第二步
        this.changeCurrentActive(1);
        this.temporaryActive = 1;
        this.changeCodeStep(1);
        this.changeStaffCodeShow(true);
        this.manualWeight = '';
        this.changeExtraLyczMsg('');
        this.changeAstOfficeShow(false);
        this.changeIsPlus(true);
        this.changebluetoothWeighShow(false);
        this.changeManualWeighShow(false);
        this.changeBagCodeShow(false);
        // 避免平板在扫到中文回到首页在点击进入收集页面,点击医废撤销时,对应医护信息为空
        this.changeExtraYihuMsg(JSON.parse(getStore('currentCollectMsg')).currentMsg[0]['yihuCode'])
      };
      if (this.lajiCode.length == 0) {
        this.$router.push({path:'judgeCurrentDepantment'});
        return
      }; 
      for (let i = 0; i < this.lajiCode.length; i++) {
        this.barMessageList.push({
          depName: this.lajiCode[i].depName,
          barCode: this.lajiCode[i].barCode,
          wasteName: this.lajiCode[i].id,
          barWeight: this.lanyaCz[i] ? this.lanyaCz[i] : '无',
          check: false
        })
      };
      this.chooseBackoutShow = true
    },

    // 打印方法汇总 
    // 科室, 垃圾类型，垃圾重量，收集人，交接人
    printInfoNoNum (dep,category,weight,collector,handover) {
      window.android.printInfoNoNum(dep,category,weight,collector,handover)
    },

    // 打印方法明细
    // 编号, 科室, 垃圾类型，垃圾重量，收集人，交接人
    printInfo (num,dep,category,weight,collector,handover) {
      window.android.printInfo(num,dep,category,weight,collector,handover)
    },

    // 初始化扫码信息
    initSweepCodeInfo () {
      this.temporaryActive = -1;
      this.changeCodeStep(0);
      this.changeFlowState(-1);
      this.changeIsPlus(false);
      this.changeCurrentActive(-1);
      this.changeCollectBtn(true);
      this.changeBackoutBtn(true);
      this.changeSureBtn(false);
      this.changePrintBtn(false);
      this.changeOtherBtn(false);
      this.changeBagCodeShow(false);
      this.changeAstOfficeShow(false);
      this.changeStaffCodeShow(false);
      this.changebluetoothWeighShow(false);
      this.changeManualWeighShow(false);
      this.clearTrashStore()
    },

    // 扫描二维码方法
    sweepAstoffice () {
      this.recordCount++;
      if (IsPC()) {
        this.isPcCallBack = true;
        if (this.isPcCallBack) {
          this.barCodeScannerShow = true
        };
      } else {
        window.android.scanQRcode()
      }
    },

    // 摄像头扫码后的回调
    scanQRcodeCallback(code) {
      if (!code.toString().includes('|')) {
        if (judgeDataType(code)) {
          this.processMethods(code)
        }
      } else {
        let codeJson = {};
        let codeData = code.split('|');
        if (codeData.length == 3 && codeData[2] != "" ) {
          codeJson['number'] = codeData[0];
          codeJson['type'] = codeData[1];
          codeJson['depName'] = codeData[0];
          code = codeJson
        } else if (codeData.length == 4) {
          codeJson['workerNumber'] = codeData[0];
          codeJson['depId'] = codeData[1];
          codeJson['depName'] = codeData[2];
          codeJson['id'] = codeData[3];
          code = codeJson
        }
        this.processMethods(code)
      }
    },

    //扫码枪扫码回调方法
    barcodeScanner (code) {
      if (!code.includes('|')) {
        if (judgeDataType(JSON.parse(code))) {
          code = JSON.parse(code)
        }
      } else {
        let codeJson = {};
        let codeData = code.split('|');
        if (codeData.length == 3 && codeData[2] != "") {
          codeJson['number'] = codeData[0];
          codeJson['type'] = codeData[1];
          codeJson['depName'] = codeData[0];
          code = codeJson
        } else if (codeData.length == 4) {
          codeJson['workerNumber'] = codeData[0];
          codeJson['depId'] = codeData[1];
          codeJson['depName'] = codeData[2];
          codeJson['id'] = codeData[3];
          code = codeJson
        }
      };
      this.barCodeScannerShow = false;
      if (this.isPcCallBack) {
        this.processMethods(code)
      }
    },

    // 扫描流程封装公共方法 
    processMethods (code) {
      // 扫码的科室信息存入store
      if (this.codeStep == 0) {
        // 二维码是否扫描正确判断
        if (code && Object.keys(code).length > 0) {
          if (code.hasOwnProperty('type') && code.hasOwnProperty('number') && code.hasOwnProperty('depName')) {
            if (code.type && code.number && code.depName) {
              judgeStagingPoint(this.batchNumber,code.number,this.userInfo.id).then((res) => {
                if (res && res.data.code == 200) {
                  if ( Dictionary(JSON.parse(getStore('pointData')),code['number']) 
                    && getStore('hospitalData')
                  ) {
                    this.changeCurrentActive(this.codeStep);
                    this.changeCodeStep(this.codeStep);
                    this.isPcCallBack = false;
                    this.temporaryActive = 0;
                    this.changeIsPlus(true);
                    this.changeCollectBtn(false);
                    this.changeSureBtn(true);
                    // 替换二维码信息中的对应字符编码为中文
                    code['number'] = Dictionary(JSON.parse(getStore('pointData')),code['number']);
                    code['depName'] = Dictionary(JSON.parse(getStore('pointData')),code['depName']);
                    code['proName'] = getStore('hospitalData');
                    this.storageKeshiCode(code);
                    this.changeExtraKeshiMsg(code);
                    this.changeStartCollectTime(formatTime('YYYY-MM-DD'));
                    this.changeAstOfficeShow(true);
                    // h5存储每步的收集信息和流程
                    setStore('currentCollectMsg',{currentMsg:this.garColMsg});
                    setStore('currentStep',0);
                  } else {
                    this.$dialog.alert({
                      message: '字典中没有匹配的数据或二维码不含有对应的字段',
                      closeOnPopstate: true
                    }).then(() => {
                      this.sweepAstoffice()
                    })
                  }
                } else {
                  if (res.data.code == 400) {
                     this.$dialog.alert({
                      message: `${res.data.msg}`,
                      closeOnPopstate: true
                    }).then(() => {
                      this.sweepAstoffice()
                    })
                  } else {
                    this.$dialog.alert({
                      message: `${res.data.msg}`,
                      closeOnPopstate: true
                    }).then(() => {
                      this.sweepAstoffice()
                    })
                  }
                };
                this.barCodeScannerShow = false
              })
              .catch((err) => {
                this.barCodeScannerShow = false;
                this.$dialog.alert({
                  message: `${err.message}`,
                  closeOnPopstate: true
                }).then(() => {
                  this.sweepAstoffice();
                });
              })
            } else {
              this.$dialog.alert({
                message: '扫描的科室信息不全,请重新扫描',
                closeOnPopstate: true
              }).then(() => {
                this.sweepAstoffice();
              })
            };
            this.barCodeScannerShow = false
          } else {
            this.$dialog.alert({
              message: '当前流程与预期流程不符,请重新扫描',
              closeOnPopstate: true
            }).then(() => {
              this.sweepAstoffice();
            })
          };
          this.barCodeScannerShow = false
        } else {
          this.$dialog.alert({
            message: '当前扫描没有收集到任何科室信息,请重新扫描',
            closeOnPopstate: true
          }).then(() => {
            this.sweepAstoffice();
          })
        }
        this.barCodeScannerShow = false
      };
      // 扫码的医护人员信息存入store
      if (this.codeStep == 1) {
        if (code && Object.keys(code).length > 0) {
          if (code.hasOwnProperty('workerNumber') && code.hasOwnProperty('id') && code.hasOwnProperty('depName') && code.hasOwnProperty('depId')) {
            if (code.workerNumber && code.depName && code.depId && code.id) {
              judgeMedicalPerson(code.workerNumber,this.batchNumber).then((res) => {
                  if (res && res.data.code == 200) {
                    if ( Dictionary(JSON.parse(getStore('careData')),code['workerNumber'])
                      && getStore('hospitalData')
                    ) {
                      this.changeCurrentActive(this.codeStep);
                      this.temporaryActive = 1;
                      this.changeCodeStep(this.codeStep);
                      this.isPcCallBack = false;
                      this.changeIsPlus(true);
                      this.changeAstOfficeShow(false);
                      code['depName'] = this.keshiCode[this.keshiCode.length-1].depName;
                      code['workerNumber'] = Dictionary(JSON.parse(getStore('careData')),code['workerNumber']);
                      code['proName'] = getStore('hospitalData');
                      this.storageYihuCode(code);
                      this.changeExtraYihuMsg(code);
                      this.changeStaffCodeShow(true);
                      this.changebluetoothWeighShow(false);
                      this.changeManualWeighShow(false);
                      // h5存储每步的收集信息和流程
                      setStore('currentCollectMsg',{currentMsg:this.garColMsg});
                      setStore('currentStep',1)
                    } else {
                      this.$dialog.alert({
                        message: '字典中没有匹配的数据或二维码不含有对应的字段',
                        closeOnPopstate: true
                      }).then(() => {
                        this.sweepAstoffice()
                      })
                    }
                  } else {
                    this.$dialog.alert({
                    message: `${res.data.msg}`,
                    closeOnPopstate: true
                  }).then(() => {
                    this.sweepAstoffice()
                  });
                };
                this.barCodeScannerShow = false;
              })
              .catch((err) => {
                this.barCodeScannerShow = false;
                this.$dialog.alert({
                  message: `${err.message}`,
                  closeOnPopstate: true
                }).then(() => {
                  this.sweepAstoffice();
                }); 
              })
            } else {
              this.$dialog.alert({
                message: '扫描的医护人员信息不全,请重新扫描',
                closeOnPopstate: true
              }).then(() => {
                this.sweepAstoffice();
              })
            };
            this.barCodeScannerShow = false;
          } else {
            this.$dialog.alert({
              message: '当前流程与预期流程不符,请重新扫描',
              closeOnPopstate: true
            }).then(() => {
              this.sweepAstoffice();
            })
          };
          this.barCodeScannerShow = false;
        } else {
          this.$dialog.alert({
            message: '当前扫描没有收集到任何医护人员信息,请重新扫描',
            closeOnPopstate: true
          }).then(() => {
            this.sweepAstoffice();
          })
        };
        this.barCodeScannerShow = false;
      };
      // 扫码的垃圾袋信息存入store
      if (this.codeStep == 2) {
        // 扫码回调中没有信息提示重新扫描
        if (code && Object.keys(code).length > 0) {
          if (code.hasOwnProperty('id') && code.hasOwnProperty('depName') && code.hasOwnProperty('barCode') && code.hasOwnProperty('depId')) {
            if (code.id && code.depName && code.barCode && code.depId) {
              this.barCodeList = [];
              for (let item of this.lajiCode) {
                for (let itemList in item) {
                  if (itemList == 'barCode') {
                    this.barCodeList.push(item[itemList])
                  }
                }
              };
              if (this.barCodeList.indexOf(`${code.barCode}`) == -1) {
                if ( Dictionary(JSON.parse(getStore('wasteTypeData')),code['id'])
                  && getStore('hospitalData')
                ) {
                  this.changeCurrentActive(this.codeStep);
                  this.temporaryActive = 2;
                  this.changeCodeStep(this.codeStep);
                  this.isPcCallBack = false;
                  this.changeIsPlus(true);
                  code['depName'] = Dictionary(JSON.parse(getStore('departmentData')),code['depName']);
                  code['id'] = Dictionary(JSON.parse(getStore('wasteTypeData')),code['id']);
                  code['proName'] = getStore('hospitalData');
                  this.storageLajiCode(code);
                  this.changeExtraLajiMsg(code);
                  this.changeBagCodeShow(true);
                  this.changeAstOfficeShow(false);
                  this.changeStaffCodeShow(false);
                  this.changeManualWeighShow(false);
                  this.changebluetoothWeighShow(false);
                  // h5存储每步的收集信息和流程
                  setStore('currentCollectMsg',{currentMsg:this.garColMsg});
                  setStore('currentStep',2)
                } else {
                  this.$dialog.alert({
                    message: '字典中没有匹配的数据或二维码不含有对应的字段',
                    closeOnPopstate: true
                  }).then(() => {
                    this.sweepAstoffice()
                  })
                }
              } else {
                this.$dialog.alert({
                  message: '扫描的医废重复,请重新扫描',
                  closeOnPopstate: true
                }).then(() => {
                  this.sweepAstoffice();
                })
              };
              this.barCodeScannerShow = false;
            } else {
              this.$dialog.alert({
                message: '扫描的医废信息不全,请重新扫描',
                closeOnPopstate: true
              }).then(() => {
                this.sweepAstoffice();
              })
            };
            this.barCodeScannerShow = false;
          } else {
            this.$dialog.alert({
            message: '当前流程与预期流程不符,请重新扫描',
            closeOnPopstate: true
            }).then(() => {
              this.sweepAstoffice();
            })
          };
          this.barCodeScannerShow = false;
        } else {
          this.$dialog.alert({
            message: '当前扫描没有收集到任何医废信息,请重新扫描',
            closeOnPopstate: true
          }).then(() => {
            this.sweepAstoffice();
          })
        };
        this.barCodeScannerShow = false;
      }
    },

    // 连接蓝牙秤
    weightRubbish () {
      window.android.getWeight()
    },

    // 获取完重量后断开蓝牙秤
    breakScales () {
      window.android.disconnectScales()
    },

    // 连接蓝牙秤后的回调
    getWeightCallback(str) {
      if (this.codeStep == 3) {
        if (str) {
          this.changeCurrentActive(this.codeStep);
          this.temporaryActive = 3;
          this.changeManualWeighShow(false);
          this.changeCodeStep(this.codeStep);
          this.changebluetoothWeighShow(true);
          this.changeIsPlus(true);
          this.changeBagCodeShow(false);
          //每类医废实时回调重量存入store
          this.changeExtraLyczMsg(str);
          this.changeIsStoreWeight(false)
        }
      }
    },
    
    //打印凭单
    finishCollect () {
      // num,dep,category,weight,collector,handover
      // 编号, 科室, 垃圾类型，垃圾重量，收集人，交接人
      if (this.lajiCode.length == 0) {
        this.$dialog.alert({
          message: '当前没有要打印的凭条',
          closeOnPopstate: true
        }).then(() => {
        });
        return
      };
      if (!IsPC()) {
        this.changePrintBtn(false);
      };
      this.changeOtherBtn(true);
      this.changeBackoutBtn(false);
      this.printCount++;
      if (this.printCount == 1) {
        this.choosePrintType = true;
        return
      };
      if (IsPC()) { 
        if (this.pcPrintShowCollect && this.ifGlue) {
          this.trashCollect();
          this.pcPrintShowCollect = true;
          this.pcPrintShowDetail = false;
          this.$print(this.$refs.printCode);
          this.pcPrintShowCollect = false;
          this.printCount = 0;
        }
      }
    },

    // 常规打印
    conventionPrint () {
      if (!IsPC()) {
        this.isPdaCollect = true;
        this.printMethods()
      } else {
        this.ifGlue = true;
        this.trashCollect();
        this.pcPrintShowCollect = true;
        this.pcPrintShowDetail = false;
        this.$print(this.$refs.printCode);
        this.pcPrintShowCollect = false
      }
    },

    // 不干胶打印
    gluePrint () {
      this.ifGlue = false;
      this.choosePrintType = false;
      this.chooseGluePrintType = true;
      this.changePrintBtn(false);
    },

    // 不干胶明细打印
    gluePrintDetail () {
      if (!IsPC()) {
        this.isPdaCollect = false;
        this.printMethods()
      } else {
        this.socketData = [];
        this.trashCollect();
        for (let i = 0; i < this.lajiCode.length; i++) {
          this.socketData.push(
            [
              `科室:${this.lajiCode[i].depName}`,
              `医废编号:${this.lajiCode[i].barCode}`,
              `垃圾类型:${this.lajiCode[i].id}`,
              `垃圾重量:${Number(this.lanyaCz[i]).toFixed(2)}kg`,
              `收集人:${this.userInfo.workerName}`,
              `交接人:${this.yihuCode[0].workerNumber}`,
              `时间:${this.collectTime}`
            ]
          )
        };
        console.log(this.socketData);
        this.$socket.emit('print', {times: 2, data: this.socketData})
      }
    },

    // 不干胶汇总打印
    gluePrintCollect () {
      if (!IsPC()) {
        this.isPdaCollect = true;
        this.printMethods()
      } else {
        this.socketData = [];
        this.trashCollect();
        if (this.lajiCode.length == 1) {
          this.socketData.push(
            [
              `科室:${this.lajiCode[0].depName}`,
              `垃圾类型:${this.lajiCode[0].id}`,
              `垃圾重量:${Number(this.lanyaCz[0]).toFixed(2)}kg`,
              `收集人:${this.userInfo.workerName}`,
              `交接人:${this.yihuCode[0].workerNumber}`,
              `时间:${this.collectTime}`
            ]
          )
        } else {
          for (let item of this.pcMapList) {
            this.socketData.push(
              [ 
                `科室:${this.lajiCode[0].depName}`,
                `垃圾类型:${item['type']}`,
                `垃圾重量:${Number(item['weight']).toFixed(2)}kg`,
                `收集人:${this.userInfo.workerName}`,
                `交接人:${this.yihuCode[0].workerNumber}`,
                `时间:${this.collectTime}`
              ]
            )
          }
        };
        console.log('汇总数据',this.socketData);
        this.$socket.emit('print', {times: 2, data: this.socketData})
      }
    },

    //pda打印方法封装 
    printMethods () {
      let map = {};
      let momentTypeList = [];
      this.pcMapList = [];
      for (let item of this.lajiCode) {
        for (let itemList in item) {
          if (itemList == 'id') {
            momentTypeList.push(item[itemList])
          }
        }
      };
      // 合并重复的垃圾类型及其重量
      momentTypeList.forEach((value, index) => {
        Object.prototype.hasOwnProperty.call(map, value) || (map[value] = 0);
        map[value] += Number(this.lanyaCz[index]);
      });
      for (let item in map ) {
        this.pcMapList.push({type:item, weight: map[item]})
      };
      if (this.lajiCode.length == 1) {
        if (this.isPdaCollect) {
          let flag = true;
          this.printInfoNoNum(this.lajiCode[0].depName,this.lajiCode[0].id,
            this.lanyaCz[0],this.userInfo.workerName,this.yihuCode[this.yihuCode.length-1].workerNumber);
          if (flag) {
            this.printInfoNoNum(this.keshiCode[0].depName,this.lajiCode[0].id,
              this.lanyaCz[0],this.userInfo.workerName,this.yihuCode[this.yihuCode.length-1].workerNumber);
          }
        } else {
          let flagOther = true;
          this.printInfo(this.lajiCode[0].barCode,this.lajiCode[0].depName,this.lajiCode[0].id,
            this.lanyaCz[0],this.userInfo.workerName,this.yihuCode[this.yihuCode.length-1].workerNumber);
          if (flagOther) {
          this.printInfo(this.lajiCode[0].barCode,this.lajiCode[0].depName,this.lajiCode[0].id,
            this.lanyaCz[0],this.userInfo.workerName,this.yihuCode[this.yihuCode.length-1].workerNumber);
          }
        }
      } else if (this.lajiCode.length > 1) {
        // 汇总打印
        if (this.isPdaCollect) {
          // 记录打印次数
          let timeNum = 1;
          // 循环调用打印接口
          for (var i = 0, len = this.lajiCode.length; i<len; i++) {
            if (i == Object.values(map).length) {return};
            this.printInfoNoNum(this.lajiCode[i].depName,Object.keys(map)[i],
            Object.values(map)[i],this.userInfo.workerName,this.yihuCode[this.yihuCode.length-1].workerNumber);
            // 打印两联
            if (timeNum < 2) { 
              if (i == Object.values(map).length-1) { 
                i = -1;
                timeNum++
              }
            }
          }
        } else {
          // 明细打印
          // 记录打印次数
          let timeNumOther = 1;
          // 循环调用打印接口
          for (var j = 0, len = this.lajiCode.length; j<len; j++) {
            this.printInfo(this.lajiCode[j].barCode,this.lajiCode[j].depName,this.lajiCode[j].id,
            this.lanyaCz[j],this.userInfo.workerName,this.yihuCode[this.yihuCode.length-1].workerNumber);
            // 打印两联
            if (timeNumOther < 2) {
              if (j == this.lanyaCz.length-1) { 
                j = -1;
                timeNumOther++
              }
            }
          }
        }
      }
    },

    //医废打印方法汇总
    trashCollect () {
      let map = {};
      let momentTypeList = [];
      this.pcMapList = [];
      for (let item of this.lajiCode) {
        for (let itemList in item) {
          if (itemList == 'id') {
            momentTypeList.push(item[itemList])
          }
        }
      };
      // 合并重复的垃圾类型及其重量
      momentTypeList.forEach((value, index) => {
        Object.prototype.hasOwnProperty.call(map, value) || (map[value] = 0);
        map[value] += Number(this.lanyaCz[index]);
      });
      for (let item in map ) {
        this.pcMapList.push({type:item, weight: map[item]})
      }
    },

    // 确认扫码无误进入下个流程
    sureCurrentCodeMsg () {
      let middleCurrentActive = this.codeStep;
      // 当前流程扫码成功后才进入下个流程
      if (this.isPlus) {
        middleCurrentActive++;
        this.changeCodeStep(middleCurrentActive)
      };
      this.changeIsPlus(false);
      if (middleCurrentActive > 4) {return};
      if (middleCurrentActive == 3) {
        this.chooseWightMethodsShow = true;
        this.changeRepeatSubmit(false)
      } else if (middleCurrentActive == 4) {
        if (!this.isRepeatSubmit) {
          if (this.manualWeighShow) {
              if (this.manualWeight) {
                if (this.manualWeight <= 0) {
                  this.$dialog.alert({
                    message: '输入重量不能小于等于0,请重新输入',
                    closeOnPopstate: true
                    }).then(() => {
                    });
                } else {
                  if (!testWeight.test(this.manualWeight.toString())) {
                    this.$dialog.alert({
                      message: '输入重量不合法,请重新输入',
                      closeOnPopstate: true
                      }).then(() => {
                      });
                  } else {
                    if (!this.isStoreWeight) {
                      // 手动输入重量存入store的重量数组
                      this.changeCurrentActive(this.codeStep);
                      this.temporaryActive = 3;
                      this.storageLanyaCz(this.manualWeight);
                      this.$router.push({path:'judgeCurrentDepantment'});
                      // h5存储每步的收集信息和流程
                      setStore('currentCollectMsg',{currentMsg:this.garColMsg});
                      setStore('currentStep',3);
                      // h5存储当前的称重方式
                      setStore('weightMethods','manual')
                    } else {
                      this.changeCurrentActive(this.codeStep);
                      this.temporaryActive = 3;
                      this.$router.push({path:'judgeCurrentDepantment'})
                    }
                  }
                }
              } else {
                this.$dialog.alert({
                  message: '输入重量不能为空,请重新输入',
                  closeOnPopstate: true
                  }).then(() => {
                });
              }
            } else {
              // 断开蓝牙秤连接
              // this.breakScales();
              if (this.extraLyczMsg == 0.0 || !this.extraLyczMsg) {
                this.$dialog.confirm({
                  message: '称重重量不能为0或空,是否重新称重?',
                  closeOnPopstate: true
                })
                .then(() => {
                  this.changeCodeStep(3);
                  this.changeExtraLyczMsg(null);
                  if (!IsPC) {
                    this.weightRubbish()
                  } else {
                    this.initWeight()
                  }
                })
                .catch(() => {
                  let lajiCodeAgent = this.lajiCode;
                  lajiCodeAgent.splice(this.lajiCode.length-1,1);
                  this.initStorageLajiCode();
                  this.changeStorageLajiCode(lajiCodeAgent);
                  this.changebluetoothWeighShow(false);
                  this.$router.push({path:'judgeCurrentDepantment'});
                })
              } else {
                if (testWeight.test(this.Trim(this.extraLyczMsg))) {
                  if (!this.isStoreWeight) {
                    // 最终的回调重量存store的重量数组
                    this.storageLanyaCz(this.extraLyczMsg);
                    this.changeExtraLyczMsg(null);
                    this.$router.push({path:'judgeCurrentDepantment'});
                    this.$socket.emit('weight', 'stop');
                    // h5存储每步的收集信息和流程
                    setStore('currentCollectMsg',{currentMsg:this.garColMsg});
                    setStore('currentStep',3);
                    // h5存储当前的称重方式
                    setStore('weightMethods','bluetooth')
                  } else {
                    this.changeExtraLyczMsg(null);
                    this.$router.push({path:'judgeCurrentDepantment'})
                  }
                } else {
                  this.$dialog.alert({
                    message: '称重重量不合法,请重新称重',
                    closeOnPopstate: true
                  }).then(() => {
                    this.changeCodeStep(3);
                    this.changeExtraLyczMsg(null);
                    if (!IsPC) {
                      this.weightRubbish()
                    } else {
                      this.initWeight()
                    }
                  })
                }
              }
            }
        } else {
          this.$router.push({path:'judgeCurrentCollectFinish'});
        };
        this.changeRepeatSubmit(false);
      }
      else {
        this.sweepAstoffice()
      }
    },

    //初始化重新称重
    initWeight () {
      this.changeCurrentActive(this.codeStep);
      this.temporaryActive = 3;
      this.changeManualWeighShow(false);
      this.changeCodeStep(this.codeStep);
      this.changebluetoothWeighShow(true);
      this.changeIsPlus(true);
      this.changeBagCodeShow(false);
      this.changeIsStoreWeight(false);
      this.$socket.emit('weight', 'getweight')
    },

    // 蓝牙或usb称重
    chooseWightSure () {
      this.chooseWightMethodsShow = false;
      if (!IsPC()) { 
        this.weightRubbish()
      } else {
        if (this.codeStep == 3) {
          this.changeCurrentActive(this.codeStep);
          this.temporaryActive = 3;
          this.changeManualWeighShow(false);
          this.changeCodeStep(this.codeStep);
          this.changebluetoothWeighShow(true);
          this.changeIsPlus(true);
          this.changeBagCodeShow(false);
          this.changeIsStoreWeight(false);
          this.$socket.emit('weight', 'getweight')
        }
      }
      this.changeIsBlueWeight(true)
    },

    // 手动输入
    chooseWightCancle () {
      this.chooseWightMethodsShow = false;
      this.changeManualWeighShow(true);
      this.changebluetoothWeighShow(false);
      this.changeIsBlueWeight(false);
      this.changeBagCodeShow(false);
      this.changeIsPlus(true);
      this.changeIsStoreWeight(false)
    },
    
    //其它科室收集
    collectSure () {
      this.$router.replace({path:'judgeOtherDepantment'})
    },

    // 医废选择撤销
    chooseBackout () {
      // 被选中的医废编码
      let checkBarList = [];
      let filterMsg = {};
      for (let item of this.barMessageList) {
        if (item.check) {
          checkBarList.push(item.barCode)
        }
      };
      if (checkBarList.length == 0) {
        this.$dialog.alert({
          message: '请选择要撤销的医废',
          closeOnPopstate: true
        }).then(() => {
          this.chooseBackoutShow = true
        });
        return
      };
      // 根据用户勾选来删除store中储存的医废数据
      filterMsg = this.resetBarArray(this.lajiCode, this.lanyaCz, checkBarList);
      // 重新存储store里的收集垃圾信息
      this.initStorageLajiCode();
      this.initStorageLanyaCz();
      this.changeStorageLajiCode(filterMsg['one']);
      this.changeStorageLanyaCz(filterMsg['two']);
      this.$router.push({path:'judgeCurrentDepantment'});
      this.changeClickBackoutBtn(true);
      this.chooseBackoutShow = false
    },

    // 全选操作
    toggleCheckedAll () {
      if (this.checkedAll) {
          this.barMessageList.forEach((item)=>{
            item.check = false  
          })
          this.checkedAll = false
      } else {
        this.barMessageList.forEach((item)=>{
          item.check = true  
        })
        this.checkedAll = true
      }
    },

    // 单选操作
     oneChecked (cart) {
      if (!cart) {
        this.checkedAll = false
      }
      let isExitCheckedNo = this.barMessageList.every(item=>{
        return item.check == true     
      });
      if (isExitCheckedNo) {
        this.checkedAll = true    
      } else {
        this.checkedAll = false
      }
    },

    // 根据给出的医废编码，来删除存储中存在的医废编码
    // arrOne: 医废信息,arrTwo: 医废重量,clearArr: 要删除的医废编码
    resetBarArray (arrOne,arrTwo,clearArr) {
			for (var i = 0; i < clearArr.length; i++) {
				for (var j = 0; j < arrOne.length; j++) {
					if (arrOne[j]['barCode'] == clearArr[i]) {
						arrOne.splice(j,1);
						arrTwo.splice(j,1);
						j--
					}
				}
			};
			return {'one':arrOne,'two':arrTwo}
    },
    
    // 是否执行扫码枪的绑定方法
    isExecute () {
      if (IsPC()) {
        scanCode(this.barcodeScanner)
      }
    },

    // 去除字符串前后空格
    Trim(str) { 
      return str.replace(/(^\s*)|(\s*$)/g, ""); 
    },

    //清除部分存储信息
    clearPartStorage () {
      removeStore('currentCollectMsg');
      removeStore('currentStep');
      removeStore('weightMethods') 
    }
  }
}

</script>
<style lang='less' scoped>
@import "../common/stylus/variable.less";
@import "../common/stylus/modifyUi.less";
  .content-wrapper {
    .left-dropDown {
     .rightDropDown
    }
    .content {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      margin-top: 60px;
      background: #f8f9fd;
      .content-middle {
        width: 100%;
        /deep/ .van-cell-group {
          width: 100% !important
        }
        > div {
          height: auto;
          width: 70%;
          background: #fff;
          margin-left: 4%;
          margin-top: 8%;
          padding: 20px 10px 20px 20px;
          box-shadow: 0 2.5px 12px 4px #d1d1d1;
          border-radius: 8px;
          p {
            line-height: 30px;
            font-size: 14px;
            color: #646464;
            height: auto
          }
          p:first-child {
              color: #313131;
              font-weight: bold;
              letter-spacing: 2px
            }
        }
        .new-summary {
          height: 100%;
          width: 100%
        }
      };
      .content-header {
        width: 100%;
        margin: 0 auto;
        margin-top: 10px;
        .progress-style {
          margin-top: 14px;
          margin-bottom: 14px;
        }
      }
      .content-footer {
        position: fixed;
        bottom: 6px;
        left: 0;
        text-align: center;
        width: 100%;
        span {
          display: inline-block;
          width: 150px;
          /deep/ .van-button--normal {
            padding: 0
          }
          button {
            background: @color-theme;
            border-color: @color-theme;
            text-align: center;
            letter-spacing: 2px;
            text-indent: 2px;
            border: none;
            height: 58px;
            line-height: 58px;
            font-size: 18px
          }
        }
        .showBackoutButton {
          button {
            background: @left-button;
            color: #fff
          }
        }
        .showPrintBtn {
          button {
            background: @left-button;
            color: #fff
          }
        }
        .showOtherButton {
          button {
          }
        }
      }
    }
    // 撤销医废弹框样式
    .changeBtn {
          height: 40px;
          background: #fbfbfb;
          line-height: 40px;
          padding-left: 10px;
          padding-top: 11px;
          box-sizing: border-box;
          /deep/ .van-icon {
            background: @color-theme;
            border-color: @color-theme
          }
      }
      .content-middle-list {
        height: 30vh;
        overflow: auto;
        .content-middle-list-item {
          position: relative;
          box-sizing: border-box;
          padding: 0 10px 10px 40px;
          height: 140px;
          .bottom-border-1px(#d3d3d3);
          .change-btn-position {
            position: absolute;
            top: 30px;
            left: 10px;
            /deep/ .van-icon {
              background: @color-theme;
              border-color: @color-theme
            }
          }
          .list-item {
            position: relative;
            height: 100%;
            .list-strip {
              position: absolute;
              top: 20px;
              left: 0;
              color: #707070;
              font-size: 12px;
              margin-top: 12px;
              width: 100%;
              text-align: left;
              p {
                margin-top: 12px;
                &:first-child {
                  margin-top: 0
                }
              }
            }
            .list-item-bottom {
              position: absolute;
              bottom: 0;
              right: 0;
              color: #bdbdbd;
              font-size: 12px;
              span {
                color: #5d5d5d
              }
            }
          }
        }
      }
  }
</style>
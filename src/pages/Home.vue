<template>
  <div class="word-cup">
    <HeaderTop :title="navTopTitle">
      <van-icon name="arrow-left" slot="left" @click="backTo"></van-icon> 
      <van-icon name="manager-o" slot="right" @click="skipMyInfo"></van-icon> 
    </HeaderTop>
    <div class="content">
      <div class="content-header">
        <img :src="bannerUrl" alt="">
      </div>
      <div class="content-middle">
        <div class="content-list" v-for="item in itemList" @click="routerSkip(item.name, item.itemText)">
          <p class="title-img">
            <img :src="item.imgUrl" alt="">
          </p>
          <p class="title-content">{{item.itemText}}</p>
        </div>
      </div>
    </div>
    <!-- <FooterBottom></FooterBottom>-->
  </div>
</template>
<script>
  import HeaderTop from '../components/HeaderTop'
  import FooterBottom from '../components/FooterBottom'
  import {getBatchNumber} from '../api/rubbishCollect.js'
  import NoData from '../components/NoData'
  import { mapGetters, mapMutations } from 'vuex'
  import collectWaste from '@/common/images/home/collect-waste.png'
  import abnormalWarning from '@/common/images/home/abnormal-warning.png'
  import collectHistory from '@/common/images/home/collect-history.png'
  import statement from '@/common/images/home/statement.png'
  import medicalIn from '@/common/images/home/medical-in.png'
  import medicalOut from '@/common/images/home/medical-out.png'
  import testStatistics from '@/common/images/home/test-statistics.png'
  import videoSurveillance from '@/common/images/home/video-surveillance.png'
  import homeBanner from '@/common/images/home/home-banner.png'
  import rePrint from '@/common/images/home/re-print.png'
  import addCheck from '@/common/images/home/add-check.png'
  import warningCheck from '@/common/images/home/warning-check.png'
  import { formatTime, setStore, getStore, removeStore } from '@/common/js/utils'
  export default {
    components:{
      HeaderTop,
      NoData,
      FooterBottom
    },
    data() {
      return {
        currentActive: 0,
        itemList: [
          { itemText: '医废收集', imgUrl: collectWaste, name: 'medicalCollect'},{ itemText: '医废入库', imgUrl: medicalIn, name: 'medicalInStorage'},
          { itemText: '医废出库', imgUrl: medicalOut, name: 'medicalOutStorage'},{ itemText: '报表统计', imgUrl: statement, name: 'reportAudit'},
          { itemText: '异常预警', imgUrl: abnormalWarning, name: 'abnormalWarning'},{ itemText: '收集历史', imgUrl: collectHistory, name: 'collectHistory'},
          { itemText: '视频监控', imgUrl: videoSurveillance, name: 'videoMonitor'},{ itemText: '补充打印', imgUrl: rePrint, name: 'addPrint'},{ itemText: '预警审核', imgUrl: warningCheck, name: 'warningCheck'},
          { itemText: '补录审核', imgUrl: addCheck, name: 'addCheck'}
        ],
        roleList: ['管理员','项目经理'],
        roleListOther: ['垃圾收集人员'],
        bannerUrl: homeBanner
      }
    },
    
    mounted(){
      // 控制设备物理返回按键
      pushHistory();
      this.gotoURL(() => { 
        pushHistory();
        this.$router.push({path: 'home'});  //输入要返回的上一级路由地址
        this.changeTitleTxt({tit: '医废监测'});
        setStore('currentTitle','医废监测')
      });
      this.initItemList ();
      this.judgeCodeFinish()
    },
    
    computed:{
      ...mapGetters([
        'navTopTitle',
        'userInfo'
      ]),
      getCardType () {
        return this.userInfo.roleName
      },
    },
    methods:{
      ...mapMutations([
        'changeTitleTxt',
        'changeApplicationCollectTime',
        'createBatchNumber',
        'changeRouterFlag',
        'changeIsCall',
        'changeFlowState',
        'changeGarColMsg',
        'changeCollectBtn',
        'changeSureBtn',
        'changeBackoutBtn',
        'changeTotalWeight',
        'changeStorageLajiCode',
        'changeStorageLanyaCz',
        'changeCurrentLajicodeState',
        'changeClickBackoutBtn',
        'changeStaffCodeShow',
        'changePrintBtn',
        'changeOtherBtn',
        'changeAstOfficeShow',
        'changeBagCodeShow',
        'changebluetoothWeighShow',
        'changeCodeStep',
        'changeManualWeighShow',
        'changeIsCollectCurrentOffice',
        'changeIsStoreWeight',
        'changeIsPlus',
        'changeCurrentActive',
        'clearTrashStore'
      ]),
      // 返回上一页
      backTo () {
        this.$router.replace({name: 'home'});
        this.changeTitleTxt({tit:'医废监测'})
      },
      // 初始化首页展示菜单列表
      initItemList () {
        if (this.roleList.indexOf(this.getCardType) == -1) {
          this.itemList.splice(-2,2);
        };
        if (this.roleListOther.indexOf(this.getCardType) !== -1) {
          this.itemList.splice(2,1)
        }
      },
      // 跳转到我的页面
      skipMyInfo () {
        this.$router.push({path: 'myInfo'});
        this.changeTitleTxt({tit:'我的'});
        setStore('currentTitle','我的')
      },
      //路由跳转
      routerSkip (name, text) {
        if (name) {
          if (text === '医废收集') {
            if (this.userInfo && this.userInfo.id) {
              this.changeApplicationCollectTime(formatTime('YYYY-MM-DD'));
              // 创建回收批次
              getBatchNumber(this.userInfo.id).then((res) => {
                if (res && res.data.code == 200) {
                  // 批次号存入store
                  this.createBatchNumber(res.data.data.batchNumber);
                  setStore('currentBatchNumber',res.data.data.batchNumber)
                }
              }).catch((err) => {
                this.$dialog.alert({
                  message: `${err.message}`,
                  closeOnPopstate: true
                }).then(() => {
                })
              })
            } else {
              this.$dialog.alert({
                message: '用户ID不能为空,请重新登录',
                closeOnPopstate: true
              }).then(() => {
                this.$router.push({name: 'login'})
              });
            }
          } else if (text === '收集历史') {
            this.changeIsCall(true)
          };
          this.$router.push({path:name});
          this.changeTitleTxt({tit:text});
          setStore('currentTitle',text)
        }
      },

      // 进入首页后判断上次流程有没有收集完毕
      judgeCodeFinish () {
        // 获取上次收集流程进行到哪一步
        if (getStore('currentStep')) {
          if (getStore('currentStep') == '0') {
            this.changeFlowState(0);
            this.changeCollectBtn(false);
            this.changeSureBtn(true);
            this.changePrintBtn(false);
            this.changeOtherBtn(false);
            this.changeClickBackoutBtn(false);
            this.changeBagCodeShow(false);
            this.changeAstOfficeShow(true);
            this.changeStaffCodeShow(false);
            this.changebluetoothWeighShow(false);
            this.changeManualWeighShow(false);
            this.changeCurrentLajicodeState(false);
            this.changeBackoutBtn(true);
          } else if (getStore('currentStep') == '1') {
            this.changeFlowState(1);
            this.changeCurrentLajicodeState(true);
            this.changeCollectBtn(false);
            this.changeBackoutBtn(true);
            this.changeSureBtn(true);
            this.changePrintBtn(false);
            this.changeOtherBtn(false);
            this.changeClickBackoutBtn(false);
            this.changeBagCodeShow(true);
            this.changeStaffCodeShow(false);
            this.changebluetoothWeighShow(false);
            this.changeManualWeighShow(false);
            this.changeAstOfficeShow(false)
          } else if (getStore('currentStep') == '2') {
            this.changeIsCollectCurrentOffice(true);   
            if (getStore('continueCurrentCollect') == 'false') {
              this.changeIsCollectCurrentOffice(false);
            } else if(getStore('continueCurrentCollect') == 'true') {
              this.changeIsCollectCurrentOffice(true);
            };
            this.changeCurrentLajicodeState(true);
            this.changeIsStoreWeight(true);
            this.changeFlowState(2);
            this.changeCollectBtn(false);
            this.changeBackoutBtn(true);
            this.changeSureBtn(true);
            this.changePrintBtn(false);
            this.changeOtherBtn(false);
            this.changeClickBackoutBtn(false);
            this.changeBagCodeShow(false);
            this.changeAstOfficeShow(false);
            this.changeStaffCodeShow(false);
          } else if (getStore('currentStep') == '3') {
            this.changeFlowState(3);
            this.changeCurrentLajicodeState(true);
            this.changeCollectBtn(false);
            this.changeBackoutBtn(true);
            this.changeSureBtn(true);
            this.changePrintBtn(false);
            this.changeOtherBtn(false);
            this.changeClickBackoutBtn(false);
            this.changeBagCodeShow(false);
            this.changeAstOfficeShow(false);
            this.changeStaffCodeShow(true)  
          }
        } else {
          this.initSweepCodeInfo()
        };

        // 给store收集相关的字段重新赋值
        if (getStore('currentCollectMsg')) {
          let collectMsg = JSON.parse(getStore('currentCollectMsg')).currentMsg;
          this.changeGarColMsg(collectMsg)
        } else {
          this.initSweepCodeInfo()
        }
      },

      // 初始化扫码信息
      initSweepCodeInfo () {
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
        this.changeIsCollectCurrentOffice(true);
        this.changeCurrentLajicodeState(false);
        this.clearTrashStore()
      }
    }
  }
</script>
<style lang='less' scoped>
  @import "../common/stylus/variable.less";
  @import "../common/stylus/mixin.less";
  @import "../common/stylus/modifyUi.less";
  .content {
    position: fixed;
    width: 100%;
    height: 100%;
    background: #fff;
    overflow: auto;
    .content-header {
      width: 100%;
      height: auto;
      margin-top: 60px;
      img {
        width: 100%;
        height: 100%
      }
    }
    .content-middle {
      width: 96%;
      margin: 0 auto;
      margin-top: 20px;
      .content-list {
        width: 22%;
        height: 80px;
        padding-top: 10px;
        text-align: center;
        box-sizing: border-box;
        margin-right: 4%;
        margin-bottom: 4%;
        display: inline-block;
        .title-img {
          display: inline-block;
          img {
            width: 100%;
            height: 100%
          }
        }
        .title-content {
          display: inline-block;
          color: black;
        }
      }
      div {
        &:nth-of-type(4n) {
          margin-right: 0;
          vertical-align: top;
        }
        &:last-child {
          margin-right: 0;
          vertical-align: top;
        }
      }
    }
  }   
  
</style>

<template>
  <div class="word-cup">
    <HeaderTop :title="navTopTitle">
      <van-icon name="arrow-left" slot="left" @click="backTo"></van-icon> 
      <van-icon name="manager-o" slot="right" @click="skipMyInfo"></van-icon> 
    </HeaderTop>
    <ul class="left-dropDown" v-show="leftDownShow">
      <li v-for="(item, index) in leftDropdownDataList" :class="{liStyle:liIndex == index}" @click="leftLiCLick(index)">{{item}}</li>
    </ul>
    <div class="content">
      <div class="content-header" v-if="!juddgeIspc()">
        <img :src="bannerUrl" alt="">
      </div>
      <div class="content-middle content-middle-home">
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
  import homeBanner from '@/common/images/home/home-banner.jpg'
  import rePrint from '@/common/images/home/re-print.png'
  import addCheck from '@/common/images/home/add-check.png'
  import warningCheck from '@/common/images/home/warning-check.png'
  import { formatTime, setStore, getStore, removeStore, IsPC } from '@/common/js/utils'
  import {getDictionaryData} from '@/api/login.js'
  export default {
    components:{
      HeaderTop,
      NoData,
      FooterBottom
    },
    data() {
      return {
        currentActive: 0,
        leftDownShow: false,
        liIndex: null,
        leftDropdownDataList: ['刷新','我的','测试'],
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
    
    mounted() {
      // 控制设备物理返回按键
      if (!IsPC()) {
        pushHistory();
        this.gotoURL(() => { 
          pushHistory();
          this.$router.push({path: 'home'});  //输入要返回的上一级路由地址
          this.changeTitleTxt({tit: '医废监测'});
          setStore('currentTitle','医废监测')
        })
      };
      this.$router.push({path: 'home'});  //输入要返回的上一级路由地址
      this.changeTitleTxt({tit: '医废监测'});
      setStore('currentTitle','医废监测')
      this.initItemList();
      this.judgeCodeFinish()
    },

    beforeRouteLeave(to, from, next) {
      //跳转到页面为收集历史时,目标页面不缓存
      if(to.name == 'collectHistory') {
        to.meta.keepAlive = false; 
      };
      next();
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

      juddgeIspc () {
        return IsPC()
      },

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

    // 右边下拉框菜单点击
    leftLiCLick (index) {
      this.liIndex = index;
      if (this.liIndex == 1) {
        this.$router.push({path: 'myInfo'});
        this.changeTitleTxt({tit:'我的'});
        setStore('currentTitle','我的')
      } else if (this.liIndex == 0) {
        // 清除扫码字典数据
        removeStore('hospitalData');
        removeStore('careData');
        removeStore('departmentData');
        removeStore('pointData');
        removeStore('wasteTypeData');
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
        this.$router.push({name: 'testPage'});
        this.changeTitleTxt({tit:'测试页'});
        setStore('currentTitle','测试页')
      }
    },

    // 跳转到我的页面
    skipMyInfo () {
      this.leftDownShow = !this.leftDownShow;
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
            this.changeBackoutBtn(true);
          } else if (getStore('currentStep') == '1') {
            this.changeFlowState(1);
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
            this.changeAstOfficeShow(false)
          } else if (getStore('currentStep') == '2') {
            this.changeFlowState(2);
            this.changeCollectBtn(false);
            this.changeBackoutBtn(true);
            this.changeSureBtn(true);
            this.changePrintBtn(false);
            this.changeOtherBtn(false);
            this.changeClickBackoutBtn(false);
            this.changeBagCodeShow(true);
            this.changeAstOfficeShow(false);
            this.changeStaffCodeShow(false);
          } else if (getStore('currentStep') == '3') {
            this.changeFlowState(3);
            this.changeIsStoreWeight(true);
            this.changeCollectBtn(false);
            this.changeBackoutBtn(true);
            this.changeSureBtn(true);
            this.changePrintBtn(false);
            this.changeOtherBtn(false);
            this.changeClickBackoutBtn(false);
            this.changeBagCodeShow(false);
            this.changeAstOfficeShow(false);
            this.changeStaffCodeShow(false)  
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
    .content-middle {
      margin: 0 auto;
      margin-top: 30px;
    }
    .content-header {
      height: 150px;
      img {
        width: 100%;
        height: 100%
      }
    }
  }   
  .left-dropDown {
    .rightDropDown
  }
</style>

<template>
    <div class="content-wrapper">
      <HeaderTop :title="navTopTitle">
        <van-icon name="arrow-left" slot="left" @click="backTo"></van-icon> 
        <van-icon name="manager-o" slot="right" @click="skipMyInfo"></van-icon> 
      </HeaderTop>
      <div class="content">
        <div class="content-header">
          <van-steps :active="showCurrentActive" active-icon="success"
            active-color="#38bdd0">
            <van-step>扫描科室二维码</van-step>
            <van-step>扫描医护人员工作条码</van-step>
            <van-step>扫描垃圾袋条码</van-step>
            <van-step>蓝牙称重</van-step>
          </van-steps>
        </div>
        <div class="content-middle">
          <van-panel v-show="showAstOfficeShow" title="科室信息" desc="" status="">
            <div class="ast-office">
                <!-- <p>number: {{extraKeshiMsg.number}}</p>
                <p>proId:{{extraKeshiMsg.proId}}</p> -->
                <p>科室: {{extraKeshiMsg ? extraKeshiMsg.name : ''}}</p>
                <!-- <p>id:{{extraKeshiMsg.id}}</p> -->
                <p>医院: {{extraKeshiMsg ? extraKeshiMsg.proName : ''}}</p>
                <!-- <p>type:{{extraKeshiMsg.type}}</p> -->
                <p>房间: {{extraKeshiMsg ? extraKeshiMsg.depName : ''}}</p>
            </div>
          </van-panel>
          <van-panel v-show="showStaffCodeShow" title="医护人员信息" desc="" status="">
            <div class="staff-code">
              <!-- <p>workerNumber: {{judgeFlowValue ? yihuCode[0].workerNumber : extraYihuMsg.workerNumber}}</p>
              <p>proId:{{judgeFlowValue ? yihuCode[0].proId : extraYihuMsg.proId}}</p>
              <p>depId:{{judgeFlowValue ? yihuCode[0].depId : extraYihuMsg.depId}}</p>
              <p>id:{{judgeFlowValue ?  yihuCode[0].id : extraYihuMsg.id}}</p> -->
              <p>医院: {{judgeFlowValue == 2 ? yihuCode[0].proName : extraYihuMsg ? extraYihuMsg.proName : ''}}</p>
              <p>姓名: {{judgeFlowValue == 2 ? yihuCode[0].workerName : extraYihuMsg ? extraYihuMsg.workerName : ''}}</p>
              <p>房间: {{judgeFlowValue == 2 ? yihuCode[0].depName : extraYihuMsg ? extraYihuMsg.depName : ''}}</p>
            </div>
           </van-panel>
          <van-panel v-show="showBagCodeShow" title="医废信息" desc="" status="">
            <div class="bag-code">
              <p>医废类型: {{extraLajiMsg ? extraLajiMsg.wasteName : ''}}</p>
              <!-- <p>proId:{{extraLajiMsg.proId}}</p>
              <p>depId:{{extraLajiMsg.depId}}</p> -->
              <p>医院: {{extraLajiMsg ? extraLajiMsg.proName : ''}}</p>
              <p>房间: {{extraLajiMsg ? extraLajiMsg.depName : ''}}</p>
              <!-- <p>barCode:{{extraLajiMsg.barCode}}</p> -->
            </div>
          </van-panel>
          <van-panel v-show="showBluetoothWeighShow" title="医废重量" desc="" status="">
            <div class="bluetooth-weigh">
              <p>重量: {{extraLyczMsg}}</p>
            </div>
          </van-panel>
          <div v-show="newSummary" class="new-summary"></div>
        </div>
        <div class="content-footer">
          <span class="showBackoutButton" v-show="showBackoutButton">
            <van-button type="info" @click="backOut"  size="normal">撤销</van-button>
          </span>
          <span class="showCollectButton" v-show="showCollectButton">
            <van-button type="info" @click="startTask" size="normal">医废收集</van-button>
          </span>
          <span class="showSureButton" v-show="showSureButton" >
            <van-button type="info" @click="sureCurrentCodeMsg" size="normal">确定</van-button>
          </span>
          <span class="showPrintBtn"  v-show="showPrintBtn">
            <van-button type="info" @click="finishCollect" size="normal">打印单据</van-button>
          </span>
          <span class="showOtherButton" v-show="showOtherButton">
            <van-button type="info" @click="collectSure" size="normal">其它科室</van-button>
          </span>
        </div>
      </div>
      <!-- <FooterBottom></FooterBottom> -->
    </div>
</template>

<script>
import HeaderTop from '../components/HeaderTop'
import FooterBottom from '../components/FooterBottom'
import {judgeStagingPoint,judgeMedicalPerson} from '../api/rubbishCollect.js'
import { pushHistory } from '@/common/js/utils'
import { mapGetters } from 'vuex'
import { mapMutations } from 'vuex'
export default {
   components:{
      HeaderTop,
      FooterBottom
    },
  data () {
    return {
      newSummary: false,
      currentTotalWeigh: 0
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
      'clearCurrentLajicode',
      'astOfficeShow',
      'staffCodeShow',
      'bagCodeShow',
      'bluetoothWeighShow',
      'extraKeshiMsg',
      'extraYihuMsg',
      'extraLajiMsg',
      'extraLyczMsg',
      'currentActive'
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
  },

  mounted () {
    pushHistory();
    // 监听历史记录点, 添加返回事件监听
    window.onpopstate = () => {
      this.$router.push({path: 'home'});  //输入要返回的上一级路由地址
      this.changeTitleTxt({tit: '医废监测'})
    }
    // 判断流程从哪步开始
    // this.judgeFlowPosition();
    // 二维码回调方法绑定到window下面,提供给外部调用
    let me = this;
    window['scanQRcodeCallback'] = (code) => {
      me.scanQRcodeCallback(code);
    },
    window['getWeightCallback'] = (code) => {
      me.getWeightCallback(code);
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
      'changeCurrentLajicodeState',
      'changeClickBackoutBtn',
      'changeStaffCodeShow',
      'changeCurrentActive',
      'changePrintBtn',
      'changeOtherBtn',
    ]),
    // 返回上一页
    backTo () {
      this.$router.push({path: 'home'});
      this.changeTitleTxt({tit:'医废监测'})
    },
    // 跳转到我的页面
    skipMyInfo () {
      this.$router.push({path: 'myInfo'});
      this.changeTitleTxt({tit:'我的'})
    },
    startTask () {
      this.changeCallPeriod(true);
      this.$router.push({path: 'commonSweepCode'})
    },
    // 判断流程从哪步开始
    judgeFlowPosition () {
      if (this.judgeFlowValue == 2) {
        this.changeCurrentActive(1);
        this.changeStaffCodeShow(true)
      };
      if (this.judgeFlowValue == 0) {
        this.changeCurrentActive(0);
      }
    },
    // 撤销操作
    backOut () {
      this.$dialog.confirm({
        message: '确定撤销该次医废收集?'
      }).then(() => {
        this.changeClickBackoutBtn(true);
        if (this.lajiCode.length == 0) {
          this.$router.replace({path:'judgeOtherDepantment'});
          // 清空撤销前存储的数据
          this.clearTrashStore()   
        } else if (this.lajiCode.length > 0) {
          if (this.clearCurrentLajicode) {
            let lajiCodeMsg = this.lajiCode;
            let lanyaCzMsg = this.lanyaCz;
            if (this.lajiCode.length == this.lanyaCz.length) {
              //保留之前存储的信息,删除此次存储的信息
              lajiCodeMsg.splice(this.lajiCode.length-1,1);
              lanyaCzMsg.splice(this.lanyaCz.length-1,1);
            } else {
              lajiCodeMsg.splice(this.lajiCode.length-1,1);
            };
            this.initStorageLajiCode();
            this.initStorageLanyaCz();
            this.changeStorageLajiCode(lajiCodeMsg);
            this.changeStorageLanyaCz(lanyaCzMsg);
          };
          this.$router.replace({path: 'judgeCurrentCollectFinish'});
          this.changeCurrentLajicodeState(false)
        }
      }).catch(() => {
        this.changeClickBackoutBtn(false);
      });
    },

    // 打印方法
    printProof (num,dep,category,weight,collector,handover) {
      window.android.printInfo(num,dep,category,weight,collector,handover)
    },
   
    // 称重方法
    weightRubbish () {
      this.$router.push({path: 'commonSweepCode'});
    },

    //打印凭单
    finishCollect () {
      // num,dep,category,weight,collector,handover
      // this.lajiCode[0].wasteName,
      // //编号, 科室, 垃圾类型，垃圾重量，收集人，交接人
      if (this.lajiCode.length == 1) {
        this.printProof(this.lajiCode[0].barCode,this.keshiCode[0].depName,this.lajiCode[0].wasteName,
         this.lanyaCz[0],this.userInfo.workerName,this.yihuCode[0].workerName);
      } else if (this.lajiCode.length > 1) {
        for (let i = 0, len = this.lajiCode.length; i<len; i++) {
          this.printProof(this.lajiCode[i].barCode,this.keshiCode[0].depName,this.lajiCode[i].wasteName,
          this.lanyaCz[i],this.userInfo.workerName,this.yihuCode[0].workerName);
        }
      };
      this.changePrintBtn(false);
      this.changeOtherBtn(true);
      this.changeBackoutBtn(false);
    },
    // 确认扫码无误进入下个流程
    sureCurrentCodeMsg () {
      let middleCurrentActive = this.showCurrentActive;
      middleCurrentActive++;
      this.changeCurrentActive(middleCurrentActive);
      if (this.showCurrentActive > 4) {return};
      if (this.showCurrentActive == 4) {
        this.$router.push({path:'judgeCurrentDepantment'})
      } else if (this.showCurrentActive == 3) {
        this.weightRubbish()
      } else {
        this.$router.push({path: 'commonSweepCode'});
      };
    },

    // 收集确认
    collectSure () {
      this.$router.push({path:'judgeOtherDepantment'})
    },

    // 时间格式方法
    formatTime () {
      return this.$moment(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss')
    }
  }
}

</script>
<style lang='less' scoped>
@import "../common/stylus/variable.less";
  .content-wrapper {
    /deep/ .van-icon-arrow-left {
      position: absolute;
      top: 44px;
      left: 4px;
      font-size: 20px;
      color: #fff
    }
    /deep/ .van-icon-manager-o {
      position: absolute;
      top: 44px;
      right: 6px;
      font-size: 18px;
      color: #fff;
    }
    .content {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      margin-top: 80px;
      background: #fff;
      .content-middle {
        height: 400px;
        width: 100%;
        > div {
          height: 100%;
          /deep/ .van-cell__title {
            span {
              font-size: 18px
            }
          }
          /deep/ .van-panel__content {
            div {
              p {
                font-size: 16px
              }
            }
          }
          p {
            line-height: 30px;
            padding-left: 14px;
            font-size: 12px;
            color: @color-theme;
          }
        }
        .new-summary {
          height: 100%;
          width: 100%
        }
      };
      .content-header {
        margin-top: 30px;
        /deep/ .van-steps {
          .van-steps__items {
            .van-hairline {
              .van-step__title {
                width: 75px;
                text-align: center;
                font-size: 14px;
                margin-top: -10px
              }
            }
          }
        }
      }
      .content-footer {
        position: fixed;
        bottom: 10px;
        left: 0;
        text-align: center;
        width: 100%;
        span {
          display: inline-block;
          button {
            background: @color-theme;
            border-color: @color-theme;
            padding: 0 60px;
          }
        }
        .showBackoutButton {
          button {
            background: #eaeaea;
            border: none;
            color: #969799
          }
        }
        .showPrintBtn {
          button {
            padding: 0 50px;
            background: #eaeaea;
            border: none;
            color: #969799
          }
        }
        .showOtherButton {
          button {
             padding: 0 50px;
          }
        }
      }
    }
  }
</style>
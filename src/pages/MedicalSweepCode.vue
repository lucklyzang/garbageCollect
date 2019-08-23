<template>
    <div class="content-wrapper">
      <HeaderTop :title="navTopTitle">
        <van-icon name="arrow-left" slot="left" @click="backTo"></van-icon> 
        <van-icon name="manager-o" slot="right" @click.native="backTo"></van-icon> 
      </HeaderTop>
      <div class="content">
        <div class="content-header">
          <van-steps :active="currentActive">
            <van-step>扫描科室二维码</van-step>
            <van-step>扫描医护人员工作条码</van-step>
            <van-step>扫描垃圾袋条码</van-step>
            <van-step>蓝牙称重</van-step>
          </van-steps>
        </div>
        <div class="content-middle">
          <div v-show="astOfficeShow" class="ast-office">
            <p>number: {{astOfficeCodeMsg.number}}</p>
            <p>proId:{{astOfficeCodeMsg.proId}}</p>
            <p>name:{{astOfficeCodeMsg.name}}</p>
            <p>id:{{astOfficeCodeMsg.id}}</p>
            <p>proName:{{astOfficeCodeMsg.proName}}</p>
            <p>type:{{astOfficeCodeMsg.type}}</p>
            <p>depName:{{astOfficeCodeMsg.depName}}</p>
          </div>
          <div v-show="staffCodeShow" class="staff-code">
            <p>workerNumber: {{judgeFlowValue ? yihuCode[0].workerNumber : staffCodeMsg.workerNumber}}</p>
            <p>proId:{{judgeFlowValue ? yihuCode[0].proId : staffCodeMsg.proId}}</p>
            <p>depId:{{judgeFlowValue ? yihuCode[0].depId : staffCodeMsg.depId}}</p>
            <p>id:{{judgeFlowValue ?  yihuCode[0].id : staffCodeMsg.id}}</p>
            <p>proName:{{judgeFlowValue ? yihuCode[0].proName : staffCodeMsg.proName}}</p>
            <p>workerName:{{judgeFlowValue ? yihuCode[0].workerName : staffCodeMsg.workerName}}</p>
            <p>depName:{{judgeFlowValue ?  yihuCode[0].depName : staffCodeMsg.depName}}</p>
          </div>
          <div v-show="bagCodeShow" class="bag-code">
            <p>wasteName: {{rubbishCodeMsg.wasteName}}</p>
            <p>proId:{{rubbishCodeMsg.proId}}</p>
            <p>depId:{{rubbishCodeMsg.depId}}</p>
            <p>proName:{{rubbishCodeMsg.proName}}</p>
            <p>depName:{{rubbishCodeMsg.depName}}</p>
            <p>barCode:{{rubbishCodeMsg.barCode}}</p>
          </div>
          <div v-show="bluetoothWeighShow" class="bluetooth-weigh">{{weightMsg}}</div>
          <div v-show="newSummary" class="new-summary"></div>
        </div>
        <div class="content-footer">
          <van-button type="info" @click="startTask" size="small">医废收集</van-button>
          <van-button type="info" @click="sureCurrentCodeMsg" size="small">确定</van-button>
          <van-button type="info" @click="finishCollect" v-show="showPrintButton" size="small">打印单据</van-button>
          <van-button type="info" @click="collectSure" v-show="showOtherButton" size="small">其它科室收集</van-button>
        </div>
      </div>
      <FooterBottom></FooterBottom>
    </div>
</template>

<script>
import HeaderTop from '../components/HeaderTop'
import FooterBottom from '../components/FooterBottom'
import {judgeStagingPoint,judgeMedicalPerson} from '../api/rubbishCollect.js'
import { mapGetters } from 'vuex'
import { mapMutations } from 'vuex'
export default {
   components:{
      HeaderTop,
      FooterBottom
    },
  data () {
    return {
      currentActive: 0,
      astOfficeShow: false,
      staffCodeShow: false,
      bagCodeShow: false,
      bluetoothWeighShow: false,
      newSummary: false,
      astOfficeCodeMsg: '',
      staffCodeMsg: '',
      rubbishCodeMsg: '',
      weightMsg: ''
    };
  },
  computed: {
     ...mapGetters([
      'navTopTitle',
      'keshiCode',
      'yihuCode',
      'lajiCode',
      'judgeFlowValue',
      'applicationCollectTime',
      'startCollectTime',
      'batchNumber',
      'showPrintBtn',
      'showOtherBtn'
    ]),
    showPrintButton () {
      return this.showPrintBtn
    },
    showOtherButton () {
      return this.showOtherBtn
    }
  },

  mounted () {
    // 判断流程从哪步开始
    this.judgeFlowPosition();
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
      'changeApplicationCollectTime'
    ]),
    // 重新扫码弹窗
    againSweepCode () {
       this.$dialog.alert({
        message: '流程与扫描数据不匹配,请重试'
      }).then(() => {
        this.sweepAstoffice()
      });
    },
    // 返回上一页
    backTo () {
      this.$router.go(-1);
      this.changeTitleTxt({tit:'医废监测'})
    },
    // 判断流程从哪步开始
    judgeFlowPosition () {
      if (this.judgeFlowValue == 2) {
        this.currentActive = 1;
        this.staffCodeShow = true;
      };
      if (this.judgeFlowValue == 0) {
        this.currentActive = 0;
      }
    },
    // 扫描二维码方法
    sweepAstoffice () {
      window.android.scanQRcode()
    },
    // 打印方法
    printProof (num,dep,category,weight,collector,handover) {
      window.android.printInfo(num,dep,category,weight,collector,handover)
    },
    // 扫码后的回调
    scanQRcodeCallback(code) {
      // 扫码的科室信息存入store
      if (this.currentActive == 0) {
        // 二维码是否扫描正确判断
       judgeStagingPoint(code.type,code.number).then((res) => {
         if (res && res.data.code == 200) {
          this.storageKeshiCode(code);
          this.changeStartCollectTime(this.formatTime());
          this.astOfficeShow = true;
          this.astOfficeCodeMsg = code;
         } else {
          this.againSweepCode()
         }
       })
       .catch((err) => {
         this.againSweepCode();
         console.log(err);
       })
      };
      // 扫码的医护人员信息存入store
      if (this.currentActive == 1) {
       judgeMedicalPerson(code.workerNumber,this.batchNumber).then((res) => {
          if (res && res.data.code == 200) {
            this.storageYihuCode(code);
            this.staffCodeShow = true;
            this.astOfficeShow = false;
            this.staffCodeMsg = code
          } else {
          this.againSweepCode()
         }
       })
       .catch((err) => {
        this.againSweepCode();
         console.log(err)
       })
      };
      // 扫码的垃圾袋信息存入store
      if (this.currentActive == 2) {
        this.storageLajiCode(code)
        this.bagCodeShow = true;
        this.staffCodeShow = false;
        this.rubbishCodeMsg = code
      };
    },
    // 称重方法
    weightRubbish () {
      window.android.getWeight()
    },
    // 称重后的回调
    getWeightCallback(str) {
      this.bagCodeShow = false;
      this.bluetoothWeighShow = true;
      this.weightMsg = str;
      this.storageLanyaCz(str)
    },

    //打印凭单
    finishCollect () {
      // num,dep,category,weight,collector,handover
      // 科室，时间，垃圾类型，垃圾重量，收集人，交接人
      this.printProof(this.keshiCode[0].depName,this.startCollectTime,this.lajiCode[0].wasteName,
      this.lanyaCz[0],this.userInfo.workerName,this.yihuCode[0].workerName)
    },
    // 确认扫码无误进入下个流
    sureCurrentCodeMsg () {
      this.currentActive++;
      if (this.currentActive > 4) {return};
      if (this.currentActive == 4) {
        this.$router.push({path:'judgeCurrentDepantment'})
      } else if (this.currentActive == 3) {
        this.weightRubbish()
      } else {
        this.startTask();
      };
    },
    // 收集确认
    collectSure () {
      this.$router.push({path:'judgeOtherDepantment'})
    },
    // 开始医废收集任务
    startTask () {
      // 扫描科室暂存点二维码
      this.sweepAstoffice();
    },
    // 时间格式方法
    formatTime () {
      return this.$moment(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss')
    }
  }
}

</script>
<style lang='less' scoped>
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
        height: 370px;
        width: 100%;
        border: 1px solid #d0efbb;
        div {
          height: 200px
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
                width: 70px;
                text-align: center;
              }
            }
          }
        }
      }
      .content-footer {
        margin-top: 10px;
        text-align: center;
        button {
          background: #38bdd0;
          border: 1px solid #e7e9ec;
        }
      }
    }
  }
</style>
<template>
    <div class="content-wrapper">
    </div>
</template>

<script>
import {judgeStagingPoint,judgeMedicalPerson} from '../api/rubbishCollect.js'
import { mapGetters, mapMutations } from 'vuex'
export default {
   components:{
    },
  data () {
    return {
      astOfficeShow: false,
      staffCodeShow: false,
      bagCodeShow: false,
      bluetoothWeighShow: false,
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
      'currentActive',
    ]),
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
    }
  },

  mounted () {
     // 控制设备物理返回按键
    let that = this;
    pushHistory()
    that.gotoURL(() => { 
    pushHistory()
     if (this.currentActive == 0) {
        this.changeCurrentActive(0);
        this.$router.push({path: 'medicalCollect'})
      } else if (this.currentActive == 1) {
        this.changeCurrentActive(0);
        this.$router.push({path: 'medicalCollect'})
      } else if (this.currentActive == 2) {
        this.changeCurrentActive(1);
        this.$router.push({path: 'medicalCollect'})
      } else if (this.currentActive == 3) {
        this.changeCurrentActive(2);
        this.$router.push({path: 'medicalCollect'})
      }
    });
    if (this.currentActive == 3) {
      this.weightRubbish()
    } else {
      this.sweepAstoffice();
    };
    // 二维码回调方法绑定到window下面,提供给外部调用
    let me = this;
    window['scanQRcodeCallback'] = (code) => {
      me.scanQRcodeCallback(code);
    };
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
      'changeAstOfficeShow',
      'changeStaffCodeShow',
      'changeBagCodeShow',
      'changebluetoothWeighShow',
      'changeExtraKeshiMsg',
      'changeExtraYihuMsg',
      'changeExtraLajiMsg',
      'changeExtraLyczMsg',
      'changeCurrentActive',
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
      this.$router.push({name:'home'});
      this.changeTitleTxt({tit:'医废监测'})
    },
    // 公共提示弹窗
    commonDialog (num) {
      switch(num) {  
        case 0:
          this.$dialog.alert({
            message: '返回到流程页面?'
          }).then(() => {
            this.changeCurrentActive(0);
            this.$router.push({path: 'medicalCollect'})
          });
          break;
         case 1:
          this.$dialog.alert({
            message: '返回到流程页面?'
          }).then(() => {
            this.changeCurrentActive(0);
            this.$router.push({path: 'medicalCollect'})
          });
          break;
         case 2:
          this.$dialog.alert({
            message: '返回到流程页面?'
          }).then(() => {
            this.changeCurrentActive(1);
            this.$router.push({path: 'medicalCollect'})
          });
          break;
         case 3:
          this.$dialog.alert({
            message: '返回到流程页面?'
          }).then(() => {
            this.changeCurrentActive(2);
            this.$router.push({path: 'medicalCollect'})
          });
          break;
      }
    },
    // 扫描二维码方法
    sweepAstoffice () {
      window.android.scanQRcode()
    },
    // 扫码后的回调
    scanQRcodeCallback(code) {
      // 扫码的科室信息存入store
      if (this.currentActive == 0) {
        // 二维码是否扫描正确判断
        if (code && Object.keys(code).length > 0) {
          if (code.name && code.proName && code.depName) {
            judgeStagingPoint(code.type,code.number).then((res) => {
              if (res && res.data.code == 200) {
                this.changeCollectBtn(false);
                this.changeSureBtn(true);
                this.storageKeshiCode(code);
                this.changeExtraKeshiMsg(code);
                this.changeStartCollectTime(this.formatTime());
                this.changeAstOfficeShow(true);
                this.$router.push({path: 'medicalCollect'});
              } else {
                this.againSweepCode()
              }
            })
            .catch((err) => {
              this.againSweepCode();
              console.log(err);
            })
          } else {
            this.$dialog.alert({
              message: `当前扫描没有收集到任何科室信息,请重新扫描1w${this.currentActive}`
            }).then(() => {
              this.changeCurrentActive(0);
              this.sweepAstoffice();
            })
          }
        } else {
          this.$dialog.alert({
            message: '当前扫描没有收集到任何科室信息,请重新扫描2'
          }).then(() => {
            this.changeCurrentActive(0);
            this.sweepAstoffice();
          })
        }
      };
      // 扫码的医护人员信息存入store
      if (this.currentActive == 1) {
        if (code && Object.keys(code).length > 0) {
          if (code.workerName && code.proName && code.depName) {
            judgeMedicalPerson(code.workerNumber,this.batchNumber).then((res) => {
                if (res && res.data.code == 200) {
                  this.storageYihuCode(code);
                  this.changeExtraYihuMsg(code);
                  this.changeStaffCodeShow(true);
                  this.changeAstOfficeShow(false);
                  this.$router.push({path: 'medicalCollect'});
                } else {
                this.againSweepCode()
              }
            })
            .catch((err) => {
              this.againSweepCode();
              console.log(err)
            })
          } else {
            this.$dialog.alert({
              message: '当前扫描没有收集到任何医护人员信息,请重新扫描'
            }).then(() => {
              this.changeCurrentActive(1);
              this.sweepAstoffice();
            })
          }
        } else {
          this.$dialog.alert({
            message: '当前扫描没有收集到任何医护人员信息,请重新扫描'
          }).then(() => {
            this.changeCurrentActive(1);
            this.sweepAstoffice();
          })
        }
      };
      // 扫码的垃圾袋信息存入store
      if (this.currentActive == 2) {
        // 扫码回调中没有信息提示重新扫描
        if (code && Object.keys(code).length > 0) {
          if (code.wasteName && code.proName && code.depName) {
            this.currentTotalWeigh = 0;
            this.storageLajiCode(code);
            this.changeExtraLajiMsg(code);
            this.changeBagCodeShow(true);
            this.changeStaffCodeShow(false);
            this.changeCurrentLajicodeState(true);
            this.$router.push({path: 'medicalCollect'});
          } else {
            this.$dialog.alert({
            message: '当前扫描没有收集到任何医废信息,请重新扫描'
            }).then(() => {
              this.changeCurrentActive(2);
              this.sweepAstoffice();
            })
          }
        } else {
          this.$dialog.alert({
            message: '当前扫描没有收集到任何医废信息,请重新扫描'
          }).then(() => {
            this.changeCurrentActive(2);
            this.sweepAstoffice();
          })
        }
      };
    },
    // 称重方法
    weightRubbish () {
      window.android.getWeight()
    },
    // 称重后的回调
    getWeightCallback(str) {
      if (str) {
        this.currentTotalWeigh+=Number(str);
        this.changebluetoothWeighShow(true);
        this.changeBagCodeShow(false);
        this.storageLanyaCz(Math.round(this.currentTotalWeigh * 100) / 100);
        this.changeExtraLyczMsg(Math.round(this.currentTotalWeigh * 100) / 100);
        this.$router.push({path: 'medicalCollect'});
        this.changeCurrentActive(3);
      }
    }
  }
}

</script>
<style lang='less' scoped>
</style>
<template>
    <div class="content-wrapper">
      <HeaderTop :title="navTopTitle">
        <van-icon name="arrow-left" slot="left" @click="backTo"></van-icon> 
        <van-icon name="manager-o" slot="right" @click="skipMyInfo"></van-icon> 
      </HeaderTop>
      <div class="content">
        <div class="content-header">
          <!-- <van-steps :active="showCurrentActive"
            active-color="#38bdd0"  inactive-icon="arrow">
            <van-step>扫描科室</van-step>
            <van-step>扫描医护</van-step>
            <van-step>扫描垃圾袋</van-step>
            <van-step>称重</van-step>
          </van-steps> -->
          <div class="progress-title">
            <span v-for="item in progressTitleList">
              {{item}}
            </span>
          </div>
          <van-progress :percentage="currentPercentage" pivot-text="0" text-color="#38bdd0" color="#38bdd0" stroke-width="8" />
        </div>
        <div class="content-middle">
          <van-panel v-show="showAstOfficeShow" title="科室信息" desc="" status="">
            <div class="ast-office">
                <p>科室: {{extraKeshiMsg ? extraKeshiMsg.name : ''}}</p>
                <p>医院: {{extraKeshiMsg ? extraKeshiMsg.proName : ''}}</p>
                <p>房间: {{extraKeshiMsg ? extraKeshiMsg.depName : ''}}</p>
            </div>
          </van-panel>
          <van-panel v-show="showStaffCodeShow" title="医护人员信息" desc="" status="">
            <div class="staff-code">
              <p>医院: {{judgeFlowValue == 2 ? yihuCode[0].proName : extraYihuMsg ? extraYihuMsg.proName : ''}}</p>
              <p>姓名: {{judgeFlowValue == 2 ? yihuCode[0].workerName : extraYihuMsg ? extraYihuMsg.workerName : ''}}</p>
              <p>房间: {{judgeFlowValue == 2 ? yihuCode[0].depName : extraYihuMsg ? extraYihuMsg.depName : ''}}</p>
            </div>
           </van-panel>
          <van-panel v-show="showBagCodeShow" title="医废信息" desc="" status="">
            <div class="bag-code">
              <p>医废类型: {{extraLajiMsg ? extraLajiMsg.wasteName : ''}}</p>
              <p>医院: {{extraLajiMsg ? extraLajiMsg.proName : ''}}</p>
              <p>房间: {{extraLajiMsg ? extraLajiMsg.depName : ''}}</p>
            </div>
          </van-panel>
          <van-panel v-show="showBluetoothWeighShow" title="医废重量" desc="" status="">
            <div class="bluetooth-weigh">
              <p>重量: {{extraLyczMsg}}</p>
            </div>
          </van-panel>
          <van-panel v-show="manualWeighShow" title="医废重量" desc="" status="">
            <van-cell-group>
              <van-field v-model="manualWeight"  label="医废重量(kg)" placeholder="请输入医废重量" />
            </van-cell-group>
          </van-panel>
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
import { formatTime } from '@/common/js/utils'
import { mapGetters, mapMutations } from 'vuex'
export default {
   components:{
      HeaderTop,
      FooterBottom
    },
  data () {
    return {
      manualWeight: '',
      manualWeighShow: false,
      progressTitleList: ['扫描科室','扫描医护','扫描医废','医废称重'],
      currentPercentage: 0,
      temporaryActive: -1
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
      'currentActive',
      'codeStep',
      'isPlus',
      'recordZeroCount'
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
    // 控制设备物理返回按键
    let that = this;
    pushHistory()
    that.gotoURL(() => { 
      pushHistory()
      this.$dialog.confirm({
        message: '返回上一级后,将清空本次收集的医废数据'
      })
      .then(() => {
        this.$router.push({path: 'home'});  //输入要返回的上一级路由地址
        this.changeTitleTxt({tit: '医废监测'});
        this.initSweepCodeInfo();
      })
      .catch(() => {
      })
    })

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

  watch: {
    temporaryActive : {
      handler(newVal,oldVal) {
        switch (newVal) {
          case -1 :
            this.currentPercentage = 0;
            break;
          case 0 :
            this.currentPercentage = 11;
            break;
          case 1 :
            this.currentPercentage = 42;
            break;
          case 2 :
            this.currentPercentage = 68;
            break;
          case 3 :
            this.currentPercentage = 100;
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
      'changeCurrentLajicodeState',
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
      'ChangeRecordZeroCount'
    ]),


    // 返回上一页
    backTo () {
      this.$dialog.confirm({
        message: '返回上一级后,将清空本次收集的医废数据',
        closeOnPopstate: true
      })
      .then(() => {
        this.$router.push({path: 'home'});
        this.changeTitleTxt({tit:'医废监测'});
        //清除当前流程的扫码信息
        this.initSweepCodeInfo()
      })
      .catch(() => {
      })
    },
    // 跳转到我的页面
    skipMyInfo () {
      this.$dialog.confirm({
        message: '跳转到我的页面后,将清空本次收集的医废数据',
        closeOnPopstate: true
      })
      .then(() => {
        this.$router.push({path: 'myInfo'});
        this.changeTitleTxt({tit:'我的'});
        //清除当前流程的扫码信息
        this.initSweepCodeInfo()
      })
      .catch(() => {
      })
    },
    startTask () {
      this.sweepAstoffice()
    },

    // 扫码验证网络异常弹窗
    abnormalSweepCode () {
      this.sweepAstoffice()
    },

    // 判断流程从哪步开始(当前科室与其它科室收集开始流程不同)
    judgeFlowPosition () {
      if (this.judgeFlowValue == 2) {
        this.changeCurrentActive(1);
        this.temporaryActive = 1;
        this.changeCodeStep(1);
        this.changeStaffCodeShow(true);
        this.changeIsPlus(true);
      } else if (this.judgeFlowValue == 0) {
        this.changeCurrentActive(-1);
        this.temporaryActive = -1;
        this.changeCodeStep(0)
      } else {
        this.initSweepCodeInfo()
      }
    },
    // 撤销操作
    backOut () {
      this.$dialog.confirm({
        message: '确定撤销该次医废收集?',
        closeOnPopstate: true
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

    // 初始化扫码信息
    initSweepCodeInfo () {
      this.changeCodeStep(0);
      this.changeFlowState(0);
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
      this.clearTrashStore()
    },

    // 扫描二维码方法
    sweepAstoffice () {
      window.android.scanQRcode()
    },

    // 获取完重量后断开蓝牙秤
    breakScales () {
      window.android.disconnectScales()
    },

    // 扫码后的回调
    scanQRcodeCallback(code) {
      // 扫码的科室信息存入store
      if (this.codeStep == 0) {
        // 二维码是否扫描正确判断
        if (code && Object.keys(code).length > 0) {
          if (code.hasOwnProperty('type') && code.hasOwnProperty('number')) {
            if (code.type && code.number) {
              judgeStagingPoint(code.type,code.number).then((res) => {
                if (res && res.data.code == 200) {
                  this.changeCurrentActive(this.codeStep);
                  this.changeCodeStep(this.codeStep);
                  this.temporaryActive = 0;
                  this.changeIsPlus(true);
                  this.changeCollectBtn(false);
                  this.changeSureBtn(true);
                  this.storageKeshiCode(code);
                  this.changeExtraKeshiMsg(code);
                  this.changeStartCollectTime(formatTime('YYYY-MM-DD'));
                  this.changeAstOfficeShow(true);
                } else {
                  this.$dialog.alert({
                    message: `${res.data.msg}`,
                    closeOnPopstate: true
                  }).then(() => {
                    this.sweepAstoffice()
                  });
                }
              })
              .catch((err) => {
                this.$dialog.alert({
                  message: `${err.message}`,
                  closeOnPopstate: true
                }).then(() => {
                  this.abnormalSweepCode();
                });
              })
            } else {
              this.$dialog.alert({
                message: '扫描的科室信息不全,请重新扫描',
                closeOnPopstate: true
              }).then(() => {
                this.sweepAstoffice();
              })
            }
          } else {
            this.$dialog.alert({
              message: '当前流程与预期流程不符,请重新扫描',
              closeOnPopstate: true
            }).then(() => {
              this.sweepAstoffice();
            })
          }
        } else {
          this.$dialog.alert({
            message: '当前扫描没有收集到任何科室信息,请重新扫描',
            closeOnPopstate: true
          }).then(() => {
            this.sweepAstoffice();
          })
        }
      };
      // 扫码的医护人员信息存入store
      if (this.codeStep == 1) {
        if (code && Object.keys(code).length > 0) {
          if (code.hasOwnProperty('workerName')) {
            if (code.workerName) {
              judgeMedicalPerson(code.workerNumber,this.batchNumber).then((res) => {
                  if (res && res.data.code == 200) {
                    this.changeCurrentActive(this.codeStep);
                    this.temporaryActive = 1;
                    this.changeCodeStep(this.codeStep);
                    this.changeIsPlus(true);
                    this.storageYihuCode(code);
                    this.changeExtraYihuMsg(code);
                    this.changeStaffCodeShow(true);
                    this.changeAstOfficeShow(false);
                  } else {
                    this.$dialog.alert({
                    message: `${res.data.msg}`,
                    closeOnPopstate: true
                  }).then(() => {
                    this.sweepAstoffice()
                  });
                }
              })
              .catch((err) => {
                this.$dialog.alert({
                  message: `${err.message}`,
                  closeOnPopstate: true
                }).then(() => {
                  this.abnormalSweepCode();
                }); 
              })
            } else {
              this.$dialog.alert({
                message: '扫描的医护人员信息不全,请重新扫描',
                closeOnPopstate: true
              }).then(() => {
                this.sweepAstoffice();
              })
            }
          } else {
            this.$dialog.alert({
              message: '当前流程与预期流程不符,请重新扫描',
              closeOnPopstate: true
            }).then(() => {
              this.sweepAstoffice();
            })
          }
        } else {
          this.$dialog.alert({
            message: '当前扫描没有收集到任何医护人员信息,请重新扫描',
            closeOnPopstate: true
          }).then(() => {
            this.sweepAstoffice();
          })
        }
      };
      // 扫码的垃圾袋信息存入store
      if (this.codeStep == 2) {
        // 扫码回调中没有信息提示重新扫描
        if (code && Object.keys(code).length > 0) {
          if (code.hasOwnProperty('wasteName') && code.hasOwnProperty('proName') && code.hasOwnProperty('depName') && code.hasOwnProperty('barCode')) {
            if (code.wasteName && code.proName && code.depName && code.barCode) {
              this.changeCurrentActive(this.codeStep);
              this.temporaryActive = 2;
              this.changeCodeStep(this.codeStep);
              this.changeIsPlus(true);
              this.storageLajiCode(code);
              this.changeExtraLajiMsg(code);
              this.changeBagCodeShow(true);
              this.changeStaffCodeShow(false);
              this.changeCurrentLajicodeState(true);
            } else {
              this.$dialog.alert({
                message: '扫描的医废信息不全,请重新扫描',
                closeOnPopstate: true
              }).then(() => {
                this.sweepAstoffice();
              })
            }
          } else {
            this.$dialog.alert({
            message: '当前流程与预期流程不符,请重新扫描',
            closeOnPopstate: true
            }).then(() => {
              this.sweepAstoffice();
            })
          }
        } else {
          this.$dialog.alert({
            message: '当前扫描没有收集到任何医废信息,请重新扫描',
            closeOnPopstate: true
          }).then(() => {
            this.sweepAstoffice();
          })
        }
      };
    },

    // 连接蓝牙秤
    weightRubbish () {
      window.android.getWeight()
    },

    // 连接蓝牙秤后的回调
    getWeightCallback(str) {
      if (this.codeStep == 3) {
        if (str) {
          this.changeCurrentActive(this.codeStep);
          this.temporaryActive = 3;
          this.changeCodeStep(this.codeStep);
          this.changebluetoothWeighShow(true);
          this.changeIsPlus(true);
          this.changeBagCodeShow(false);
          //每类医废实时回调重量存入store
          this.changeExtraLyczMsg(str);
        }
      }
    },
    
    //打印凭单
    finishCollect () {
      // num,dep,category,weight,collector,handover
      // this.lajiCode[0].wasteName,
      // 编号, 科室, 垃圾类型，垃圾重量，收集人，交接人
      if (this.lajiCode.length == 0) {
        this.$dialog.alert({
          message: '当前没有要打印的凭条',
          closeOnPopstate: true
        }).then(() => {
        });
        return
      };
      this.changePrintBtn(false);
      this.changeOtherBtn(true);
      this.changeBackoutBtn(false);
      if (this.lajiCode.length == 1) {
        let flag = true;
        this.printProof(this.lajiCode[0].barCode,this.keshiCode[0].depName,this.lajiCode[0].wasteName,
          this.lanyaCz[0],this.userInfo.workerName,this.yihuCode[0].workerName);
        if (flag) {
          this.printProof(this.lajiCode[0].barCode,this.keshiCode[0].depName,this.lajiCode[0].wasteName,
            this.lanyaCz[0],this.userInfo.workerName,this.yihuCode[0].workerName);
        }
      } else if (this.lajiCode.length > 1) {
        let map = {};
        let momentTypeList = [];
        // 记录打印次数
        let timeNum = 1;
        for (let item of this.lajiCode) {
          for (let itemList in item) {
            if (itemList == 'wasteName') {
              momentTypeList.push(item[itemList])
            }
          }
        };
        // 合并重复的垃圾类型及其重量
        momentTypeList.forEach((value, index) => {
          Object.prototype.hasOwnProperty.call(map, value) || (map[value] = 0);
          map[value] += Number(this.lanyaCz[index]);
        });
        // 循环调用打印接口
        for (var i = 0, len = this.lajiCode.length; i<len; i++) {
          if (i == Object.values(map).length) {return};
          this.printProof(this.lajiCode[i].barCode,this.keshiCode[0].depName,Object.keys(map)[i],
          Object.values(map)[i],this.userInfo.workerName,this.yihuCode[0].workerName);
          // 打印两联
          if (timeNum < 2) { 
            if (i == Object.values(map).length-1) {
              i = -1;
              timeNum++
            }
          }
        }
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
        if (middleCurrentActive == 4) {
          if (this.manualWeighShow == true) {
            let re = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/;
            if (this.manualWeight) {
              if (this.manualWeight <= 0) {
                this.$dialog.alert({
                  message: '输入重量不能小于等于0,请重新输入',
                  closeOnPopstate: true
                  }).then(() => {
                  });
              } else {
                if (!re.test(this.manualWeight.toString())) {
                  this.$dialog.alert({
                    message: '输入重量不合法,请重新输入',
                    closeOnPopstate: true
                    }).then(() => {
                    });
                } else {
                  // 手动输入重量存入store的重量数组
                  this.changeCurrentActive(this.codeStep);
                  this.temporaryActive = 3;
                  this.storageLanyaCz(this.manualWeight);
                  this.$router.push({path:'judgeCurrentDepantment'})
                }
              }
            } else {
              this.$dialog.alert({
                message: '重量不能为空,请重新输入',
                closeOnPopstate: true
                }).then(() => {
              });
            }
          } else {
            // 断开蓝牙秤连接
            // this.breakScales();
            if (this.extraLyczMsg == 0.0) {
              this.$dialog.confirm({
                message: '收集医废重量不能为0,再次称重?',
                closeOnPopstate: true
              }).then(() => {
                this.changeCodeStep(3);
                this.changeExtraLyczMsg(null);
                this.weightRubbish()
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
              // 最终的回调重量存store的重量数组
              this.storageLanyaCz(this.extraLyczMsg)
              this.changeExtraLyczMsg(null);
              this.$router.push({path:'judgeCurrentDepantment'});
            }
          }
      } else if (middleCurrentActive == 3) {
        this.chooseWeightMethod()
      } else {
        this.sweepAstoffice()
      }
    },

    // 选择称重方式
    chooseWeightMethod () {
      this.$dialog.confirm({
        message: '请选择称重方式',
        closeOnPopstate: true,
        cancelButtonText: '手动输入',
        confirmButtonText: '蓝牙称重'
      })
      .then(()=>{
        this.weightRubbish()
      })
      .catch(() => {
        this.manualWeighShow = true;
        this.changeBagCodeShow(false);
        this.changeIsPlus(true)
      })
    },

    //其它科室收集
    collectSure () {
      this.$router.replace({path:'judgeOtherDepantment'})
    }
  }
}

</script>
<style lang='less' scoped>
@import "../common/stylus/variable.less";
@import "../common/stylus/modifyUi.less";
  .content-wrapper {
    .content {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      margin-top: 60px;
      background: #fff;
      .content-middle {
        height: 70vh;
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
            .van-cell-group {
              .van-field {
                span {
                  font-size: 14px
                }
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
        width: 94%;
        margin: 0 auto;
        margin-top: 16px;
        .progress-title {
          width: 100%;
          position: relative;
          span {
            display: inline-block;
            width: 25%;
            text-align: center;
            font-size: 13px;
            color: black;
            &:first-child {
              text-align: left
            }
            &:last-child {
              text-align: right
            }
          }
        }
        /deep/ .van-progress {
          margin-top: 14px;
          margin-bottom: 14px;
          .van-progress__portion {
            .van-progress__pivot {
              min-width: 14px;
              min-height: 14px;
              border-radius: 50%
            }
          }
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
            border: none;
          }
        }
        .showBackoutButton {
          button {
            background: #eaeaea;
            color: black
          }
        }
        .showPrintBtn {
          button {
            background: #eaeaea;
            color: black
          }
        }
        .showOtherButton {
          button {
          }
        }
      }
    }
  }
</style>
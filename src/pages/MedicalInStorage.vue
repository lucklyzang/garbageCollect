<template>
  <div class="content-wrapper">
    <HeaderTop :title="navTopTitle">
      <van-icon name="arrow-left" slot="left" @click="backTo"></van-icon> 
      <van-icon name="manager-o" slot="right" @click="skipMyInfo"></van-icon> 
    </HeaderTop>
    <div class="content-middle">
      <loading :isShow="showLoadingHint"></loading>
      <p class="content-middle-top">
        <span class="text-left">{{hospitalName}}</span>
        <span class="text-right"></span>
      </p>
      <div class="content-middle-list">
        <div class="content-middle-list-item" v-for="item in classList">
          <div class="list-item">
            <p class="list-item-left">医废类型: {{item.wasteName}}</p>
            <p class="list-item-right">
              重量: <span>{{item.weight}}kg</span>
            </p>
            <div class="list-strip">
              <p>科室: {{item.depName}}</p>
              <p class="list-sign">条码标识: {{item.collectNumber}}</p>
              <p class="list-times">回收趟次: {{item.batchNumber}}</p>
              <p class="list-code">时间: {{item.createTime}}</p>
            </div>
            <div class="list-item-bottom">
              移交人员: <span>{{item.careName}}</span>
            </div>
          </div>
        </div>
      </div>
      <!-- stageMsg -->
      <div class="stage-point">
        <van-panel v-show="stageMsg" title="暂存点信息" desc="" status="">
          <div>
            <!-- <p>{{stagingMsg.number}}</p> -->
            <!-- <p>{{stagingMsg.proId}}</p> -->
            <p>名称: {{stagingMsg.name}}</p>
            <!-- <p>{{stagingMsg.id}}</p> -->
            <p>医院: {{stagingMsg.proName}}</p>
            <!-- <p>{{stagingMsg.type}}</p> -->
            <p>房间号: {{stagingMsg.depName}}</p>
          </div>
        </van-panel>
      </div>
      <div class="btn-group">
        <p v-show="inStoageBtn" class="inStoageBtn">
          <van-button type="info" @click="medicalInStoragr" size="normal">医废入库</van-button>
        </p>
        <p v-show="sureBtnShow" class="sureBtnShow">
          <van-button type="info" @click="sureInStorage" size="normal">确定</van-button>
        </p>
      </div>
    </div>
    <!-- <FooterBottom></FooterBottom> -->
  </div>
</template>

<script>
import HeaderTop from '../components/HeaderTop'
import FooterBottom from '../components/FooterBottom'
import Loading from '../components/Loading'
import { mapGetters, mapMutations } from 'vuex'
import {queryBatch,judgeSummaryPoint,inStorageAdd} from '../api/rubbishCollect.js'
export default {
   components:{
    HeaderTop,
    FooterBottom,
    Loading
  },
  data () {
    return {
      topTitle: '医废收集',
      stagingMsg: '',
      classList: [],
      hospitalName: '',
      sureBtnShow: false,
      inStoageBtn: true,
      stageMsg: false,
      showLoadingHint: false,
      storeId: 0, 
      storeNumber:'',
      batchNumberLocal:'',
      inWorkerName:'',
      proId: '',  
      proName:  ''  
    };
  },
  computed: {
    ...mapGetters([
      'navTopTitle',
      'batchNumber',
      'userInfo'
    ])
  },

  mounted() {
    // 控制设备物理返回按键
    let that = this;
    pushHistory()
    that.gotoURL(() => { 
      pushHistory()
      this.$router.push({path: 'home'});  //输入要返回的上一级路由地址
      this.changeTitleTxt({tit: '医废监测'})
    });
    this.queryAllBatch();
    // 二维码回调方法绑定到window下面,提供给外部调用
    let me = this;
    window['scanQRcodeCallback'] = (code) => {
      me.scanQRcodeCallback(code);
    };
  },
  methods: {
    ...mapMutations([
      'changeTitleTxt', 
    ]),
    // 扫描二维码方法
    sweepStage () {
      window.android.scanQRcode()
    },
    // 返回上一页
    backTo () {
      this.$router.push({name:'home'});
      this.changeTitleTxt({tit:'医废监测'})
    },
    // 跳转到我的页面
    skipMyInfo () {
      this.$router.push({path: 'myInfo'});
      this.changeTitleTxt({tit:'我的'})
    },
    
    // 扫码后的回调
    scanQRcodeCallback (code) {
      if (code && Object.keys(code).length > 0) {
        if (code.hasOwnProperty('name') && code.hasOwnProperty('proName') && code.hasOwnProperty('depName') && code.hasOwnProperty('type')
          && code.hasOwnProperty('proId') && code.hasOwnProperty('number')) {
          if (code.name && code.proName && code.depName && code.type && code.proId && code.number) {
            judgeSummaryPoint(code.type,code.number).then((res) => {
              if (res && res.data.code == 200) {
                this.stageMsg = true;
                this.sureBtnShow = true;
                this.inStoageBtn = false;
                this.stagingMsg = code;
                this.storeId = code.id;
                this.storeNumber = code.number;
                this.proId = code.proId;
                this.proName = code.proName;
              } else {
                this.$dialog.alert({
                  message: `${res.data.msg}`,
                  closeOnPopstate: true
                  }).then(() => {
                  this.medicalInStoragr()
                });
              }
            })
            .catch((err)=>{
              this.$dialog.alert({
                message: `${err.message}`,
                closeOnPopstate: true
              }).then(() => {
                this.medicalInStoragr()
              });
            })
          } else {
            this.$dialog.alert({
              message: '当前扫描收集信息不全,请重试',
              closeOnPopstate: true
            }).then(() => {
              this.medicalInStoragr();
            })
          }
        } else {
          this.$dialog.alert({
            message: '当前流程与预期流程不符,请重新扫描',
            closeOnPopstate: true
          }).then(() => {
            this.medicalInStoragr();
          })
        }
      } else {
        this.$dialog.alert({
          message: '当前扫描没有收集到任何暂存点信息,请重新扫描',
          closeOnPopstate: true
        }).then(() => {
          this.medicalInStoragr();
        })
      }
    },
    //扫描医废入库暂存点二维码
    medicalInStoragr () {
      if (!this.batchNumber && !this.userInfo.batchNumber) {
        this.$dialog.alert({
          message: '批次号不能为空',
          closeOnPopstate: true
        }).then(() => {
        });
        return
      };
      this.sweepStage()
    },
    // 查询收集的垃圾批次信息00012019081900022019082200
    queryAllBatch () {
      this.classList = [];
      this.showLoadingHint = true;
      queryBatch({batchNumber:this.batchNumber ? this.batchNumber : this.userInfo.batchNumber ,workerId:this.userInfo.id, state: 0}).then((res)=>{
        if (res && res.data.code == 200) {
          if (res.data.data.length > 0) {
            let dataList = res.data.data;
            this.hospitalName = dataList[0].proName;
            this.batchNumberLocal = dataList[0].batchNumber;
            this.inWorkerName = dataList[0].workerName
            for (let item of dataList) {
              this.classList.push({
                collectNumber: item.collectNumber,
                wasteName: item.wasteName,
                weight: item.weight,
                batchNumber: item.batchNumber,
                createTime: item.createTime,
                careName: item.careName,
                depName: item.depName
              })
            }
          } else {
             this.$dialog.alert({
              message: '当前没有待入库的信息',
              closeOnPopstate: true
            }).then(() => {
              this.$router.push({path: 'home'});
              this.changeTitleTxt({tit: '医废监测'})
            });
          }
        };
        this.showLoadingHint = false
      })
      .catch((err)=> {
        this.showLoadingHint = false;
        this.$dialog.alert({
          message: `${err.message}`,
          closeOnPopstate: true
        }).then(() => {
        });
      })
    },
    //确定入库
    sureInStorage () {
      let inStorageMsg = {
        storeId: this.storeId, 
        storeNumber: this.storeNumber,
        batchNumber: this.batchNumberLocal,
        inWorkerName: this.inWorkerName,
        proId: this.proId,  
        proName: this.proName
      };
      inStorageAdd(inStorageMsg).then((res) => {
        if (res) {
          if (res.data.code == 200) {
            this.$dialog.alert({
              message: '医废入库成功',
              closeOnPopstate: true
            }).then(() => {
              this.$router.push({path: 'medicalOutStorage'})
            });
          } else {
            this.$dialog.alert({
              message: '医废入库失败',
              closeOnPopstate: true
            }).then(() => {
            });
          }
        }
      })
      .catch((err) => {
        console.log(err)
      })
    }
  }
}

</script>
<style lang='less' scoped>
@import "../common/stylus/variable.less";
@import "../common/stylus/modifyUi.less";
@import "../common/stylus/mixin.less";
  .content-wrapper {
    .content-middle {
      .content-middle();
      .content-middle-top {
        background: #7ad0e4;
        height: 26px;
        color: #bafbf5;
        position: relative;
        .text-left {
          position: absolute;
          top: 7px;
          left: 14px
        }
        .text-right {
          position: absolute;
          top: 7px;
          right: 14px
        }
      }
      .content-middle-list {
        height: 55vh;
        overflow: auto;
        .content-middle-list-item {
          padding: 14px;
          height: 140px;
          .bottom-border-1px(#d3d3d3);
          .list-item {
            position: relative;
            height: 100%;
            .list-item-left {
              position: absolute;
              top: 0;
              left: 0;
              color: black;
              font-size: 14px;
              font-weight: bold;
            }
            .list-item-right {
              position: absolute;
              top: 0;
              right: 0;
              color: #bdbdbd;
              font-size: 12px;
              span {
                color: #c97889
              }
            }
            .list-strip {
              position: absolute;
              top: 20px;
              left: 0;
              color: #707070;
              font-size: 12px;
              margin-top: 12px;
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
      .stage-point {
        position: fixed;
        width: 100%;
        left: 0;
        bottom: 80px;
        div {
          p {
            line-height: 20px;
            padding-left: 14px;
            font-size: 12px;
            color: @color-theme;
          }
        }
      }
      .btn-group {
        width: 100%;
        position: fixed;
        bottom: 6px;
        text-align: center;
        .inStoageBtn {
          button {
            background: @color-theme;
            border-color: @color-theme;
            padding: 0 120px;
          }
        }
        .sureBtnShow {
          button {
            background: @color-theme;
            border-color: @color-theme;
            padding: 0 140px;
          }
        }
      }
    }
  }
</style>
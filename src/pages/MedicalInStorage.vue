<template>
  <div class="content-wrapper">
    <HeaderTop :title="navTopTitle">
      <van-icon name="arrow-left" slot="left" @click="backTo"></van-icon> 
      <van-icon name="manager-o" slot="right" @click.native="backTo"></van-icon> 
    </HeaderTop>
    <div class="content-middle">
      <p class="content-middle-top">
        <span class="text-left">{{hospitalName}}</span>
        <span class="text-right"></span>
      </p>
      <div class="content-middle-list">
        <div class="content-middle-list-item" v-for="item in classList">
          <div class="list-item">
            <p class="list-item-left">{{item.wasteName}}</p>
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
      <div class="stage-point">
        <div v-show="stageMsg">
          <!-- <p>{{stagingMsg.number}}</p> -->
          <!-- <p>{{stagingMsg.proId}}</p> -->
          <p>名称: {{stagingMsg.name}}</p>
          <!-- <p>{{stagingMsg.id}}</p> -->
          <p>医院: {{stagingMsg.proName}}</p>
          <!-- <p>{{stagingMsg.type}}</p> -->
          <p>房间号: {{stagingMsg.depName}}</p>
        </div>
      </div>
      <div class="btn-group">
        <van-button type="info" v-show="inStoageBtn" @click="medicalInStoragr" size="normal">医废入库</van-button>
        <van-button type="info" v-show="sureBtnShow" @click="sureInStorage" size="normal">确定</van-button>
      </div>
    </div>
    <FooterBottom></FooterBottom>
  </div>
</template>

<script>
import HeaderTop from '../components/HeaderTop'
import FooterBottom from '../components/FooterBottom'
import { mapGetters } from 'vuex'
import { mapMutations } from 'vuex'
import {queryBatch,judgeSummaryPoint,inStorageAdd} from '../api/rubbishCollect.js'
export default {
   components:{
    HeaderTop,
    FooterBottom
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
      'batchNumber'
    ])
  },

  mounted() {
    if (!this.batchNumber) {
        this.$dialog.alert({
            message: '批次号不能为空'
          }).then(() => {
          });
      } else {
        this.queryAllBatch()
      };
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
    sweepAstoffice () {
      window.android.scanQRcode()
    },
    // 返回上一页
    backTo () {
      this.$router.go(-1);
      this.changeTitleTxt({tit:'医废监测'})
    },
    // 扫码后的回调
    scanQRcodeCallback (code) {
      judgeSummaryPoint(code.type,code.number).then((res) => {
        if (res && res.data.code == 200) {
          this.stageMsg = true;
          this.sureBtnShow = true;
          this.inStoageBtn = false;
          this.stagingMsg = code;
          this.storeId = code.id;
          this.storeNumber = code.number;
          this.storeNumber = code.number;
          this.proId = code.proId;
          this.proName = code.proName;
        } else {
          this.$dialog.alert({
            message: '流程与扫描数据不匹配,请重试'
            }).then(() => {
            this.medicalInStoragr()
          });
        }
      })
      .catch((err)=>{
        this.$dialog.alert({
          message: '流程与扫描数据不匹配,请重试'
          }).then(() => {
          this.medicalInStoragr()
        });
        console.log(err)
      })
    },
    //扫描医废入库暂存点二维码
    medicalInStoragr () {
      this.$dialog.alert({
        message: '入库批次不能为空'
      }).then(() => {
      });
      return;
      this.sweepAstoffice()
    },
    // 查询收集的垃圾批次信息00012019081900022019082200
    queryAllBatch () {
      queryBatch({batchNumber:this.batchNumber,state: 0}).then((res)=>{
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
              message: '当前没有待入库的信息'
            }).then(() => {
            });
          }
        }
      })
      .catch((err)=> {
        console.log(err)
      })
    },
    //确定入库
    sureInStorage () {
      if (!this.batchNumber) {
         this.$dialog.alert({
          message: '入库批次不能为空'
        }).then(() => {
        });
        return;
      };
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
              message: '医废入库成功'
            }).then(() => {
            });
          } else {
            this.$dialog.alert({
              message: '医废入库失败'
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
  .content-wrapper {
    margin-top: 100px;
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
    .content-middle {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      margin-top: 80px;
      background: #fff;
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
        height: 360px;
        overflow: auto;
        .content-middle-list-item {
          padding: 14px;
          height: 110px;
          border-bottom: 1px solid #e8e4e4;
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
        margin-top: 4px;
        height: 80px;
        div {
          height: 100%;
          p {
            line-height: 20px;
            padding-left: 14px;
            font-size: 14px;
            color: #8e9090;
          }
        }
      }
      .btn-group {
        margin-top: 6px;
        text-align: center;
        button {
          background: @color-theme;
          border-color: @color-theme
        }
      }
    }
  }
</style>
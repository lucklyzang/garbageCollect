<template>
  <div class="content-wrapper">
    <HeaderTop :title="navTopTitle">
      <van-icon name="arrow-left" slot="left" @click="backTo"></van-icon> 
      <van-icon name="manager-o" slot="right" @click="skipMyInfo"></van-icon> 
    </HeaderTop>
    <ul class="left-dropDown" v-show="leftDownShow">
      <li v-for="(item, index) in leftDropdownDataList" :class="{liStyle:liIndex == index}" @click="leftLiCLick(index)">{{item}}</li>
    </ul>
    <loading :isShow="showLoadingHint"></loading>
    <p class="content-middle-top">
      <span class="text-left">{{hospitalName}}</span>
      <span class="text-right"></span>
    </p>
    <div class="content-middle">
      <div class="content-middle-list content-middle-list-inStorage">
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
    </div>
    <div class="btn-group">
      <p v-show="inStoageBtn" class="inStoageBtn">
        <van-button type="info" @click="medicalInStoragr" size="normal">医废入库</van-button>
      </p>
      <p v-show="sureBtnShow" class="sureBtnShow">
        <van-button type="info" @click="sureInStorage" size="normal">确定</van-button>
      </p>
    </div>
    <!-- <FooterBottom></FooterBottom> -->
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
    
     <!-- 暂存点信息提示弹框 -->
    <div class="stage-point-wrapper">
        <van-dialog
        v-model="stagePointShow"
        title="暂存点信息"
        :show-cancel-button="false"
        :close-on-popstate="true"
        :close-on-click-overlay="true"
        @confirm=""
      >
        <div class="stage-point">
          <div>
            <p>医院: {{stagingMsg.proName}}</p>
            <p>名称: {{stagingMsg.name}}</p>
          </div>
        </div>
      </van-dialog>
    </div>
  </div>
</template>

<script>
import HeaderTop from '../components/HeaderTop'
import FooterBottom from '../components/FooterBottom'
import Loading from '../components/Loading'
import { mapGetters, mapMutations } from 'vuex'
import {queryBatch,judgeSummaryPoint,inStorageAdd} from '../api/rubbishCollect.js'
import {getDictionaryData} from '@/api/login.js'
import {formatTime, setStore, getStore, removeStore, IsPC, scanCode, Dictionary, judgeDataType} from '@/common/js/utils'
export default {
   components:{
    HeaderTop,
    FooterBottom,
    Loading
  },
  data () {
    return {
      topTitle: '医废收集',
      leftDownShow: false,
      liIndex: null,
      leftDropdownDataList: ['刷新','我的','测试'],
      stagingMsg: '',
      classList: [],
      hospitalName: '',
      sureBtnShow: false,
      barCodeScannerShow: false,
      inStoageBtn: true,
      isPcCallBack: false,
      stagePointShow: false,
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
    if (!IsPC()) {
      let that = this;
      pushHistory()
      that.gotoURL(() => { 
        pushHistory()
        this.$router.push({path: 'home'});  //输入要返回的上一级路由地址
        this.changeTitleTxt({tit: '医废监测'});
        setStore('currentTitle','医废监测');
      })
    };
    this.queryAllBatch();
    // 二维码回调方法绑定到window下面,提供给外部调用
    let me = this;
    window['scanQRcodeCallback'] = (code) => {
      me.scanQRcodeCallback(code);
    };

    // 判断是否执行扫码枪方法
    this.isExecute();
  },

  methods: {
    ...mapMutations([
      'changeTitleTxt', 
    ]),
    
    // 扫描二维码方法
    sweepStage () {
      if (IsPC()) {
        this.isPcCallBack = true;
        if (this.isPcCallBack) {
          this.barCodeScannerShow = true
        }
      } else {
        window.android.scanQRcode()
      }
    },
    // 返回上一页
    backTo () {
      this.$router.push({name:'home'});
      this.changeTitleTxt({tit:'医废监测'});
      setStore('currentTitle','医废监测');
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
        this.$router.push({path: 'testPage'});
        this.changeTitleTxt({tit:'测试页'});
        setStore('currentTitle','测试页')
      }
    },

    // 跳转到我的页面
    skipMyInfo () {
      this.leftDownShow = !this.leftDownShow;
    },

    // 是否执行扫码枪的绑定方法
    isExecute () {
      if (IsPC()) {
        scanCode(this.barcodeScanner)
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
        if (codeData.length == 3) {
          codeJson['number'] = codeData[0];
          codeJson['type'] = codeData[1];
          code = codeJson
        };
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
        if (codeData.length == 3) {
          codeJson['number'] = codeData[0];
          codeJson['type'] = codeData[1];
          code = codeJson
        }
      };
      this.barCodeScannerShow = false;
      if (this.isPcCallBack) {
        this.processMethods(code)
      }
    },

    // 扫码逻辑公共方法
    processMethods (code) {
       if (code && Object.keys(code).length > 0) {
        if (code.type && code.number) {
          judgeSummaryPoint(this.batchNumber,code.number,this.userInfo.id).then((res) => {
            if (res && res.data.code == 200) {
              if ( getStore('hospitalData')
                && Dictionary(JSON.parse(getStore('pointData')),code['number'])
              ) {
                this.stagePointShow = true;
                this.sureBtnShow = true;
                this.inStoageBtn = false;
                this.barCodeScannerShow = false;
                this.isPcCallBack = false;
                code['proName'] = getStore('hospitalData');
                code['name'] = Dictionary(JSON.parse(getStore('pointData')),code['number']);
                this.stagingMsg = code;
                // this.storeId = code.id;
                this.storeNumber = code.number;
                // this.proId = code.proId;
                this.proName = getStore('hospitalData')
              } else {
                this.$dialog.alert({
                  message: '字典中没有匹配的数据或二维码不含有对应的字段',
                  closeOnPopstate: true
                }).then(() => {
                  this.medicalInStoragr()
                })
              }
            } else {
              if (res.data.code == 400) {
                this.$dialog.alert({
                message: `${res.data.msg}`,
                closeOnPopstate: true
                }).then(() => {
                  this.medicalInStoragr()
                })
              } else {
                this.$dialog.alert({
                  message: `${res.data.msg}`,
                  closeOnPopstate: true
                }).then(() => {
                  this.medicalInStoragr()
                })
              }
            };
            this.barCodeScannerShow = false
          })
          .catch((err)=>{
            this.barCodeScannerShow = false;
            this.$dialog.alert({
              message: `${err.message}`,
              closeOnPopstate: true
            }).then(() => {
              this.medicalInStoragr()
            });
          })
        } else {
          this.$dialog.alert({
            message: '当前扫描流程与预期不符,请扫码正确的二维码',
            closeOnPopstate: true
          }).then(() => {
            this.medicalInStoragr();
          })
        };
        this.barCodeScannerShow = false
      } else {
        this.$dialog.alert({
          message: '当前扫描没有收集到任何暂存点信息,请重新扫描',
          closeOnPopstate: true
        }).then(() => {
          this.medicalInStoragr();
        })
      };
      this.barCodeScannerShow = false
    },

    //扫描医废入库暂存点二维码
    medicalInStoragr () {
      // if (!this.batchNumber && !this.userInfo.batchNumber) {
      //   this.$dialog.alert({
      //     message: '批次号不能为空',
      //     closeOnPopstate: true
      //   }).then(() => {
      //   });
      //   return
      // };
      this.sweepStage()
    },
    // 查询收集的垃圾批次信息
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
              this.changeTitleTxt({tit: '医废监测'});
              setStore('currentTitle','医废监测');
            });
          }
        } else {
          this.$dialog.alert({
            message: `${res.data.msg}`,
            closeOnPopstate: true
          }).then(() => {
          });
        }
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
        // storeId: this.storeId, 
        storeNumber: this.storeNumber,
        batchNumber: this.batchNumberLocal,
        inWorkerName: this.inWorkerName,
        // proId: this.proId,  
        proName: this.proName
      };
      inStorageAdd(inStorageMsg).then((res) => {
        if (res) {
          if (res.data.code == 200) {
            this.$dialog.alert({
              message: '医废入库成功',
              closeOnPopstate: true
            }).then(() => {
              this.$router.push({path: 'home'});
              this.changeTitleTxt({tit: '医废监测'});
              setStore('currentTitle','医废监测');
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
    .content-wrapper();
    .left-dropDown {
      .rightDropDown
    }
    .content-middle {
      flex:1;
      overflow: auto;
      .content-middle-list {
        height: 100%;
        .content-middle-list-item {
          position: relative;
          box-sizing: border-box;
          padding: 20px 10px;
          height: auto;
          margin: 0 auto;
          height: 180px;
          background: #fff;
          margin-bottom: 20px;
          border-radius: 8px;
          box-shadow: 0 2.5px 12px 4px #d1d1d1;
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
                text-align: left;
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
    .content-middle-top {
      background: #6be7d8;
      height: 26px;
      position: relative;
      color: #fff;
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
    .btn-group {
      padding: 4px 0;
      text-align: center;
      button {
        background: @color-theme;
        border-color: @color-theme;
        letter-spacing: 2px;
        text-indent: 2px
      }
      .inStoageBtn {
        button {
          padding: 0 120px;
        }
      }
      .sureBtnShow {
        button {
          padding: 0 140px;
        }
      }
    }
    .stage-point {
      width: 100%;
      margin-top: 10px;
        > div {
        height: auto;
        margin: 0 auto;
        width: 90%;
        background: #fff;
        padding: 8px;
        box-shadow: 0 2.5px 12px 4px #d1d1d1;
        border-radius: 8px;
          p {
            line-height: 30px;
            text-align: left;
            font-size: 14px;
            color: #646464;
            height: auto;
            word-break: break-all
          }
        }
      }
      .stage-point-wrapper {
        /deep/ .van-dialog {
          .van-dialog__content {
          }
        }
      }
  }
</style>
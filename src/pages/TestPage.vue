<template>
  <div class="content-wrapper">
    <HeaderTop :title="navTopTitle">
      <van-icon name="arrow-left" slot="left" @click="backTo"></van-icon> 
    </HeaderTop>
    <div class="content-middle">
        <van-cell-group>
          <van-field
            v-model="checkWaringMsg"
            label="重量(kg)"
            placeholder=""
            autosize
            disabled
          />
        </van-cell-group>
        <van-cell-group>
          <van-field
            v-model="sweepCodeMsg"
            label="扫码信息"
            placeholder=""
            type="textarea"
            autosize
            disabled
          />
        </van-cell-group>
      </div>
      <div class="content-footer">
          <span class="showBackoutButton">
            <van-button type="info" @click="getWeight"  size="normal">获取重量</van-button>
          </span>
          <span class="showCollectButton">
            <van-button type="info" @click="print" size="normal">打印</van-button>
          </span>
          <span class="showCollectButton">
            <van-button type="info" @click="sweepCodeBtn" size="normal">扫码</van-button>
          </span>
      </div>
        <!-- 打印内容 -->
      <section class="bills-data" v-if="pcPrintShow" ref="printCode"
        style="position:fixed;
        top:0;
        left:0;
        width:100%;
        height:85vh;
        overflow: auto;
        background: #fff;
        z-index:1000"
      >
        <div>
          <!-- 第一联 -->
          <div
            style="height:240px;
            width:100%;
            border-bottom:1px dashed #333;
            background:transparent;
            padding-top:40px;"
          >
            <p style="text-align:center;margin-bottom:20px;font-size:18px">医废回收小票</p>
            <p style="padding-left:5px;font-size:14px;width:100%;min-height:24px;word-wrap: break-word">科室:产科门诊</p>
            <p style="padding-left:5px;font-size:14px;width:100%;min-height:24px;word-wrap: break-word">垃圾类型: 病理性</p>
            <p style="padding-left:5px;font-size:14px;width:100%;min-height:24px;word-wrap: break-word">垃圾重量: 4.6kg</p>
            <p style="padding-left:5px;font-size:14px;width:100%;min-height:24px;word-wrap: break-word">收集人: 曹操</p>
            <p style="padding-left:5px;font-size:14px;width:100%;min-height:24px;word-wrap: break-word">交接人: 刘备</p>
            <p style="padding-left:5px;font-size:14px;width:100%;min-height:24px;word-wrap: break-word">时间: 2019-5-50 12:23:56</p>
          </div>
          <!-- 第二联 -->
          <div class="div-wrapper"
            style="height:240px;
            width:100%;
            border-bottom:1px dashed #333;
            background:transparent;
            padding-top:40px;"
          >
            <p style="text-align:center;margin-bottom:20px;font-size:18px">医废回收小票</p>
            <p style="padding-left:5px;font-size:14px;width:100%;min-height:24px;word-wrap: break-word">科室: 产科门诊</p>
            <p style="padding-left:5px;font-size:14px;width:100%;min-height:24px;word-wrap: break-word">垃圾类型: 病理性</p>
            <p style="padding-left:5px;font-size:14px;width:100%;min-height:24px;word-wrap: break-word">垃圾重量: 4.6kg</p>
            <p style="padding-left:5px;font-size:14px;width:100%;min-height:24px;word-wrap: break-word">收集人:  曹操</p>
            <p style="padding-left:5px;font-size:14px;width:100%;min-height:24px;word-wrap: break-word">交接人: 刘备</p>
            <p style="padding-left:5px;font-size:14px;width:100%;min-height:24px;word-wrap: break-word">时间: 2019-5-50 12:23:56</p>
          </div>
        </div>
      </section>
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
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import HeaderTop from '../components/HeaderTop'
import Print from '@/plugs/print'
import Vue from 'vue'
import { setStore, IsPC, removeStore, scanCode, dealMedicalWaste} from '@/common/js/utils'
Vue.use(Print)
export default {
  data () {
    return {
      checkWaringMsg: '',
      pcPrintShow: false,
      sweepCodeMsg: null,
      choosePrintType: false,
      isRegister: false,
      printCount: 0
    };
  },

  components: {
    HeaderTop
  },

  computed: {
    ...mapGetters([
      'navTopTitle',
      'userInfo'
    ]),
  },

  mounted () {
    // 二维码回调方法绑定到window下面,提供给外部调用
    let me = this;
    window['scanQRcodeCallback'] = (code) => {
      me.scanQRcodeCallback(code);
    };
    // 控制设备物理返回按键
    if (!IsPC()) {
      let that = this;
      pushHistory()
      that.gotoURL(() => { 
        pushHistory()
        this.$router.push({name:'home'});
        this.changeTitleTxt({tit:'医废监测'});
        setStore('currentTitle','医废监测')
      })
    };
    this.isExecute();
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
      this.checkWaringMsg = data.replace('kg', '')
    }
  },

  methods: {
     ...mapMutations([
      'changeTitleTxt'
    ]),
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
      this.$router.push({name:'home'});
      this.changeTitleTxt({tit:'医废监测'});
      setStore('currentTitle','医废监测')
    },
    // 获取重量
    getWeight () {
      if (IsPC()) {
        this.$socket.emit('weight', 'getweight')
      }
    },
    // 摄像头扫码后的回调
    scanQRcodeCallback(code) {
      this.sweepCodeMsg = JSON.stringify(code)
    },
    // 扫码
    sweepCodeBtn () {
      if (!IsPC()) {
        window.android.scanQRcode()
      }
    },
    // 是否执行扫码枪的绑定方法
    isExecute () {
      if (IsPC()) {
        this.sweepCodeMsg = '';
        scanCode(this.barcodeScanner)
      }
    },
    // 扫码枪信息回调
    barcodeScanner (code) {
      this.sweepCodeMsg = code
    },
    // 常规打印
    conventionPrint () {
      if (IsPC()) {
        this.isRegister = true;
        this.pcPrintShow = true;
        this.$print(this.$refs.printCode);
        this.pcPrintShow = false
      }
    },
    // 不干胶打印
    gluePrint () {
      this.isRegister = false;
      this.pcPrintShow = false;
      this.$socket.emit('print', {times: 2, data: 
        [
          [
            '科室:手术一科',
            '医废编号:1232243545454554',
            '垃圾类型:病理性',
            '垃圾重量:3.8kg',
            '收集人:张三',
            '交接人:李四',
            '时间:2019-12-39 :19:25:49'
          ]
        ]
      });
      this.printCount = 0
    },
    // 打印凭条
    print () {
      this.printCount++;
      if (this.printCount == 1) {
        if (this.isRegister) {
          this.choosePrintType = true;
          return
        } else {
          this.choosePrintType = true
        }
      } else {
        if (!this.isRegister) {
          this.choosePrintType = true
        }
      };
      if (IsPC()) { 
        if (this.pcPrintShow) {
          this.pcPrintShow = true;
          this.$print(this.$refs.printCode);
          this.pcPrintShow = false;
          this.printCount = 0;
        }
      }
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
     /deep/ .van-dialog {
      .van-dialog__content{
        margin-top: 10px !important
      }
    };
    .content-middle {
      flex:1;
      overflow: auto;
      /deep/ .van-tabs--line {
        margin-top: 4px;
        .van-tabs__line {
          background-color: @color-theme;
        }
      }
      /deep/ .van-tabs {
        .right-sign {
         .repeat-sign
        }
      }
      .changeBtn {
        height: 40px;
        background: #fbfbfb;
        line-height: 40px;
        padding-left: 10px;
        /deep/ .van-icon {
          background: @color-theme;
          border-color: @color-theme
        }
      }
      .content-middle-list {
       .content-middle-list-item {
          position: relative;
          box-sizing: border-box;
          padding: 20px 10px;
          height: auto;
          margin: 0 auto;
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
              top: 18px;
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
        .await-check {
          height: 176px
        }
        .await-conduct {
          height: 110px
        }
        .finished {
          height: 176px
        }
        .all-type {
          height: 110px
        }
      }
      .btn-group {
        margin-top: 8px;
        text-align: center;
        p {
          button {
            background: @color-theme;
            border-color: @color-theme;
            padding: 0 120px;
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
          width: 90px;
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
      }
   
  }
</style>
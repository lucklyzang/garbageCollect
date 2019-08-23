<template>
  <div class="content-wrapper">
    <HeaderTop :title="navTopTitle">
      <van-icon name="arrow-left" slot="left" @click="backTo"></van-icon> 
      <van-icon name="manager-o" slot="right" @click.native="backTo"></van-icon> 
    </HeaderTop>
    <div class="content-middle">
      <p class="content-middle-top">
        <span class="text-left">甘肃省人民医院</span>
        <span class="text-right">2019-08-01---2019-08-16</span>
      </p>
      <div class="content-middle-list">
        <div class="content-middle-list-item" v-for="item in classList">
          <div class="list-item">
            <p class="list-item-left">{{item.type}}</p>
            <p class="list-item-right">
              重量: <span>{{item.weight}}kg</span>
            </p>
            <div class="list-strip">
              <p class="list-sign">条码标识: {{item.sign}}</p>
              <p class="list-times">回收趟次: {{item.times}}</p>
              <p class="list-code">小车编码: {{item.code}}</p>
              <p class="list-code">时间: {{item.collectTime}}</p>
            </div>
            <div class="list-item-bottom">
              移交人员: <span>{{item.peopleName}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="stage-point">{{stagingMsg}}</div>
      <div class="btn-group">
        <van-button type="info" @click="medicalInStoragr" size="small">医废入库</van-button>
        <van-button type="info" @click="sureInStorage" size="small">确定</van-button>
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
export default {
   components:{
    HeaderTop,
    FooterBottom
  },
  data () {
    return {
      topTitle: '医废收集',
      stagingMsg: '',
      classList: [
        {type: '血液透析/感染性', weight: '3.04', collectTime: '2019-8-23 16:38:47', sign: '0912121212',times: '12121212121212', code: '1212121', peopleName: '王克荛'},
        {type: '血液透析/感染性', weight: '3.04', collectTime: '2019-8-23 16:38:47', sign: '0912121212',times: '12121212121212', code: '1212121', peopleName: '王克荛'}
      ]
    };
  },
  computed: {
    ...mapGetters([
      'navTopTitle',
    ])
  },

  mounted() {
    // 二维码回调方法绑定到window下面,提供给外部调用
    let me = this;
    window['scanQRcodeCallback'] = (code) => {
      me.scanQRcodeCallback(code);
    }
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
      this.stagingMsg = code
    },
    //扫描医废入库暂存点二维码
    medicalInStoragr () {
      this.sweepAstoffice()
    },
    //确定入库
    sureInStorage () {}
  }
}

</script>
<style lang='less' scoped>
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
        height: 300px;
        overflow: auto;
        .content-middle-list-item {
          padding: 14px;
          height: 140px;
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
              bottom: 2px;
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
        margin-top: 10px;
        height: 140px;
        border: 1px solid #85f0f0
      }
      .btn-group {
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
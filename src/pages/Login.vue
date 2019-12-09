<template>
  <div id="LoginBox">
    <loading :isShow="showLoadingHint" textContent="登录中,请稍候····" textColor="rgb(29, 102, 113)"></loading>
    <div class="bg-box">
      <img :src="LoginBg" alt="">
    </div>
    <div class="bg-icon-wrapper" ref="bgIconWrapper">
      <div class="bg-icon">
        <img :src="BgIcon" alt="">
      </div>
    </div>
    <div class="input-box" v-show="showAccountLogin" ref="inputBox">
      <van-cell-group>
        <van-field label="用户名" placeholder="请输入用户名" type="text" v-model="username"></van-field>
        <van-field label="密码" placeholder="请输入密码" type="password" v-model="password"></van-field>
      </van-cell-group>
      <van-cell-group>
        <van-button  @click.native="login">登录</van-button>
      </van-cell-group>
    </div>
    <div class="sweep-code" v-show="showSweepLogin">
      <van-cell-group>
        <van-button @click="sweepPersonCode">扫描个人二维码</van-button>
      </van-cell-group>
    </div>
    <div class="check-box" ref="checkBox">
      <div class="check-box-content">
        <p v-for="(item, index) in checkList" @click="checkClick(item,index)" :class="{activeClass:index == currentIndex}">
          {{item}}
        </p>
      </div>
    </div>
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
  </div>
</template>

<script>
import {logIn, getDictionaryData} from '@/api/login.js'
import { mapGetters, mapMutations } from 'vuex'
import BgIcon from '@/components/images/bg-icon.png'
import LoginBg from '@/components/images/login-bg.png'
import Loading from '../components/Loading'
import { setStore, getStore, IsPC, scanCode } from '@/common/js/utils'
export default {
  components: {
    Loading
  },
  data () {
    return {
      username: this.loginName,
      password: this.loginPassword,
      BgIcon: BgIcon,
      LoginBg: LoginBg,
      showAccountLogin: true,
      isPcCallBack: false,
      showSweepLogin: false,
      showLoadingHint: false,
      sweepMsg: null,
      currentIndex: 0,
      barCodeScannerShow: false,
      checkList: ['账号密码登录','扫码登录']
    };
  },

  watch: {
    currentIndex (newValue, olValue) {
      newValue == 0 ? this.showAccountLogin = true : this.showAccountLogin = false;
      newValue == 1 ? this.showSweepLogin = true : this.showSweepLogin = false
    }
  },

  computed: {
    loginName () {
      return getStore('userName')
    },
    loginPassword () {
      return getStore('password')
    },
    ...mapGetters([
      'loginSweepCode'
    ])
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
        pushHistory();
        this.$router.push({path: '/'});  //输入要返回的上一级路由地址
      });
      this.changeRouterFlag(false)
    };

    // 监控键盘弹起
    let originalHeight = document.documentElement.clientHeight || document.body.clientHeight;
    window.onresize = ()=>{
      let resizeHeight = document.documentElement.clientHeight || document.body.clientHeight;
      if (resizeHeight < originalHeight) {
        return (()=>{
          this.$refs['checkBox'].style.cssText='top:95%';
          this.$refs['inputBox'].style.cssText='top:32%';
          this.$refs['bgIconWrapper'].style.cssText='top:10px' 
        })()
      } else {
        this.$refs['checkBox'].style.cssText='top:69%';
        this.$refs['inputBox'].style.cssText='top:35%';
        this.$refs['bgIconWrapper'].style.cssText='top:10%' 
      }
    };

    // 判断是否执行扫码枪方法
    this.isExecute();
  },

  methods: {
    ...mapMutations([
      'storeUserInfo',
      'changeTitleTxt',
      'changeRouterFlag',
      'changeLoginMethod'
    ]),

    // 登录方式切换点击事件
    checkClick (item, index) {
      this.currentIndex = index;
      if (index == 0) {
        this.isPcCallBack = false
      }
    },

    // 是否执行扫码枪的绑定方法
    isExecute () {
      if (IsPC()) {
        scanCode(this.barcodeScanner)
      }
    },

    // 扫描二维码方法
    sweepPersonCode () {
      if (IsPC()) {
        this.isPcCallBack = true;
        if (this.isPcCallBack) {
          this.barCodeScannerShow = true;
        }
      } else {
        window.android.scanQRcode()
      }
    },

    // 摄像头扫码后的回调
    scanQRcodeCallback(code) {
      var code = decodeURIComponent(JSON.stringify(code));
      this.processMethods(JSON.parse(code))
    },

    //扫码枪扫码回调方法
    barcodeScanner (code) {
      var code = JSON.parse(code);
      this.barCodeScannerShow = false;
      if (this.isPcCallBack) {
        this.processMethods (code)
      }
    },

    // 扫码流程公共方法
    processMethods (code) {
      if(code && Object.keys(code).length > 0) {
        if (code.hasOwnProperty('msg')) {
          if (code.msg) {
            this.sweepMsg = code.msg;
            this.login()
          } else {
            this.$dialog.alert({
            message: '个人信息不能为空,请重新扫描',
            closeOnPopstate: true
            }).then(() => {
              this.sweepPersonCode() 
            })
          };
          this.barCodeScannerShow = false
        } else {
          this.$dialog.alert({
          message: '请扫描正确的二维码',
          closeOnPopstate: true
          }).then(() => {
            this.sweepPersonCode() 
          })
        };
        this.barCodeScannerShow = false
      } else {
        this.$dialog.alert({
          message: '没有扫描到任何个人信息,请重新扫描',
          closeOnPopstate: true
        }).then(() => {
          this.sweepPersonCode() 
        })
      }
      this.barCodeScannerShow = false
    },

    // 账号密码登录方法
    login () {
      let loginMessage;
      this.showLoadingHint = true;
      if (this.showAccountLogin) {
        loginMessage = {
          username: this.username,
          password: this.password
        }
      } else {
        loginMessage = {
          username: this.sweepMsg,
          flag: 1,
        }
      };
      logIn(loginMessage).then((res)=>{
        if (res) {
          if (res.data.code == 200) {
            if (res.data.data.batchNumber) {
              setStore('currentBatchNumber',res.data.data.batchNumber)
            } else {
              setStore('currentBatchNumber','')
            };
            if (this.showAccountLogin) {
              setStore('loginSweepCode',false);
              if (getStore('loginSweepCode') == 'false') {
                setStore('userName', this.username);
                setStore('userPassword', this.password);
              }
            } else {
              setStore('loginSweepCode',true);
              if (getStore('loginSweepCode') == 'true') {
                setStore('userName', this.sweepMsg)
              }
            };
            // 请求科室字典数据
            getDictionaryData(res.data.data['proId']).then((res) => {
              if (res && res.data.code == 200) {
                // 存入医院数据
                setStore('hospitalData', res.data.data['hospital']);
                // 存入医护数据
                setStore('careData', res.data.data['cares']);
                // 存入科室数据
                setStore('departmentData', res.data.data['departments'])
                // 存入暂存点数据
                setStore('pointData', res.data.data['points'])
                // 存入医废类型数据
                setStore('wasteTypeData', res.data.data['wasteType']);
                location.reload()
              }
            });
            // 登录用户名密码及用户信息存入Locastorage
            setStore('userInfo', res.data.data);
            setStore('isLogin', true);
            this.changeRouterFlag(true);
            this.storeUserInfo(JSON.parse(getStore('userInfo')));
            this.$router.push({path:'/home'});
            this.changeTitleTxt({tit:'医废监测'});
            this.isPcCallBack = false
          } else {
             this.$dialog.alert({
              message: `${res.data.msg}`,
              closeOnPopstate: true
            }).then(() => {
            });
          }
        };
        this.showLoadingHint = false
      })
      .catch((err) => {
        this.showLoadingHint = false;
        this.$dialog.alert({
          message: `${err.message}`,
          closeOnPopstate: true
        }).then(() => {
        })
      })
    }
  } 
}
</script>
<style lang="less" scoped>
  #LoginBox {
    position: fixed;
    width: 100%;
    height: 100%;
    .activeClass {
      color: #fff !important
    }
    .bg-box {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      img {
        width: 100%;
        height: 100%
      }
    }
    .input-box {
      width: 100%;
      position: absolute;
      top: 35%
    }
    .sweep-code {
      width: 100%;
      position: absolute;
      top: 40%
    }
    .check-box {
      width: 100%;
      position: absolute;
      .check-box-content {
        margin: 0 auto;
        height: 20px;
        p {
          color: #434646;
          letter-spacing: 1px;
          font-size: 12px;
          &:first-child {
            float: left
          }
          &:last-child {
            float: right
          }
        }
        
      }
    }
    .bg-icon-wrapper {
      width: 100%;
      position: absolute;
      text-align: center;
      top: 10%;
      left: 0;
      .bg-icon {
        width: 100px;
        display: inline-block;
        img {
          width: 100%;
          height: 100%
        }
      }
    }
    .van-hairline--top-bottom::after {
      display: none
    }
    .van-cell-group {
      width: 90%;
      margin: 0 auto;
      margin-top: 30px;
      font-size: 14px;
      background: none;
      /deep/ .van-field {
        margin-top: 10px;
        color: #fff;
        &:not(:last-child):after {
          display: none
        }
        .van-cell_title {
          font-size: 12px;
        }
        input {
          font-size: 12px;
          color: #fff
        }
      }
      /deep/ .van-field:last-child {
        margin-top: 30px
      }
      /deep/ .van-cell {
        box-shadow: 0 1px 8px 1px #27b092;
        background: #33dfb9;
        border-radius: 6px;
        ::-webkit-input-placeholder {
          color: #fff;
        }
        :-moz-placeholder {/* Firefox 18- */
          color: #fff;
        }
        ::-moz-placeholder{/* Firefox 19+ */
        color: #fff;
        }
        :-ms-input-placeholder {
          color: #fff;
        }
        .van-field__label {
          font-size: 12px;
          color: #fff;
          padding-left: 6px;
          font-weight: bold;
        }
        /deep/ .van-field__left-icon {
          i {
            font-size: 20px;
            color: #fff
          }
        }
      }
    }
    .van-cell-group {
      margin: 0 auto;
      /deep/ .van-button {
        width: 100%;
        box-shadow: 0 1px 8px 1px #27b092;
        margin-top: 35px;
        background: #fff;
        color: black;
        border-radius: 0;
        font-size: 12px;
        border-radius: 30px;
        height: 46px;
        border: none;
        line-height: 35px;
        font-weight: bold
      }
    }
    .bottom-title {
      width: 100%;
      position: absolute;
      bottom: 20px;
      text-align: center;
      font-size: 12px;
      color: #fff
    }
    .loading-hint {
      /deep/.van-loading {
        top: 90%;
        .van-loading__text {
          color: #198c87
        }
      } 
    }
  }
</style>
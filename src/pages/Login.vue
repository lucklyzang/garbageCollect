<template>
  <div id="LoginBox">
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
        <van-field left-icon="manager" label="用户名" placeholder="请输入用户名" type="text" v-model="username"></van-field>
        <van-field left-icon="lock" label="密码" placeholder="请输入密码" type="password" v-model="password"></van-field>
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
  </div>
</template>

<script>
import {logIn} from '@/api/login.js'
import { mapGetters, mapMutations } from 'vuex'
import BgIcon from '@/components/images/bg-icon.png'
import LoginBg from '@/components/images/login-bg.png'
import { setStore, getStore } from '@/common/js/utils'
export default {
  data () {
    return {
      username: this.loginName,
      password: this.loginPassword,
      BgIcon: BgIcon,
      LoginBg: LoginBg,
      showAccountLogin: true,
      showSweepLogin: false,
      sweepMsg: null,
      currentIndex: 0,
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
    let that = this;
    pushHistory()
    that.gotoURL(() => { 
      pushHistory()
        this.$router.push({path: '/'});  //输入要返回的上一级路由地址
    });
    this.changeRouterFlag(false);

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
      this.currentIndex = index
    },

    // 扫描二维码方法
    sweepPersonCode () {
      window.android.scanQRcode()
    },
    
    // 扫码后的回调
    scanQRcodeCallback(code) {
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
          }
        } else {
          this.$dialog.alert({
          message: '请扫描正确的二维码',
          closeOnPopstate: true
          }).then(() => {
            this.sweepPersonCode() 
          })
        }
      } else {
        this.$dialog.alert({
          message: '没有扫描到任何个人信息,请重新扫描',
          closeOnPopstate: true
        }).then(() => {
          this.sweepPersonCode() 
        })
      }
    },

    // 账号密码登录方法
    login () {
      let loginMessage;
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
            // 登录用户名密码及用户信息存入Locastorage
            setStore('userInfo', res.data.data);
            setStore('isLogin', true);
            this.changeRouterFlag(true);
            this.storeUserInfo(JSON.parse(getStore('userInfo')));
            this.$router.push({path:'/home'});
            this.changeTitleTxt({tit:'医废监测'});
          } else {
             this.$dialog.alert({
              message: `${res.data.msg}`,
              closeOnPopstate: true
            }).then(() => {
            });
          }
        }
      })
      .catch((err) => {
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
      top: 69%;
      .check-box-content {
        width: 86%;
        margin: 0 auto;
        height: 20px;
        p {
          color:#87dfee;
          letter-spacing: 1px;
          font-size: 12px;  /* px */
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
        margin-top: 20px
      }
      /deep/ .van-cell {
        border: 2px solid #87dfee;
        background: transparent;
        border-radius: 60px;
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
          padding-left: 6px
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
      width: 90%;
      margin: 0 auto;
      /deep/ .van-button {
        width: 100%;
        margin-top: 35px;
        background: #fff;
        color: black;
        border-radius: 0;
        font-size: 12px;
        border-radius: 30px;
        height: 46px;
        border: none;
        line-height: 35px;
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
  }
</style>
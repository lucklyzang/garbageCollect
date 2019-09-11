<template>
  <div id="LoginBox">
    <div class="bg-box">
      <img :src="LoginBg" alt="">
    </div>
    <div class="bg-icon">
      <img :src="BgIcon" alt="">
    </div>
    <div class="inputBox">
      <van-cell-group>
        <van-field left-icon="manager" label="用户名" placeholder="请输入用户名" type="text" v-model="username"></van-field>
        <van-field left-icon="lock" label="密码" placeholder="请输入密码" type="password" v-model="password"></van-field>
      </van-cell-group>
      <van-cell-group>
        <van-button  @click.native="login">登录</van-button>
      </van-cell-group>
    </div>
  </div>
</template>

<script>
import {logIn} from '@/api/login.js'
import {setStore, getStore} from '@/common/js/utils.js'
import { mapGetters, mapMutations } from 'vuex'
import BgIcon from '@/components/images/bg-icon.png'
import LoginBg from '@/components/images/login-bg.png'
import { pushHistory } from '@/common/js/utils'
export default {
  data () {
    return {
      username: this.loginName,
      password: this.loginPassword,
      BgIcon: BgIcon,
      LoginBg: LoginBg
    };
  },
  watch: {
  },
  components: {},

  computed: {
    loginName () {
      return getStore('userName')
    },
    loginPassword () {
      return getStore('password')
    }
  },

  mounted () {
    pushHistory();
    window.onpopstate = () => {
      this.$router.push({path: '/'});  //输入要返回的上一级路由地址
    };
    this.changeRouterFlag(false)
  },

  methods: {
    ...mapMutations([
      'storeUserInfo',
      'changeTitleTxt',
      'changeRouterFlag'
    ]),
    // 账号密码登录方法
    login () {
      let loginMessage = {
        username: this.username,
        password: this.password
      };
      logIn(loginMessage).then((res)=>{
        if (res) {
          if (res.data.code == 200) {
            // 登录用户名密码及用户信息存入Locastorage
            setStore('userName', this.username);
            setStore('userPassword', this.password);
            setStore('userInfo', res.data.data);
            setStore('isLogin', true);
            this.changeRouterFlag(true);
            this.storeUserInfo(JSON.parse(getStore('userInfo')));
            this.$router.push({path:'/home'});
            this.changeTitleTxt({tit:'医废监测'})
          } else {
             this.$dialog.alert({
              message: `${res.data.msg}`
            }).then(() => {
            });
          }
        }
      })
      .catch((err) => {
        this.$dialog.alert({
          message: `${err.message}`
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
    .inputBox {
      width: 100%;
      position: absolute;
      top: 35%
    }
    .bg-icon {
      position: absolute;
      top: 10%;
      left: 38%;
      width: 100px;
      img {
        width: 100%;
        height: 100%
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
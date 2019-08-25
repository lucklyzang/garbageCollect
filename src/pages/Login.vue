<template>
  <div id="LoginBox">
    <p class="logo">
      <img :src="loginBanner" alt="">
    </p>
    <van-cell-group>
      <van-field label="用户名" placeholder="请输入用户名" type="text" v-model="username"></van-field>
      <van-field label="密码" placeholder="请输入密码" type="password" v-model="password"></van-field>
   </van-cell-group>
    <van-cell-group>
      <van-button  @click.native="login">登录</van-button>
    </van-cell-group>
    <p class="bottom-title">共众智能@Copyright 2017-2018</p>
  </div>
</template>

<script>
import {logIn} from '../api/login.js'
import { mapGetters } from 'vuex'
import { mapMutations } from 'vuex'
import loginBg from '@/components/images/login-bg.png'
export default {
  data () {
    return {
      username:'',
      password: '',
      loginBanner: loginBg
    };
  },
  watch: {
    
  },
  components: {},

  computed: {},

  mounted () {},

  methods: {
    ...mapMutations([
      'storeUserInfo'
    ]),
    // 账号密码登录方法
    login () {
      let loginMessage = {
        workerNumber: this.username,
        password: this.password
      };
      logIn(loginMessage).then((res)=>{
        if (res) {
          if (res.data.code == 200) {
            this.$router.push({path:'/home'});
            this.storeUserInfo(res.data.data);
          } else {
             this.$dialog.alert({
              message: `${res.data.msg}`
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
<style lang="less" scoped>
  #LoginBox {
    position: fixed;
    width: 100%;
    height: 100%;
    background: #fff;
    .logo {
      text-align: center;
      width: 100%;
      margin-bottom: 40px;
      height: 220px;
      line-height: 200px;
      font-size: 28px;
      color:#aad5ba;
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
        color: #6d6d6d;
        .van-cell_title {
          font-size: 12px;
        }
        // .van-cell_value {
        //   .van-field__body {
            input {
              margin-top: -4px;
              font-size: 12px
          //   }
          // }
        }
      }
      /deep/ .van-cell {
        border-bottom: 1px solid #dddcdc;
        height: 35px;
        vertical-align: middle;
        padding-left: 0;
        .van-field__label {
          font-size: 12px;
          margin-top: -4px;
          color: #5b5b5b
        }
      }
    }
    .van-cell-group {
      width: 90%;
      margin: 0 auto;
      /deep/ .van-button {
        width: 100%;
        margin-top: 35px;
        background: #1dc5a4;
        color: #fff;
        border-radius: 0;
        font-size: 12px;
        border-radius: 30px;
        height: 35px;
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
      color: #adadad
    }
  }
</style>
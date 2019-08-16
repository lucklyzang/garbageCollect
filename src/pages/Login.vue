<template>
  <div id="LoginBox">
    <p class="logo">智慧卫监</p>
    <van-cell-group>
      <van-field label="用户名" placeholder="请输入用户名" type="text" v-model="username"></van-field>
      <van-field label="密码" placeholder="请输入密码" type="password" v-model="password"></van-field>
   </van-cell-group>
    <van-cell-group>
      <van-button  @click.native="login">登录</van-button>
      <van-button >扫码登录</van-button>
    </van-cell-group>
  </div>
</template>

<script>
export default {
  data () {
    return {
      username:'',
      password: ''
    };
  },
  watch: {
    
  },
  components: {},

  computed: {},

  mounted () {},

  methods: {
    // 账号密码登录方法
    login () {
      this.$router.push({path:'/home'})
    }
  } 
}
</script>
<style lang="less" scoped>
  #LoginBox {
    position: fixed;
    width: 100%;
    height: 100%;
    background: linear-gradient(#9cd6fa,#229ae6);
    .logo {
      text-align: center;
      margin-top: 80px;
      font-size: 28px;
      color:#fff
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
        background: #eaeaea;
        color: #7e8c8d;
        border-radius: 30px;
        .van-cell_title {
          font-size: 12px;
          .van-cell_value {
            input {
              background: #eaeaea;
            }
          }
        }
      }
      /deep/ .van-cell {
        min-height: 35px
      }
    }
    .van-cell-group {
      width: 90%;
      margin: 0 auto;
      margin-top: 40px;
      /deep/ .van-button {
        width: 100%;
        background: #ed834e;
        color: #fff;
        border-radius: 0;
        margin-top: 10px;
        font-size: 12px;
        border-radius: 30px;
        min-height: 35px;
        border: none
      }
    }
  }
</style>
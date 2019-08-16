<template>
  <div id="LoginBox">
    <p class="logo">Login</p>
    <p class="form-group">
      <mt-field label="用户名" placeholder="请输入用户名" v-model="username"></mt-field>
      <mt-field label="密码" placeholder="请输入密码" type="password" v-model="password"></mt-field>
    </p>
    <p class="btn-group">
      <mt-button type="primary" @click.native="login">登录</mt-button>
      <mt-button type="primary">扫码登录</mt-button>
    </p>
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
    .form-group {
      margin-top: 120px;
      /deep/ .mint-field {
        margin-top: 10px
      }
    }
    .btn-group {
      margin-top: 10px;
      /deep/ .mint-button {
        width: 100%;
        height: 46px;
        background: #ffff;
        color: black;
        border-radius: 0;
        margin-top: 10px
      }
    }
  }
</style>
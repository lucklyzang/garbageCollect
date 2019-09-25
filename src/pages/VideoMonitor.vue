<template>
  <div class="content-wrapper">
    <HeaderTop :title="navTopTitle">
      <van-icon name="arrow-left" slot="left" @click="backTo"></van-icon>
      <van-icon name="manager-o" slot="right" @click="skipMyInfo"></van-icon>  
    </HeaderTop>
    <div class="content-middle">
      <div class="content-middle-top">
        
      </div>
    </div>
    <!-- <FooterBottom></FooterBottom> -->
  </div>
</template>

<script>
import HeaderTop from '../components/HeaderTop'
import FooterBottom from '../components/FooterBottom'
import { mapGetters, mapMutations } from 'vuex'
export default {
  components: {
    HeaderTop,
    FooterBottom
  },
  data () {
    return {
    };
  },
  computed: {
    ...mapGetters([
      'navTopTitle',
      'userInfo',
    ]),
    getUserInfo () {
      return this.userInfo.proId
    }
  },

  mounted () {
    // 控制设备物理返回按键
    let that = this;
    pushHistory()
    that.gotoURL(() => { 
      pushHistory()
      this.$router.push({path: 'home'});  //输入要返回的上一级路由地址
      this.changeTitleTxt({tit: '医废监测'})
    });
  },

  methods: {
    ...mapMutations([
      'changeTitleTxt'
    ]),
    // 返回上一页
    backTo () {
      this.$router.push({path: 'home'});
      this.changeTitleTxt({tit: '医废监测'});
    },
    // 跳转到我的页面
    skipMyInfo () {
      this.$router.push({path: 'myInfo'});
      this.changeTitleTxt({tit:'我的'})
    }
  }
}

</script>
<style lang='less' scoped>
  @import "../common/stylus/variable.less";
  @import "../common/stylus/modifyUi.less";
  .content-wrapper {
    .content-middle {
      .content-middle();
    }
  }
</style>
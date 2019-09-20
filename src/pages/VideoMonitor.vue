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
import { pushHistory } from '@/common/js/utils'
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
  .content-wrapper {
    margin-top: 100px;
      /deep/ .van-icon-manager-o {
        position: absolute;
        top: 22px;
        right: 6px;
        font-size: 18px;
        color: #fff;
      }
       /deep/ .van-icon-arrow-left {
        position: absolute;
        top: 22px;
        left: 4px;
        font-size: 20px;
        color: #fff
      }
    .content-middle {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      .content-middle-top {
        margin-top: 60px;
        height: 100px;
        overflow: auto;
        padding: 16px;
      }
    }
  }
</style>
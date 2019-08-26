<template>
  <div class="content-wrapper">
    <HeaderTop :title="navTopTitle">
      <van-icon name="arrow-left" slot="left" @click="backTo"></van-icon> 
      <van-icon name="manager-o" slot="right" @click.native="backTo"></van-icon> 
    </HeaderTop>
    <div class="content-middle"></div>
    <FooterBottom></FooterBottom>
  </div>
</template>

<script>
import HeaderTop from '../components/HeaderTop'
import FooterBottom from '../components/FooterBottom'
import { mapGetters } from 'vuex'
import { mapMutations } from 'vuex'
// import {queryBatch,judgeSummaryPoint,inStorageAdd} from '../api/rubbishCollect.js'
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
      'navTopTitle'
    ])
  },

  mounted () {},

  methods: {
    // 返回上一页
    backTo () {
      this.$router.go(-1);
      this.changeTitleTxt({tit:'医废监测'})
    },
  }
}

</script>
<style lang='less' scoped>
  @import "../common/stylus/variable.less";
  .content-wrapper {
    margin-top: 100px;
      /deep/ .van-icon-manager-o {
        position: absolute;
        top: 44px;
        right: 6px;
        font-size: 18px;
        color: #fff;
      }
    }
    .content-middle {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      margin-top: 80px;
      background: #fff;
    }
  
</style>
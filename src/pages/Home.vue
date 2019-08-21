<template>
  <div class="word-cup">
    <HeaderTop :title="navTopTitle">
      <van-icon name="arrow-left" slot="left" @click="backTo"></van-icon> 
      <van-icon name="manager-o" slot="right" @click.native="backTo"></van-icon> 
    </HeaderTop>
    <div class="content">
      <div class="content-header">
      </div>
      <div class="content-middle">
        <div class="content-list" v-for="item in itemList" @click="routerSkip(item.name, item.itemText)">
          <img src="" alt="">
          <p>{{item.itemText}}</p>
        </div>
      </div>
    </div>
    <FooterBottom></FooterBottom>
  </div>
</template>
<script>
  import HeaderTop from '../components/HeaderTop'
  import FooterBottom from '../components/FooterBottom'
  import NoData from '../components/NoData'
  import { mapGetters } from 'vuex'
  import { mapMutations } from 'vuex'
  export default {
    components:{
      HeaderTop,
      NoData,
      FooterBottom
    },
    data() {
      return {
        currentActive: 0,
        itemList: [
          { itemText: '医废收集', imgUrl: '', name: 'medicalCollect'},{ itemText: '医废入库', imgUrl: '', name: 'medicalInStorage'},
          { itemText: '医废出库', imgUrl: '', name: 'medicalOutStorage'},{ itemText: '报表统计', imgUrl: ''},
          { itemText: '异常预警', imgUrl: ''},{ itemText: '收集历史', imgUrl: ''},
          { itemText: '检测统计', imgUrl: ''},{ itemText: '视频监控', imgUrl: ''},
        ]
      }
    },
    mounted(){
    },
    computed:{
      ...mapGetters([
        'navTopTitle',
      ])
    },
    methods:{
      ...mapMutations([
        'changeTitleTxt', 
      ]),
      // 返回上一页
      backTo () {
        this.$router.go(-1)
      },
      //路由跳转
      routerSkip (name, text) {
        this.$router.push({name:name});
        this.changeTitleTxt({tit:text})
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../common/stylus/variable.styl"
  @import "../common/stylus/mixin.styl"
  .word-cup
    .content
      init-height()
    /deep/ .van-icon-arrow-left
      position absolute
      top 44px
      left 4px
      font-size 20px
      color #fff
    /deep/ .van-icon-manager-o
      position absolute
      top 44px
      right 6px
      font-size 18px
      color #fff
  .content
    position fixed
    width 100%
    height 100%
    background #fff
    .content-header
      width 100%
      height 200px
      border-bottom 1px solid #dbd3d3
    .content-middle
      width 100%
      display flex
      flex-direction row
      flex-wrap wrap
      .content-list
        flex-direction column
        width 25%
        height 100px
        display: flex
        align-items: center
        justify-content: center
        img
          width 50px
          height 50px
        p 
          margin-top 6px
          font-size 14px
          color #515151
</style>

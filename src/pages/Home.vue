<template>
  <div class="word-cup">
    <HeaderTop :title="navTopTitle">
      <van-icon name="arrow-left" slot="left" @click="backTo"></van-icon> 
      <van-icon name="manager-o" slot="right" @click.native="backTo"></van-icon> 
    </HeaderTop>
    <div class="content">
      <div class="content-header">
        {{userInfo}}
      </div>
      <div class="content-middle">
        <div class="content-list" v-for="item in itemList" @click="routerSkip(item.name, item.itemText)">
          <img :src="item.imgUrl" alt="">
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
  import {getBatchNumber} from '../api/rubbishCollect.js'
  import NoData from '../components/NoData'
  import { mapGetters } from 'vuex'
  import { mapMutations } from 'vuex'
  import collectWaste from '@/common/images/home/collect-waste.png'
  import abnormalWarning from '@/common/images/home/abnormal-warning.png'
  import collectHistory from '@/common/images/home/collect-history.png'
  import statement from '@/common/images/home/statement.png'
  import medicalIn from '@/common/images/home/medical-in.png'
  import medicalOut from '@/common/images/home/medical-out.png'
  import testStatistics from '@/common/images/home/test-statistics.png'
  import videoSurveillance from '@/common/images/home/video-surveillance.png'
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
          { itemText: '医废收集', imgUrl: collectWaste, name: 'medicalCollect'},{ itemText: '医废入库', imgUrl: medicalIn, name: 'medicalInStorage'},
          { itemText: '医废出库', imgUrl: medicalOut, name: 'medicalOutStorage'},{ itemText: '报表统计', imgUrl: statement},
          { itemText: '异常预警', imgUrl: abnormalWarning},{ itemText: '收集历史', imgUrl: collectHistory},
          { itemText: '检测统计', imgUrl: testStatistics },{ itemText: '视频监控', imgUrl: videoSurveillance},
        ]
      }
    },
    mounted(){
    },
    computed:{
      ...mapGetters([
        'navTopTitle',
        'userInfo'
      ])
    },
    methods:{
      ...mapMutations([
        'changeTitleTxt',
        'changeApplicationCollectTime',
        'createBatchNumber'
      ]),
      // 返回上一页
      backTo () {
        this.$router.go(-1)
      },
      //路由跳转
      routerSkip (name, text) {
        if (text === '医废收集') {
          this.changeApplicationCollectTime(this.formatTime());
          // 创建回收批次
          getBatchNumber(this.userInfo.id).then((res) => {
            if (res && res.data.code == 200) {
              // 批次号存入store
              this.createBatchNumber(res.data.data.batchNumber)
            }
          }).catch((err) => {
            console.log(err)
          })
        }
        this.$router.push({name:name});
        this.changeTitleTxt({tit:text})
      },
       // 时间格式方法
      formatTime () {
        return this.$moment(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss')
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
          width 30px
        p 
          margin-top 6px
          font-size 14px
          color #515151
</style>

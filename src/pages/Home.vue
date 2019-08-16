<template>
  <div class="word-cup">
    <HeaderTop title="流程页">
      <van-icon name="arrow-left" slot="left" @click="backTo"></van-icon> 
        <van-icon name="manager-o" slot="left" @click="backTo"></van-icon> 
    </HeaderTop>
    <div class="content">
      <div class="content-header">
        <van-steps :active="currentActive">
          <van-step>医护人员扫码</van-step>
          <van-step>称重</van-step>
          <van-step>扫码入库</van-step>
        </van-steps>
      </div>
      <div class="content-middle">
        <keep-alive>
          <component v-bind:is="currentView"></component>
        </keep-alive>
      </div>
      <div class="content-footer">
        <van-button type="info" @click="nextStep">完成</van-button>
      </div>
    </div>
  </div>
</template>
<script>
  import HeaderTop from '../components/HeaderTop'
  import NoData from '../components/NoData'
  import MedicalSweepCode from './MedicalSweepCode'
  import StockSweep from './StockSweep'
  import WeighRubbish from './WeighRubbish'
  export default {
    components:{
      HeaderTop,
      NoData,
      MedicalSweepCode,
      StockSweep,
      WeighRubbish
    },
    data() {
      return {
        currentActive: 0,
        currentComponent: 'MedicalSweepCode',
        viewData: ['MedicalSweepCode','WeighRubbish','StockSweep']
      }
    },
    mounted(){
    },
    computed:{
      currentView(){
        return this.viewData[this.currentActive];
      }
    },
    methods:{
      // 返回上一页
      backTo () {
        this.$router.go(-1)
      },
      nextStep() {
        if (this.currentActive > this.viewData.length - 2) {return};
        this.currentActive++;
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
      top 12px
      left 4px
      font-size 24px
      color #fff
    /deep/ .van-icon-manager-o
      position absolute
      top 12px
      right 4px
      font-size 24px
      color #fff
  .content
    .content-header
      margin-top 30px
    .content-middle
      height 300px
      width 100%
      margin-top 30px
    .content-footer
      margin-top 60px
      text-align center
</style>

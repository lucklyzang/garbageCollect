<template>
  <div class="word-cup">
    <HeaderTop title="流程页">
      <i class="mint-toast-icon mintui mintui-back" slot="left" @click="backTo"></i> 
      <i class="mint-toast-icon mintui mintui-more" slot="right"></i>
    </HeaderTop>
    <div class="content">
      <div class="content-header">
        <el-steps :active="currentActive" process-status="wait" finish-status="finish" align-center>
          <el-step title="医护人员扫码"></el-step>
          <el-step title="称重"></el-step>
          <el-step title="扫码入库"></el-step>
        </el-steps>
      </div>
      <div class="content-middle">
        <keep-alive>
          <component v-bind:is="currentView"></component>
        </keep-alive>
      </div>
      <div class="content-footer">
        <el-button type="primary" @click="nextStep">完成</el-button>
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
        currentActive: 1,
        viewActive: 0,
        currentComponent: 'MedicalSweepCode',
        viewData: ['MedicalSweepCode','WeighRubbish','StockSweep']
      }
    },
    mounted(){
    },
    computed:{
      currentView(){
        return this.viewData[this.viewActive];
      }
    },
    methods:{
      // 返回上一页
      backTo () {
        this.$router.go(-1)
      },
      nextStep() {
        if (this.currentActive > this.viewData.length - 1) {return};
        this.currentActive++;
        this.viewActive = this.currentActive - 1;
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
    /deep/ .mintui-back
      position absolute
      top 12px
      left 4px
      font-size 24px
      color #fff
    /deep/ .mintui-more
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

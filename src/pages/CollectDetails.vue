<template>
  <div class="content-wrapper">
    <HeaderTop :title="navTopTitle">
      <van-icon name="arrow-left" slot="left" @click="backTo"></van-icon> 
    </HeaderTop>
    <div class="content-middle">
      <div class="content-middle-top">
        <div v-show="currentName==0">
          <div class="list-item">
            <p class="list-item-left">批次: {{getCollectInfo.batchNumber ? getCollectInfo.batchNumber : ''}}</p>
            <div class="list-strip">
              <p>医院: {{getCollectInfo.proName}}</p>
              <p class="list-sign">交接人: {{getCollectInfo.companyName ? getCollectInfo.companyName : '无'}}</p>
              <p class="list-times">交接公司: {{getCollectInfo.company ? getCollectInfo.company : '无'}}</p>
              <p class="list-code">收集车号: {{getCollectInfo.cardNumber ? getCollectInfo.cardNumber : '无'}}</p>
              <p>收集总重量: {{getCollectInfo.totalWeight ? getCollectInfo.totalWeight : '0.00'}}kg</p>
              <p class="list-sign">总包数: {{getCollectInfo.totalCount ? getCollectInfo.totalCount : 0}}</p>
            </div>
          </div>
        </div>
        <div v-show="currentName==1">
          <div class="list-item">
            <p class="list-item-left">批次: {{getCollectInfo.batchNumber ? getCollectInfo.batchNumber : ''}}</p>
            <div class="list-strip">
              <p>医院: {{getCollectInfo.proName}}</p>
              <p class="list-sign">交接人: {{getCollectInfo.companyName ? getCollectInfo.companyName : '无'}}</p>
              <p class="list-sign">入库人员: {{getCollectInfo.inWorkerName ? getCollectInfo.inWorkerName : '无'}}</p>
              <p class="list-times">交接公司: {{getCollectInfo.company ? getCollectInfo.company : '无'}}</p>
              <p class="list-code">收集车号: {{getCollectInfo.cardNumber ? getCollectInfo.cardNumber : '无'}}</p>
              <p class="list-sign">入库总重量: {{getCollectInfo.inTotalWeight ? getCollectInfo.inTotalWeight : '无'}}kg</p>
              <p class="list-sign">入库时间: {{getCollectInfo.inTime ? getCollectInfo.inTime : '无'}}</p>
              <p>收集总重量: {{getCollectInfo.totalWeight ? getCollectInfo.totalWeight : '0.00'}}kg</p>
              <p class="list-sign">总包数: {{getCollectInfo.totalCount ? getCollectInfo.totalCount : 0}}</p>
            </div>
          </div>
        </div>
         <div v-show="currentName==2">
          <div class="list-item">
            <p class="list-item-left">批次: {{getCollectInfo.batchNumber ? getCollectInfo.batchNumber : ''}}</p>
            <div class="list-strip">
              <p>医院: {{getCollectInfo.proName}}</p>
              <p class="list-sign">交接人: {{getCollectInfo.companyName ? getCollectInfo.companyName : '无'}}</p>
              <!-- <p class="list-sign">出库人员: {{getCollectInfo.outWorkerName ? getCollectInfo.outWorkerName : '无'}}</p> -->
              <p class="list-times">交接公司: {{getCollectInfo.company ? getCollectInfo.company : '无'}}</p>
              <p class="list-code">收集车号: {{getCollectInfo.cardNumber ? getCollectInfo.cardNumber : '无'}}</p>
              <p class="list-sign">出库总重量: {{getCollectInfo.outTotalWeight ? getCollectInfo.outTotalWeight : '无'}}kg</p>
              <p class="list-sign">出库时间: {{getCollectInfo.outTime ? getCollectInfo.outTime : '无'}}</p>
              <p>收集总重量: {{getCollectInfo.totalWeight ? getCollectInfo.totalWeight : '0.00'}}kg</p>
              <p class="list-sign">总包数: {{getCollectInfo.totalCount ? getCollectInfo.totalCount : 0}}</p>
              <p class="list-times">总暂存点编号: {{getCollectInfo.storeNumber ? getCollectInfo.storeNumber : '无'}}</p>
            </div>
          </div>
        </div>
         <div v-show="currentName==3">
          <div class="list-item">
            <p class="list-item-left">批次: {{getCollectInfo.batchNumber ? getCollectInfo.batchNumber : ''}}</p>
            <div class="list-strip">
              <p>医院: {{getCollectInfo.proName}}</p>
              <p class="list-sign">交接人: {{getCollectInfo.companyName ? getCollectInfo.companyName : '无'}}</p>
              <p class="list-sign">入库人员: {{getCollectInfo.inWorkerName ? getCollectInfo.inWorkerName : '无'}}</p>
              <p class="list-sign">出库人员: {{getCollectInfo.outWorkerName ? getCollectInfo.outWorkerName : '无'}}</p>
              <p class="list-times">交接公司: {{getCollectInfo.company ? getCollectInfo.company : '无'}}</p>
              <p class="list-code">收集车号: {{getCollectInfo.cardNumber ? getCollectInfo.cardNumber : '无'}}</p>
              <p class="list-sign">入库总重量: {{getCollectInfo.inTotalWeight ? getCollectInfo.inTotalWeight : '0.00'}}kg</p>
              <p class="list-sign">出库总重量: {{getCollectInfo.outTotalWeight ? getCollectInfo.outTotalWeight : '0.00'}}kg</p>
              <p class="list-sign">入库时间: {{getCollectInfo.inTime ? getCollectInfo.inTime : '无'}}</p>
              <p class="list-sign">出库时间: {{getCollectInfo.outTime ? getCollectInfo.outTime : '无'}}</p>
              <p>收集总重量: {{getCollectInfo.totalWeight ? getCollectInfo.totalWeight : '0.00'}}kg</p>
              <p class="list-sign">总包数: {{getCollectInfo.totalCount ? getCollectInfo.totalCount : 0}}</p>
              <p class="list-times">总暂存点编号: {{getCollectInfo.storeNumber ? getCollectInfo.storeNumber : '无'}}</p>
            </div>
          </div>
        </div>
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
      handleMessage: ''
    };
  },
  computed: {
    ...mapGetters([
      'navTopTitle',
      'userInfo',
      'collectInfo',
      'currentName'
    ]),
    getUserInfo () {
      return this.userInfo.proId
    },
    getCollectInfo () {
      return this.collectInfo
    }
  },

  mounted () {
    // 控制设备物理返回按键
    this.monitorBack();
    this.handleMessage = '';
  },

  // 由于该页面被缓存,调用activated钩子函数保证每次组件切换时,监听物理返回按键的方法都会执行
  activated () {
    // 控制设备物理返回按键
    this.monitorBack()
  },

  methods: {
    ...mapMutations([
      'changeTitleTxt',
      'initCurrentName',
      'changeIsCall'
    ]),
    // 返回上一页
    backTo () {
      this.$router.push({path: 'collectHistory'});
      this.changeTitleTxt({tit: '收集历史'});
      this.initCurrentName();
      this.changeIsCall(false)
    }, 
    // 时间格式方法
    formatTime () {
      return this.$moment(new Date().getTime()).format('YYYY-MM-DD')
    },
    // 时间格式方法2
    formatTimeOther () {
      return this.$moment(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss')
    },

    // 控制设备物理返回按键
    monitorBack () {
      let that = this;
      pushHistory()
      that.gotoURL(() => { 
        pushHistory()
        this.$router.push({path: 'collectHistory'});  //输入要返回的上一级路由地址
        this.changeTitleTxt({tit: '收集历史'});
        this.changeIsCall(false)
      })
    }
  }
}

</script>
<style lang='less' scoped>
  @import "../common/stylus/variable.less";
  @import "../common/stylus/modifyUi.less";
  .content-wrapper {
    .content-middle {
     .content-middle(0);
      .content-middle-top {
        margin-top: 80px;
        height: 80vh;
        overflow: auto;
        padding: 16px;
          .list-item {
            position: relative;
            height: 100%;
            .list-item-left {
              position: absolute;
              top: 0;
              left: 0;
              color: black;
              font-size: 14px;
              font-weight: bold;
            }
            .list-strip {
              position: absolute;
              top: 20px;
              left: 0;
              color: #707070;
              font-size: 13px;
              margin-top: 12px;
              p {
                margin-top: 12px;
                &:first-child {
                  margin-top: 0
                }
              }
            }
          }
      }
    }
  }
</style>
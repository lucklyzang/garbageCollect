<template>
  <div class="content-wrapper">
    <HeaderTop :title="navTopTitle">
      <van-icon name="arrow-left" slot="left" @click="backTo"></van-icon> 
    </HeaderTop>
    <div class="content-middle">
      <div class="content-middle-top">
        <div v-show="currentName==0">
          <div class="list-item">
            <p class="list-item-left">批次: {{collectInfo.batchNumber}}</p>
            <div class="list-strip">
              <p>医院: {{collectInfo.proName}}</p>
              <p class="list-sign">交接人: {{collectInfo.companyName ? collectInfo.companyName : '无'}}</p>
              <p class="list-times">交接公司: {{collectInfo.company ? collectInfo.company : '无'}}</p>
              <p class="list-code">收集车号: {{collectInfo.cardNumber ? collectInfo.cardNumber : '无'}}</p>
              <p>收集总重量: {{collectInfo.totalWeight ? collectInfo.totalWeight : '0.00'}}kg</p>
              <p class="list-sign">总包数: {{collectInfo.totalCount ? collectInfo.totalCount : 0}}</p>
              <p class="list-times">交接公司: {{collectInfo.company ? collectInfo.company : '无'}}</p>
            </div>
          </div>
        </div>
        <div v-show="currentName==1">
          <div class="list-item">
            <p class="list-item-left">批次: {{collectInfo.batchNumber}}</p>
            <div class="list-strip">
              <p>医院: {{collectInfo.proName}}</p>
              <p class="list-sign">交接人: {{collectInfo.companyName ? collectInfo.companyName : '无'}}</p>
              <p class="list-sign">入库人员: {{collectInfo.inWorkerName ? collectInfo.inWorkerName : '无'}}</p>
              <p class="list-times">交接公司: {{collectInfo.company ? collectInfo.company : '无'}}</p>
              <p class="list-code">收集车号: {{collectInfo.cardNumber ? collectInfo.cardNumber : '无'}}</p>
              <p class="list-sign">入库总重量: {{collectInfo.inTotalWeight ? collectInfo.inTotalWeight : '无'}}kg</p>
              <p class="list-sign">入库时间: {{collectInfo.inTime ? collectInfo.inTime : '无'}}</p>
              <p>收集总重量: {{collectInfo.totalWeight ? collectInfo.totalWeight : '0.00'}}kg</p>
              <p class="list-sign">总包数: {{collectInfo.totalCount ? collectInfo.totalCount : 0}}</p>
              <p class="list-times">交接公司: {{collectInfo.company ? collectInfo.company : '无'}}</p>
            </div>
          </div>
        </div>
         <div v-show="currentName==2">
          <div class="list-item">
            <p class="list-item-left">批次: {{collectInfo.batchNumber}}</p>
            <div class="list-strip">
              <p>医院: {{collectInfo.proName}}</p>
              <p class="list-sign">交接人: {{collectInfo.companyName ? collectInfo.companyName : '无'}}</p>
              <p class="list-sign">出库人员: {{collectInfo.outWorkerName ? collectInfo.outWorkerName : '无'}}</p>
              <p class="list-times">交接公司: {{collectInfo.company ? collectInfo.company : '无'}}</p>
              <p class="list-code">收集车号: {{collectInfo.cardNumber ? collectInfo.cardNumber : '无'}}</p>
              <p class="list-sign">出库总重量: {{collectInfo.outTotalWeight ? collectInfo.outTotalWeight : '无'}}kg</p>
              <p class="list-sign">出库时间: {{collectInfo.outTime ? collectInfo.outTime : '无'}}</p>
              <p>收集总重量: {{collectInfo.totalWeight ? collectInfo.totalWeight : '0.00'}}kg</p>
              <p class="list-sign">总包数: {{collectInfo.totalCount ? collectInfo.totalCount : 0}}</p>
              <p class="list-times">交接公司: {{collectInfo.company ? collectInfo.company : '无'}}</p>
              <p class="list-times">总暂存点编号: {{collectInfo.storeNumber ? collectInfo.storeNumber : '无'}}</p>
            </div>
          </div>
        </div>
         <div v-show="currentName==3">
          <div class="list-item">
            <p class="list-item-left">批次: {{collectInfo.batchNumber}}</p>
            <div class="list-strip">
              <p>医院: {{collectInfo.proName}}</p>
              <p class="list-sign">交接人: {{collectInfo.companyName ? collectInfo.companyName : '无'}}</p>
              <p class="list-sign">入库人员: {{collectInfo.inWorkerName ? collectInfo.inWorkerName : '无'}}</p>
              <p class="list-sign">出库人员: {{collectInfo.outWorkerName ? collectInfo.outWorkerName : '无'}}</p>
              <p class="list-times">交接公司: {{collectInfo.company ? collectInfo.company : '无'}}</p>
              <p class="list-code">收集车号: {{collectInfo.cardNumber ? collectInfo.cardNumber : '无'}}</p>
              <p class="list-sign">入库总重量: {{collectInfo.inTotalWeight ? collectInfo.inTotalWeight : '无'}}kg</p>
              <p class="list-sign">出库总重量: {{collectInfo.outTotalWeight ? collectInfo.outTotalWeight : '无'}}kg</p>
              <p class="list-sign">入库时间: {{collectInfo.inTime ? collectInfo.inTime : '无'}}</p>
              <p class="list-sign">出库时间: {{collectInfo.outTime ? collectInfo.outTime : '无'}}</p>
              <p>收集总重量: {{collectInfo.totalWeight ? collectInfo.totalWeight : '0.00'}}kg</p>
              <p class="list-sign">总包数: {{collectInfo.totalCount ? collectInfo.totalCount : 0}}</p>
              <p class="list-times">交接公司: {{collectInfo.company ? collectInfo.company : '无'}}</p>
              <p class="list-times">总暂存点编号: {{collectInfo.storeNumber ? collectInfo.storeNumber : '无'}}</p>
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
    }
  },

  mounted () {
    pushHistory();
    window.onpopstate = () => {
      this.$router.push({path: 'collectHistory'});  //输入要返回的上一级路由地址
      this.changeTitleTxt({tit: '收集历史'})
    };
    this.handleMessage = '';
  },

  methods: {
    ...mapMutations([
      'changeTitleTxt',
      'initCollectInfo',
      'initCurrentName'
    ]),
    // 返回上一页
    backTo () {
      this.$router.push({path: 'collectHistory'});
      this.changeTitleTxt({tit: '收集历史'});
      this.initCollectInfo();
      this.initCurrentName()
    }, 
    // 时间格式方法
    formatTime () {
      return this.$moment(new Date().getTime()).format('YYYY-MM-DD')
    },
    // 时间格式方法2
    formatTimeOther () {
      return this.$moment(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss')
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
        margin-top: 80px;
        height: 500px;
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
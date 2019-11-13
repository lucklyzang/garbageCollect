<template>
  <div class="content-wrapper">
    <HeaderTop :title="navTopTitle">
      <van-icon name="arrow-left" slot="left" @click="backTo"></van-icon> 
    </HeaderTop>
    <div class="content-middle">
      <div class="content-middle-top">
        <div v-show="currentName==0">
          <div class="list-item">
            <div class="item-column">
              <p class="title">批次</p>
              <p class="title-content">{{getCollectInfo.batchNumber ? getCollectInfo.batchNumber : ''}}</p>
            </div>
            <div class="item-column">
              <p class="title">医院</p>
              <p class="title-content">{{getCollectInfo.proName}}</p>
            </div>
            <div class="item-column">
              <p class="title">交接人</p>
              <p class="title-content">{{getCollectInfo.companyName ? getCollectInfo.companyName : '无'}}</p>
            </div>
            <div class="item-column">
              <p class="title">交接公司</p>
              <p class="title-content">{{getCollectInfo.company ? getCollectInfo.company : '无'}}</p>
            </div>
            <div class="item-column">
              <p class="title">收集车号</p>
              <p class="title-content">{{getCollectInfo.cardNumber ? getCollectInfo.cardNumber : '无'}}</p>
            </div>
            <div class="item-column">
              <p class="title">收集总重量</p>
              <p class="title-content">{{getCollectInfo.totalWeight ? getCollectInfo.totalWeight : '0.00'}}kg</p>
            </div>
            <div class="item-column">
              <p class="title">总包数</p>
              <p class="title-content">{{getCollectInfo.totalCount ? getCollectInfo.totalCount : 0}}</p>
            </div>
          </div>
        </div>
        <div v-show="currentName==1">
          <div class="list-item">
            <div class="item-column">
              <p class="title">批次</p>
              <p class="title-content">{{getCollectInfo.batchNumber ? getCollectInfo.batchNumber : ''}}</p>
            </div>
            <div class="item-column">
              <p class="title">医院</p>
              <p class="title-content">{{getCollectInfo.proName}}</p>
            </div>
            <div class="item-column">
              <p class="title">交接人</p>
              <p class="title-content">{{getCollectInfo.companyName ? getCollectInfo.companyName : '无'}}</p>
            </div>
            <div class="item-column">
              <p class="title">入库人员</p>
              <p class="title-content">{{getCollectInfo.inWorkerName ? getCollectInfo.inWorkerName : '无'}}</p>
            </div>
            <div class="item-column">
              <p class="title">交接公司</p>
              <p class="title-content">{{getCollectInfo.company ? getCollectInfo.company : '无'}}</p>
            </div>
            <div class="item-column">
              <p class="title">收集车号</p>
              <p class="title-content">{{getCollectInfo.cardNumber ? getCollectInfo.cardNumber : '无'}}</p>
            </div>
            <div class="item-column">
              <p class="title">入库总重量</p>
              <p class="title-content">{{getCollectInfo.inTotalWeight ? getCollectInfo.inTotalWeight : '无'}}kg</p>
            </div> 
            <div class="item-column">
              <p class="title">入库时间</p>
              <p class="title-content">{{getCollectInfo.inTime ? getCollectInfo.inTime : '无'}}</p>
            </div> 
            <div class="item-column">
              <p class="title">收集总重量</p>
              <p class="title-content">{{getCollectInfo.totalWeight ? getCollectInfo.totalWeight : '0.00'}}kg</p>
            </div>   
            <div class="item-column">
              <p class="title">总包数</p>
              <p class="title-content">{{getCollectInfo.totalCount ? getCollectInfo.totalCount : 0}}</p>
            </div> 
          </div>
        </div>
        <div v-show="currentName==2">
          <div class="list-item">
            <div class="item-column">
              <p class="title">批次</p>
              <p class="title-content">{{getCollectInfo.batchNumber ? getCollectInfo.batchNumber : ''}}</p>
            </div>
            <div class="item-column">
              <p class="title">医院</p>
              <p class="title-content">{{getCollectInfo.proName}}</p>
            </div>
            <div class="item-column">
              <p class="title">交接人</p>
              <p class="title-content">{{getCollectInfo.companyName ? getCollectInfo.companyName : '无'}}</p>
            </div>
            <div class="item-column">
              <p class="title">交接公司</p>
              <p class="title-content">{{getCollectInfo.company ? getCollectInfo.company : '无'}}</p>
            </div>
            <div class="item-column">
              <p class="title">收集车号</p>
              <p class="title-content">{{getCollectInfo.cardNumber ? getCollectInfo.cardNumber : '无'}}</p>
            </div> 
            <div class="item-column">
              <p class="title">出库总重量</p>
              <p class="title-content">{{getCollectInfo.outTotalWeight ? getCollectInfo.outTotalWeight : '无'}}kg</p>
            </div>   
            <div class="item-column">
              <p class="title">出库时间</p>
              <p class="title-content">{{getCollectInfo.outTime ? getCollectInfo.outTime : '无'}}</p>
            </div>  
            <div class="item-column">
              <p class="title">收集总重量</p>
              <p class="title-content">{{getCollectInfo.totalWeight ? getCollectInfo.totalWeight : '0.00'}}kg</p>
            </div>    
            <div class="item-column">
              <p class="title">总包数</p>
              <p class="title-content">{{getCollectInfo.totalCount ? getCollectInfo.totalCount : 0}}</p>
            </div>  
            <div class="item-column">
              <p class="title">总暂存点编号</p>
              <p class="title-content">{{getCollectInfo.storeNumber ? getCollectInfo.storeNumber : '无'}}</p>
            </div>  
          </div>
        </div>
         <div v-show="currentName==3">
          <div class="list-item">
            <div class="item-column">
              <p class="title">批次</p>
              <p class="title-content">{{getCollectInfo.batchNumber ? getCollectInfo.batchNumber : ''}}</p>
            </div>
            <div class="item-column">
              <p class="title">医院</p>
              <p class="title-content">{{getCollectInfo.proName}}</p>
            </div>
            <div class="item-column">
              <p class="title">交接人</p>
              <p class="title-content">{{getCollectInfo.companyName ? getCollectInfo.companyName : '无'}}</p>
            </div>
            <div class="item-column">
              <p class="title">入库人员</p>
              <p class="title-content">{{getCollectInfo.inWorkerName ? getCollectInfo.inWorkerName : '无'}}</p>
            </div>
            <div class="item-column">
              <p class="title">出库人员</p>
              <p class="title-content">{{getCollectInfo.outWorkerName ? getCollectInfo.outWorkerName : '无'}}</p>
            </div> 
            <div class="item-column">
              <p class="title">交接公司</p>
              <p class="title-content">{{getCollectInfo.company ? getCollectInfo.company : '无'}}</p>
            </div>
            <div class="item-column">
              <p class="title">收集车号</p>
              <p class="title-content">{{getCollectInfo.cardNumber ? getCollectInfo.cardNumber : '无'}}</p>
            </div>
            <div class="item-column">
              <p class="title">入库总重量</p>
              <p class="title-content">{{getCollectInfo.inTotalWeight ? getCollectInfo.inTotalWeight : '无'}}kg</p>
            </div>  
            <div class="item-column">
              <p class="title">出库总重量</p>
              <p class="title-content">{{getCollectInfo.outTotalWeight ? getCollectInfo.outTotalWeight : '无'}}kg</p>
            </div>   
            <div class="item-column">
              <p class="title">入库时间</p>
              <p class="title-content">{{getCollectInfo.inTime ? getCollectInfo.inTime : '无'}}</p>
            </div>
            <div class="item-column">
              <p class="title">出库时间</p>
              <p class="title-content">{{getCollectInfo.outTime ? getCollectInfo.outTime : '无'}}</p>
            </div>    
            <div class="item-column">
              <p class="title">收集总重量</p>
              <p class="title-content">{{getCollectInfo.totalWeight ? getCollectInfo.totalWeight : '0.00'}}kg</p>
            </div>    
            <div class="item-column">
              <p class="title">总包数</p>
              <p class="title-content">{{getCollectInfo.totalCount ? getCollectInfo.totalCount : 0}}</p>
            </div>  
            <div class="item-column">
              <p class="title">总暂存点编号</p>
              <p class="title-content">{{getCollectInfo.storeNumber ? getCollectInfo.storeNumber : '无'}}</p>
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
import { formatTime, setStore, IsPC } from '@/common/js/utils'
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
    if (!IsPC()) {
      this.monitorBack()
    };
    this.handleMessage = '';
  },

  beforeRouteLeave(to, from, next) {
    //跳转到页面为收集历史时,目标页面缓存
    if(to.name == 'collectHistory') {
      to.meta.keepAlive = true; 
      next()
    }
  },

  methods: {
    ...mapMutations([
      'changeTitleTxt',
      'initCurrentName'
    ]),

    // 返回上一页
    backTo () {
      this.$router.push({path: 'collectHistory'});
      this.changeTitleTxt({tit: '收集历史'});
      setStore('currentTitle','收集历史');
      this.initCurrentName()
    }, 

    // 控制设备物理返回按键
    monitorBack () {
      let that = this;
      pushHistory()
      that.gotoURL(() => { 
        pushHistory()
        this.$router.push({path: 'collectHistory'});  //输入要返回的上一级路由地址
        this.changeTitleTxt({tit: '收集历史'});
        setStore('currentTitle','收集历史')
      })
    }
  }
}

</script>
<style lang='less' scoped>
  @import "../common/stylus/variable.less";
  @import "../common/stylus/modifyUi.less";
  .content-wrapper {
   .content-wrapper();
    .content-middle {
     background: #f5f5f5;
     flex:1;
     overflow: auto;
      .content-middle-top {
        padding: 12px;
        .list-item {
          .item-column {
            height: 40px;
            padding: 12px 0 12px 10px;
            background: #fff;
            margin-bottom: 12px;
            .title {
              font-size: 14px;
              color: #535353;
              margin-bottom: 12px;
              font-weight: bold;
            }
            .title-content {
              font-size: 13px;
              color: #b3b3b3
            }
          }
        }
      }
    }
  }
</style>
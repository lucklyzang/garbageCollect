<template>
  <div class="word-cup">
    <HeaderTop :title="navTopTitle">
      <van-icon name="arrow-left" slot="left" @click="backTo"></van-icon> 
      <van-icon name="manager-o" slot="right" @click="skipMyInfo"></van-icon> 
    </HeaderTop>
    <div class="content">
      <div class="content-header">
        <img :src="bannerUrl" alt="">
      </div>
      <div class="content-middle">
        <div class="content-list" v-for="item in itemList" @click="routerSkip(item.name, item.itemText)">
          <img :src="item.imgUrl" alt="">
          <p>{{item.itemText}}</p>
        </div>
      </div>
    </div>
    <!-- <FooterBottom></FooterBottom> -->
  </div>
</template>
<script>
  import HeaderTop from '../components/HeaderTop'
  import FooterBottom from '../components/FooterBottom'
  import {getBatchNumber} from '../api/rubbishCollect.js'
  import NoData from '../components/NoData'
  import { mapGetters, mapMutations } from 'vuex'
  import collectWaste from '@/common/images/home/collect-waste.png'
  import abnormalWarning from '@/common/images/home/abnormal-warning.png'
  import collectHistory from '@/common/images/home/collect-history.png'
  import statement from '@/common/images/home/statement.png'
  import medicalIn from '@/common/images/home/medical-in.png'
  import medicalOut from '@/common/images/home/medical-out.png'
  import testStatistics from '@/common/images/home/test-statistics.png'
  import videoSurveillance from '@/common/images/home/video-surveillance.png'
  import homeBanner from '@/common/images/home/home-banner.png'
  import addCheck from '@/common/images/home/add-check.png'
  import warningCheck from '@/common/images/home/warning-check.png'
  import { pushHistory } from '@/common/js/utils'
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
          { itemText: '医废出库', imgUrl: medicalOut, name: 'medicalOutStorage'},{ itemText: '报表统计', imgUrl: statement, name: 'reportAudit'},
          { itemText: '异常预警', imgUrl: abnormalWarning, name: 'abnormalWarning'},{ itemText: '收集历史', imgUrl: collectHistory, name: 'collectHistory'},
          { itemText: '视频监控', imgUrl: videoSurveillance, name: 'videoMonitor'},{ itemText: '预警审核', imgUrl: warningCheck, name: 'warningCheck'},
          { itemText: '补录审核', imgUrl: addCheck, name: 'addCheck'}
        ],
        roleList: ['管理员','项目经理'],
        bannerUrl: homeBanner
      }
    },
    
    mounted(){
      // 控制设备物理返回按键
      let that = this;
      pushHistory()
      that.gotoURL(() => { 
        pushHistory()
        this.$router.push({path: 'home'});  //输入要返回的上一级路由地址
        this.changeTitleTxt({tit: '医废监测'})
      });
      this.initItemList ()
    },
    
    computed:{
      ...mapGetters([
        'navTopTitle',
        'userInfo'
      ]),
      getCardType () {
        return this.userInfo.roleName
      },
    },
    methods:{
      ...mapMutations([
        'changeTitleTxt',
        'changeApplicationCollectTime',
        'createBatchNumber',
        'changeRouterFlag'
      ]),
      // 返回上一页
      backTo () {
        this.$router.replace({name: 'home'});
        this.changeTitleTxt({tit:'医废监测'})
      },
      // 初始化首页展示菜单列表
      initItemList () {
        if (this.roleList.indexOf(this.getCardType) == -1) {
          this.itemList.splice(-2,2)
        }
      },
      // 跳转到我的页面
      skipMyInfo () {
        this.$router.push({path: 'myInfo'});
        this.changeTitleTxt({tit:'我的'})
      },
      //路由跳转
      routerSkip (name, text) {
        if (name) {
          if (text === '医废收集') {
            if (this.userInfo && this.userInfo.id) {
              this.changeApplicationCollectTime(this.formatTime());
              // 创建回收批次
              getBatchNumber(this.userInfo.id).then((res) => {
                if (res && res.data.code == 200) {
                  // 批次号存入store
                  this.createBatchNumber(res.data.data.batchNumber)
                }
              }).catch((err) => {
                this.$dialog.alert({
                  message: `${err.message}`,
                  closeOnPopstate: true
                }).then(() => {
                })
              })
            } else {
              this.$dialog.alert({
                message: '用户ID不能为空,请重新登录',
                closeOnPopstate: true
              }).then(() => {
                this.$router.push({name: 'login'})
              });
            }
          };
          this.$router.push({path:name});
          this.changeTitleTxt({tit:text})
        }
      },
       // 时间格式方法
      formatTime () {
        return this.$moment(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss')
      }
    }
  }
</script>
<style lang='less' scoped>
  @import "../common/stylus/variable.less";
  @import "../common/stylus/mixin.less";
  .word-cup {
    /deep/ .van-icon-arrow-left {
      position: absolute;
      top: 22px;
      left: 4px;
      font-size: 20px;
      color: #fff
    }
    /deep/ .van-icon-manager-o {
      position: absolute;
      top: 22px;
      right: 6px;
      font-size: 18px;
      color: #fff
    }
  }
  .content {
    position: fixed;
    width: 100%;
    height: 100%;
    background: #fff;
    .content-header {
      width: 100%;
      height: 200px;
      margin-top: 60px;
      img {
        width: 100%;
        height: 100%
      }
    }
    .content-middle {
      width: 100%;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      .content-list {
        flex-direction: column;
        width: 25%;
        height: 100px;
        display: flex;
        align-items: center;
        justify-content: center;
        img {
          width: 30px
        }
        p {
          margin-top: 6px;
          font-size: 14px;
          color: #515151;
        }
      }
    }
  }   
  
</style>

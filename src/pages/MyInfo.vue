<template>
  <div class="content-wrapper">
    <HeaderTop :title="navTopTitle">
      <van-icon name="arrow-left" slot="left" @click="backTo"></van-icon> 
    </HeaderTop>
    <div class="content-middle">
      <div class="content-middle-top">
        <span><img :src="defaultPortrait" alt=""></span>
        <span>{{this.getWorkerName}}</span>
      </div>
      <div class="content-middle-medail">
        <van-panel title="联系方式">
          <div>{{this.getWorkerPhone ? this.getWorkerPhone: '无'}}</div>
        </van-panel>
         <van-panel title="所属医院">
          <div>{{this.getHospitial ? this.getHospitial: '无'}}</div>
        </van-panel>
         <van-panel title="车辆编号">
          <div>{{this.getCarNum ? this.getCarNum: '无'}}</div>
        </van-panel>
         <van-panel title="身份类别">
          <div>{{this.getCardType}}</div>
        </van-panel>
         <van-panel title="可收集垃圾类别">
          <div>{{this.getRubbishType ? judgeRubbishType(this.getRubbishType) : '无'}}</div>
        </van-panel>
         <van-panel title="性别">
          <div>{{this.getGender == 0 ? '男' : '女'}}</div>
        </van-panel>
         <van-panel title="生日">
          <div>{{this.getBirthday ? this.getBirthday: '无'}}</div>
        </van-panel>
      </div>
      <div class="content-bottom">
        <van-cell-group>
          <van-button  @click="loginOut" size="normal">注销账号</van-button>
        </van-cell-group>
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
import {removeStore} from '@/common/js/utils.js'
import defaultPortrait from '@/common/images/default-portrait.png'
export default {
   components:{
    HeaderTop,
    FooterBottom
  },
  data () {
    return {
      defaultPortrait: defaultPortrait
    };
    
  },
  computed: {
    ...mapGetters([
      'navTopTitle',
      'userInfo'
    ]),
    getWorkerName () {
      return this.userInfo.workerName
    },
    getWorkerPhone () {
      return this.userInfo.phone
    },
    getHospitial () {
      return this.userInfo.proName
    },
    getCarNum () {
      return this.userInfo.carNumber
    },
    getCardType () {
      return this.userInfo.roleName
    },
    getRubbishType () {
      return this.userInfo.canWasteTypes
    },
    getGender () {
      return this.userInfo.sex
    },
    getBirthday () {
      return this.userInfo.birthday
    }
  },

  mounted() {
   // 控制设备物理返回按键
    let that = this;
    pushHistory()
    that.gotoURL(() => { 
      pushHistory()
      this.$router.push({path: 'home'});  //输入要返回的上一级路由地址
      this.changeTitleTxt({tit: '医废监测'})
    });
    this.changeRouterFlag(true)
  },
  methods: {
    ...mapMutations([
      'changeTitleTxt',
      'changeTotalWeight',
      'changeBatchs',
      'initTotalWeight',
      'initBatchs',
      'changeRouterFlag'
    ]),
    // 返回上一页
    backTo () {
      this.$router.push({name:'home'});
      this.changeTitleTxt({tit:'医废监测'})
    },
    // 判断身份类别
    judgeCardType (type) {
      switch (type) {
        case 0 :
          return '普通员工'
          break;
        case 1 :
          return '电梯人员'
          break;
        case 2 :
          return '垃圾收集人员'
          break;
        case 3 :
          return '保洁人员'
          break;
        case 4 :
          return '管理员'
          break;
        case 5 :
          return '调度员'
          break;
        case 6 :
          return '项目经理'
          break;
      }
    },
    // 判断身份类别
    judgeRubbishType (type) {
      switch (type) {
        case 1 :
          return '感染性'
          break;
        case 2 :
          return '损伤性'
          break;
        case 3 :
          return '药物性'
          break;
        case 4 :
          return '病理性'
          break;
        case 5 :
          return '化学性'
          break;
        case 6 :
          return '其它'
          break;
        case '1,2,3,4,5,6':
          return '感染性, 损伤性, 药物性, 病理性, 化学性, 其它'
          break;
      }
    },
    // 退出登录
    loginOut () {
       this.$dialog.confirm({
        message: '确定注销账号?'
      })
      .then(() => {
        // 清除localStorage存储的用户信息
        removeStore('userName');
        removeStore('userPassword');
        removeStore('userInfo');
        removeStore('isLogin');
        this.$router.replace({name:'login'});
      })
      .catch(() => {})
    },
    // 时间格式方法
    formatTime () {
      return this.$moment(new Date().getTime()).format('YYYY-MM-DD')
    }
  }
}

</script>
<style lang='less' scoped>
@import "../common/stylus/variable.less";
  .content-wrapper {
    margin-top: 100px;
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
      color: #fff;
    }
    .content-middle {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      margin-top: 60px;
      background: #f3f3f3;
      .content-middle-top {
        margin-top: 10px;
        padding: 10px;
        background: #fff;
        span {
          display: inline-block;
          &:first-child {
            width: 80px;
            height: 80px;
            img {
              width: 100%;
              height: 100%;
              vertical-align: middle;
            }
          }
          &:last-child {
            margin-left: 10px;
            font-size: 18px;
            color: #797373
          }
        }
      }
      .content-bottom {
        width: 100%;
        position: fixed;
        bottom: 10px;
        left: 0;
          .van-cell-group {
            width: 92%;
            margin: 0 auto;
            background-color: transparent;
            /deep/ .van-button {
            width: 100%;
            background: @color-theme;
            color: #fff;
            border-radius: 0;
            font-size: 12px;
            border-radius: 30px;
            height: 35px;
            border: none;
            line-height: 35px;
            padding: 0 120px
          }
        }
      }
      .content-middle-medail {
        height: 65vh;
        overflow: auto;
        /deep/ .van-panel__header {
          color: black;
        }
        /deep/ .van-panel__content {
          padding-left: 14px;
          font-size: 16px;
          color: #38bdd0;
          height: 30px;
          line-height: 30px
        }
      }
    }
  }
</style>
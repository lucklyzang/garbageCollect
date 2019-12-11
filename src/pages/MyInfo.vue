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
        <div>联系方式: {{this.getWorkerPhone ? this.getWorkerPhone: '无'}}</div>
        <div>所属医院: {{this.getHospitial ? this.getHospitial: '无'}}</div>
        <div>车辆编号: {{this.getCarNum ? this.getCarNum: '无'}}</div>
        <div>身份类别: {{this.getCardType}}</div>
        <div>可收集垃圾类别: {{this.getRubbishType ? judgeRubbishType(this.getRubbishType) : '无'}}</div>
        <div>性别: {{judeSex()}}</div>
        <div>生日: {{this.getBirthday ? this.getBirthday: '无'}}</div>
      </div>
    </div>
    <div class="content-bottom">
      <van-cell-group>
        <van-button  @click="loginOut" size="normal">注销账号</van-button>
      </van-cell-group>
    </div>
    <!-- <FooterBottom></FooterBottom> -->
  </div>
</template>

<script>
import HeaderTop from '../components/HeaderTop'
import FooterBottom from '../components/FooterBottom'
import { mapGetters, mapMutations } from 'vuex'
import { formatTime, setStore, removeStore, IsPC } from '@/common/js/utils'
import {exitLogIn} from '@/api/login.js'
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
      return this.userInfo.birthday;
    }
  },

  mounted() {
   // 控制设备物理返回按键
   if (!IsPC) {
      let that = this;
      pushHistory()
      that.gotoURL(() => { 
        pushHistory()
        this.$router.push({path: 'home'});  //输入要返回的上一级路由地址
        this.changeTitleTxt({tit: '医废监测'});
        setStore('currentTitle','医废监测');
      });
      this.changeRouterFlag(true)
    }
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
      this.changeTitleTxt({tit:'医废监测'});
      setStore('currentTitle','医废监测');
    },

    // 判断性别
    judeSex () {
      let peoplesex;
      if (this.getGender == 0) {
        peoplesex = '未指定'
      } else if (this.getGender == 1) {
        peoplesex = '男'
      } else {
        peoplesex = '女'
      };
      return peoplesex
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

    // 判断可收集垃圾类型
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
        exitLogIn(this.userInfo.id).then((res) => {
          if (res.data.code == 200) {
            this.clearPartStorage();
            this.$router.replace({name:'login'})
          } else {
          }
        })
        .catch((err) => {
          this.$dialog.alert({
            message: `${err}`,
            closeOnPopstate: true
          }).then(() => {
          })
        })
      })
      .catch(() => {})
    },

    //清除部分存储信息
    clearPartStorage () {
      // 清除localStorage存储的用户信息
      removeStore('userName');
      removeStore('userPassword');
      removeStore('userInfo');
      removeStore('isLogin');
      // 清除当前用户h5存储的医废收集流程信息
      removeStore('currentCollectMsg');
      removeStore('currentStep');
      removeStore('weightMethods');
      removeStore('continueCurrentCollect');
      // 清除扫码字典数据
      removeStore('hospitalData');
      removeStore('careData');
      removeStore('departmentData');
      removeStore('pointData');
      removeStore('wasteTypeData');
      // 清除存储的收集批次号和顶部导航栏文字说明
      setStore('currentBatchNumber','');
      setStore('currentTitle','')
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
      flex:1;
      overflow: auto;
      .content-middle-top {
        margin-top: 10px;
        text-align: left;
        padding: 10px;
        span {
          display: inline-block;
          &:first-child {
            width: 90px;
            height: 90px;
            img {
              width: 100%;
              height: 100%;
              vertical-align: middle;
            }
          }
          &:last-child {
            margin-left: 10px;
            font-size: 19px;
            color: #090909;
            font-weight: bold;
          }
        }
      }
      .content-middle-medail {
        padding: 10px;
        div {
          color: #2f2f2f;
          font-weight: bold;
          line-height: 40px;
          font-size: 13px;
          text-align: left;
          word-wrap: break-word;
          .bottom-border-1px(#dadbdd)
        }
      }
    }
    .content-bottom {
      padding: 4px 0;
        .van-cell-group {
          margin: 0 auto;
          background-color: transparent;
          /deep/ .van-button {
          width: 100%;
          background: @color-theme;
          color: #fff;
          border-radius: 0;
          border: none;
          letter-spacing: 2px;
          text-indent: 2px
        }
        &:after {
          display: none
        }
      }
    }
  }
</style>
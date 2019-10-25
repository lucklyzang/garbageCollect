<template>
  <div class="content-wrapper">
    <HeaderTop :title="navTopTitle">
      <van-icon name="arrow-left" slot="left" @click="backTo"></van-icon> 
      <van-icon name="manager-o" slot="right" @click="skipMyInfo"></van-icon> 
    </HeaderTop>
    <div class="content-middle">
      <loading :isShow="showLoadingHint"></loading>
      <div class="content-middle-top">
        <div class="content-middle-top-content">
          <span class="time-between">至</span>
          <div style="left:0">
            <van-field v-model="startTime" placeholder="开始日期" readonly="readonly" @click="startTimePop = true" right-icon="newspaper-o"/>
          </div>
          <div style="right:0">
            <van-field v-model="endTime" placeholder="结束日期" readonly="readonly" @click="endTimePop = true" right-icon="newspaper-o"/>
          </div>
        </div>
        <van-popup v-model="startTimePop" label="离开时间" position="bottom" :overlay="true"> 
          <van-datetime-picker  v-model="currentDateStart"  type="date"  :min-date="minDateStart"
          @cancel="startTimePop = false"  @confirm="startTimePop = false"  @change="startTimeChange"/>
        </van-popup>
        <van-popup v-model="endTimePop" label="离开时间" position="bottom" :overlay="true"> 
          <van-datetime-picker  v-model="currentDateEnd"  type="date"  :min-date="minDateEnd"
          @cancel="endTimePop = false"  @confirm="endTimePop = false"  @change="endTimeChange"/>
        </van-popup>
        <p></p>
      </div>
      <van-tabs v-model="activeName"  @click="onClickTab">
        <van-tab name="0">
          <div slot="title">
            <span class="title">全部</span>
            <span class="right-sign sign-all" v-show="currentIndex == 0">{{signAll == '' ? 0 : signAll}}</span>
          </div>
          <div class="content-middle-list content-middle-list-warning">
            <div class="content-middle-list-item all-type" v-for="item in overtimeList">
              <div class="list-item">
                <p class="list-item-left">
                  预警类型: {{item.warnType}}
                </p>
                <p class="list-item-right">
                  所属医院: <span>{{item.proName}}</span>
                </p>
                <div class="list-strip">
                  <p class="list-times" v-if="item.warnId == 1">科室: {{item.depName}}</p>
                  <p class="list-times" v-if="item.warnId == 3">批次: {{item.batchNumber}}</p>
                  <p class="list-code">预警时间: {{item.createTime}}</p>
                </div>
                <div class="list-item-bottom">
                  收集人员: <span>{{item.workerName ? item.workerName : '无'}}</span>
                </div>
              </div>
            </div>
          </div>
        </van-tab>
        <van-tab name="1">
          <div slot="title">
            <span class="title">待处理</span>
            <span class="right-sign sign-deal" v-show="currentIndex == 1">{{signDeal =='' ? 0 : signDeal}}</span>
          </div>
          <div class="content-middle-list content-middle-list-warning">
            <div class="content-middle-list-item await-conduct" v-for="item in notExamineList" @click="skipHandlePage(item)">
              <div class="list-item">
                <p class="list-item-left">
                  预警类型: {{item.warnType}}
                </p>
                <p class="list-item-right">
                  所属医院: <span>{{item.proName}}</span>
                </p>
                <div class="list-strip">
                  <p class="list-times" v-if="item.warnId == 1">科室: {{item.depName}}</p>
                  <p class="list-times" v-if="item.warnId == 3">批次: {{item.batchNumber}}</p>
                  <p class="list-code">预警时间: {{item.createTime}}</p>
                </div>
                <div class="list-item-bottom">
                  收集人员: <span>{{item.workerName ? item.workerName : '无'}}</span>
                </div>
              </div>
            </div>
          </div>
        </van-tab>
        <van-tab name="2">
          <div slot="title">
            <span class="title">待审核</span>
            <span class="right-sign sign-check" v-show="currentIndex == 2">{{signCheck == '' ? 0 : signCheck}}</span>
          </div>
          <div class="content-middle-list content-middle-list-warning">
            <div class="content-middle-list-item await-check" v-for="item in finishList">
              <div class="list-item">
                <p class="list-item-left">
                  预警类型: {{item.warnType}}
                </p>
                <p class="list-item-right">
                  所属医院: <span>{{item.proName}}</span>
                </p>
                <div class="list-strip">
                  <p class="list-times" v-if="item.warnId == 1">科室: {{item.depName}}</p>
                  <p class="list-times" v-if="item.warnId == 3">批次: {{item.batchNumber}}</p>
                  <p class="list-sign">处理说明: {{item.warnReason}}</p>
                  <p class="list-times">处理人: {{item.dealName}}</p>
                  <p class="list-code">处理时间: {{item.dealTime}}</p>
                  <p class="list-code">预警时间: {{item.createTime}}</p>
                </div>
                <div class="list-item-bottom">
                  收集人员: <span>{{item.workerName ? item.workerName : '无'}}</span>
                </div>
              </div>
            </div>
          </div>
        </van-tab>
        <van-tab name="3">
          <div slot="title">
            <span class="title">已完成</span>
            <span class="right-sign sign-finish" v-show="currentIndex == 3">{{signFinish == '' ? 0 : signFinish}}</span>
          </div>
          <div class="content-middle-list content-middle-list-warning">
            <div class="content-middle-list-item finished" v-for="item in unFinishList">
              <div class="list-item">
                <p class="list-item-left">
                  预警类型: {{item.warnType}}
                </p>
                <p class="list-item-right">
                  所属医院: <span>{{item.proName}}</span>
                </p>
                <div class="list-strip">
                  <p class="list-times" v-if="item.warnId == 1">科室: {{item.depName}}</p>
                  <p class="list-times" v-if="item.warnId == 3">批次: {{item.batchNumber}}</p>
                  <p class="list-sign">审核意见: {{item.checkIdea}}</p>
                  <p class="list-sign">预警原因: {{item.warnReason}}</p>
                  <p class="list-times">审核人: {{item.checkName}}</p>
                  <p class="list-code">审核时间: {{item.checkTime}}</p>
                </div>
                <div class="list-item-bottom">
                  收集人员: <span>{{item.workerName ? item.workerName : '无'}}</span>
                </div>
              </div>
            </div>
          </div>
        </van-tab>
      </van-tabs>
    </div>
    <!-- <FooterBottom></FooterBottom> -->
  </div>
</template>

<script>
import HeaderTop from '../components/HeaderTop'
import FooterBottom from '../components/FooterBottom'
import { mapGetters, mapMutations } from 'vuex'
import Loading from '../components/Loading'
import {queryWarning, warningDispose} from '../api/rubbishCollect.js'
import { formatTime } from '@/common/js/utils'
export default {
   components:{
    HeaderTop,
    FooterBottom,
    Loading
  },
  data () {
    return {
      endTimePop: false,
      startTimePop: false,
      currentDateStart: '',
      currentId: '',
      currentDateEnd: '',
      startTime: '',
      endTime: '',
      topTitle: '医废收集',
      overtimeList: [],
      notExamineList: [],
      finishList: [],
      unFinishList: [],
      activeName: '0',
      handleMsg: '',
      checkMsg: '',
      clickQueryBtn: false,
      minDateStart: new Date(2018, 0, 1),
      minDateEnd: new Date(2018, 0, 1),
      signFinish: '',
      signAll: '',
      signDeal: '',
      signCheck: '',
      currentIndex: '',
      showLoadingHint: false
    };
  },
  computed: {
    ...mapGetters([
      'navTopTitle',
      'userInfo'
    ]),
    getUserInfo () {
      return this.userInfo.proId
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
    this.initDate();
    this.queryWarning(this.getUserInfo, formatTime('YYYY-MM-DD'), formatTime('YYYY-MM-DD'), '')
  },
  methods: {
    ...mapMutations([
      'changeTitleTxt',
      'storeWarningInfo',
      'initWaningInfo'
    ]),
    startTimeChange(e) { 
      let startTimeArr = e.getValues();//["2019", "03", "22", "17", "28"] 
      this.startTime = `${startTimeArr[0]}-${startTimeArr[1]}-${startTimeArr[2]}`
    },
    endTimeChange(e) {
      let endTimeArr = e.getValues();//["2019", "03", "22", "17", "28"] 
      this.endTime = `${endTimeArr[0]}-${endTimeArr[1]}-${endTimeArr[2]}`
    },
    // 返回上一页
    backTo () {
      this.$router.push({name:'home'});
      this.changeTitleTxt({tit:'医废监测'})
    },
    // 跳转到我的页面
    skipMyInfo () {
      this.$router.push({path: 'myInfo'});
      this.changeTitleTxt({tit:'我的'})
    },
    // 跳转到处理意见页面
    skipHandlePage (item) {
      this.initWaningInfo();
      this.storeWarningInfo(item);
      this.$router.push({path: 'handleIdea'})
      this.changeTitleTxt({tit:'填写处理信息'})
    },
    // 初始化时间显示框
    initDate () {
      let currentDateList = formatTime('YYYY-MM-DD').split('-');
      this.startTime = `${currentDateList[0]}-${currentDateList[1]}-${currentDateList[2]}`;
      this.endTime = `${currentDateList[0]}-${currentDateList[1]}-${currentDateList[2]}`
    },
    // 点击标签按钮事件
    onClickTab (name, title) {
      let state;
      this.currentIndex = name;
      switch (name) {
        case '0':
          state = ''
          break;
        case '1':
          state = 0
          break;
        case '2':
          state = 1
          break;
        case '3':
          state = 2
          break; 
      };
      this.initData();
      if (this.startTime == "" || this.endTime == "") {
        this.$dialog.alert({
            message: '请选择开始或结束日期',
            closeOnPopstate: true
          }).then(() => {
        });
      } else {
        this.queryWarning(this.userInfo.proId, this.startTime, this.endTime, state)
      }
    },

    // 查询预警批次
    queryWarning (proId,startDate,endDate,state) {
      this.initData();
      let warningInfo = {
        proId,  
        startDate,
        endDate, 
        warnId: '',
        workerId: '', //收集人员ID 
        depId: '',    //科室ID
        state  //状态
      };
      this.showLoadingHint = true;
      queryWarning(warningInfo).then((res) => {
        this.showLoadingHint = false;
        if (res) {
          if (res.data.code == 200) {
            if (state === '') {
              if (res.data.data.length > 0) {
                let outStorage = res.data.data;
                this.signAll = res.data.data.length;
                for (let item of outStorage) {
                  this.overtimeList.push({
                  'checkIdea': item.checkIdea,  //审核意见，
                  'checkName': item.checkName,  //审核人
                  'checkTime': item.checkTime,  //审核时间
                  'createTime': item.createTime, //预警时间
                  'dealIdea': item.dealIdea,    //处理意见
                  'dealName': item.dealName,  //处理人
                  'dealTime': item.dealTime,  //处理时间
                  'depName': item.depName,//部门 
                  'id': item.id,             //预警ID
                  'proId': item.proId,           //所属医院ID
                  'proName': item.proName,  //所属医院名称
                  'state': item.state,             //状态 0-待处理 1-待审核，2-已完成
                  'warnId': item.warnId,            //预警类型ID
                  'warnReason': item.warnReason,      //预警原因
                  'warnType': item.warnType, //预警类型描述
                  'workerId': item.workerId,          //收集人ID
                  'workerName': item.workerName, //收集人姓名
                  'batchNumber': item.batchNumber
                  })
                }
              } else {
                this.$dialog.alert({
                    message: '当前没有异常预警的的批次信息',
                    closeOnPopstate: true
                  }).then(() => {
                });
              }
            } else if (state === 0) {
              if (res.data.data.length > 0) {
                let outStorage = res.data.data;
                this.signDeal = res.data.data.length;
                for (let item of outStorage) {
                  this.notExamineList.push({
                  'checkIdea': item.checkIdea,  //审核意见，
                  'checkName': item.checkName,  //审核人
                  'checkTime': item.checkTime,  //审核时间
                  'createTime': item.createTime, //预警时间
                  'dealIdea': item.dealIdea,    //处理意见
                  'dealName': item.dealName,  //处理人
                  'dealTime': item.dealTime,  //处理时间
                  'depName': item.depName,//部门
                  'batchNumber': item.batchNumber, 
                  'id': item.id,             //预警ID
                  'proId': item.proId,           //所属医院ID
                  'proName': item.proName,  //所属医院名称
                  'state': item.state,             //状态 0-待处理 1-待审核，2-已完成
                  'warnId': item.warnId,            //预警类型ID
                  'warnReason': item.warnReason,      //预警原因
                  'warnType': item.warnType, //预警类型描述
                  'workerId': item.workerId,          //收集人ID
                  'workerName': item.workerName, //收集人姓名
                  })
                }
              } else {
                this.$dialog.alert({
                  message: '当前没有待处理的批次信息',
                  closeOnPopstate: true
                }).then(() => {
                });
              }
            } else if (state === 1) {
              if (res.data.data.length > 0) {
                let outStorage = res.data.data;
                this.signCheck = res.data.data.length;
                for (let item of outStorage) {
                  this.finishList.push({
                  'checkIdea': item.checkIdea,  //审核意见，
                  'checkName': item.checkName,  //审核人
                  'checkTime': item.checkTime,  //审核时间
                  'createTime': item.createTime, //预警时间
                  'dealIdea': item.dealIdea,    //处理意见
                  'dealName': item.dealName,  //处理人
                  'dealTime': item.dealTime,  //处理时间
                  'depName': item.depName,//部门
                  'batchNumber': item.batchNumber,
                  'id': item.id,             //预警ID
                  'proId': item.proId,           //所属医院ID
                  'proName': item.proName,  //所属医院名称
                  'state': item.state,             //状态 0-待处理 1-待审核，2-已完成
                  'warnId': item.warnId,            //预警类型ID
                  'warnReason': item.warnReason,      //预警原因
                  'warnType': item.warnType, //预警类型描述
                  'workerId': item.workerId,          //收集人ID
                  'workerName': item.workerName, //收集人姓名
                  })
                }
              } else {
                this.$dialog.alert({
                    message: '当前没有待审核的批次信息',
                    closeOnPopstate: true
                  }).then(() => {
                });
              }
            } else if (state === 2) {
              if (res.data.data.length > 0) {
                let outStorage = res.data.data;
                this.signFinish = res.data.data.length;
                for (let item of outStorage) {
                  this.unFinishList.push({
                  'checkIdea': item.checkIdea,  //审核意见，
                  'checkName': item.checkName,  //审核人
                  'checkTime': item.checkTime,  //审核时间
                  'createTime': item.createTime, //预警时间
                  'dealIdea': item.dealIdea,    //处理意见
                  'dealName': item.dealName,  //处理人
                  'dealTime': item.dealTime,  //处理时间
                  'depName': item.depName,//部门
                  'batchNumber': item.batchNumber, 
                  'id': item.id,             //预警ID
                  'proId': item.proId,           //所属医院ID
                  'proName': item.proName,  //所属医院名称
                  'state': item.state,             //状态 0-待处理 1-待审核，2-已完成
                  'warnId': item.warnId,            //预警类型ID
                  'warnReason': item.warnReason,      //预警原因
                  'warnType': item.warnType, //预警类型描述
                  'workerId': item.workerId,          //收集人ID
                  'workerName': item.workerName, //收集人姓名
                  })
                }
              } else {
                this.$dialog.alert({
                    message: '当前没有已完成的批次信息',
                    closeOnPopstate: true
                  }).then(() => {
                });
              }
            }
          }
        }
      })
      .catch((err)=>{
        this.showLoadingHint = false;
        this.$dialog.alert({
          message: `${err.message}`,
          closeOnPopstate: true
        }).then(() => {
        });
      })
    },
    // 初始化数据
    initData () {
      this.overtimeList = [];
      this.notExamineList = [];
      this.finishList = [];
      this.unFinishList = [];
      this.signFinish = '';
      this.signAll = '';
      this.signDeal =  '';
      this.signCheck = '';
    }
  }
}

</script>
<style lang='less' scoped>
@import "../common/stylus/variable.less";
@import "../common/stylus/modifyUi.less";
@import "../common/stylus/mixin.less";
  .content-wrapper {
     /deep/ .van-dialog {
      .van-dialog__content{
        margin-top: 10px !important
      }
    };
    .content-middle {
     .content-middle();
      /deep/ .van-tabs--line {
        margin-top: 4px;
        .van-tabs__line {
          background-color: @color-theme;
        }
      }
      .content-middle-top {
        background: #fff;
        margin-top: 3%;
        height: 52px;
        box-shadow: 0px 1px 3px 1px #e4e4e4,  /*下边阴影*/
          0px -1px 3px 0px #e4e4e4;   /*上边阴影*/
        /deep/ .van-cell {
          width: 100%;
          display: inline-block;
          padding: 10px 24px;
          border: 1px solid #d8d5d5;
          border-radius: 4px;
          line-height: 0;
        }
        .middle-top-search {
          position: absolute;
          top: 7px;
          right: 6px;
          button {
            background: @color-theme;
            border-color: @color-theme
          }
        }
        .content-middle-top-content {
          position: relative;
          height: 100%;
          width: 98%;
          margin: 0 auto;
          .time-between {
            color: black;
            position: absolute;
            top: 30.4%;
          }
          > div {
            width: 44%;
            position: absolute;
            top: 14%;
          }
        }
      }
      /deep/ .van-tabs {
        .right-sign {
         .repeat-sign
        }
      }
      .changeBtn {
        height: 40px;
        background: #fbfbfb;
        line-height: 40px;
        padding-left: 10px;
        /deep/ .van-icon {
          background: @color-theme;
          border-color: @color-theme
        }
      }
      .content-middle-list {
        overflow: auto;
       .content-middle-list-item {
          position: relative;
          box-sizing: border-box;
          padding: 20px 10px;
          height: auto;
          margin: 0 auto;
          background: #fff;
          margin-bottom: 20px;
          border-radius: 8px;
          box-shadow: 0 2.5px 12px 4px #d1d1d1;
          .bottom-border-1px(#d3d3d3);
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
            .list-item-right {
              position: absolute;
              top: 18px;
              right: 0;
              color: #bdbdbd;
              font-size: 12px;
              span {
                color: #c97889
              }
            }
            .list-strip {
              position: absolute;
              top: 20px;
              left: 0;
              color: #707070;
              font-size: 12px;
              margin-top: 12px;
              p {
                margin-top: 12px;
                text-align: left;
                &:first-child {
                  margin-top: 0
                }
              }
            }
            .list-item-bottom {
              position: absolute;
              bottom: 0;
              right: 0;
              color: #bdbdbd;
              font-size: 12px;
              span {
                color: #5d5d5d
              }
            }
          }
        }
        .await-check {
          height: 176px
        }
        .await-conduct {
          height: 110px
        }
        .finished {
          height: 176px
        }
        .all-type {
          height: 110px
        }
      }
      .btn-group {
        margin-top: 8px;
        text-align: center;
        p {
          button {
            background: @color-theme;
            border-color: @color-theme;
            padding: 0 120px;
          }
        }
      }
    }
  }
</style>
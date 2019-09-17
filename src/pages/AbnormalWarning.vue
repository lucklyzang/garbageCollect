<template>
  <div class="content-wrapper">
    <HeaderTop :title="navTopTitle">
      <van-icon name="arrow-left" slot="left" @click="backTo"></van-icon> 
      <van-icon name="manager-o" slot="right" @click="skipMyInfo"></van-icon> 
    </HeaderTop>
    <div class="content-middle">
      <div class="content-middle-top">
        <van-field v-model="startTime" placeholder="开始日期" readonly="readonly" @click="startTimePop = true"/>
        <van-popup v-model="startTimePop" label="离开时间" position="bottom" :overlay="true"> 
          <van-datetime-picker  v-model="currentDateStart"  type="date"  :min-date="minDateStart"
          @cancel="startTimePop = false"  @confirm="startTimePop = false"  @change="startTimeChange"/>
        </van-popup>
        <van-field v-model="endTime" placeholder="结束日期" readonly="readonly" @click="endTimePop = true"/>
        <van-popup v-model="endTimePop" label="离开时间" position="bottom" :overlay="true"> 
          <van-datetime-picker  v-model="currentDateEnd"  type="date"  :min-date="minDateEnd"
          @cancel="endTimePop = false"  @confirm="endTimePop = false"  @change="endTimeChange"/>
        </van-popup>
        <p></p>
      </div>
      <van-tabs v-model="activeName"  @click="onClickTab">
        <van-tab title="全部" name="0">
          <div class="content-middle-list">
            <div class="content-middle-list-item all-type" v-for="item in overtimeList">
              <div class="list-item">
                <p class="list-item-left">
                  预警类型: {{item.warnType}}
                </p>
                <p class="list-item-right">
                  所属医院: <span>{{item.proName}}</span>
                </p>
                <div class="list-strip">
                  <p class="list-sign">批次号: {{item.batchNumber}}</p>
                  <p class="list-times">处理人: {{item.dealName}}</p>
                  <p class="list-code">预警时间: {{item.createTime}}</p>
                </div>
                <div class="list-item-bottom">
                  收集人员: <span>{{item.workerName}}</span>
                </div>
              </div>
            </div>
          </div>
        </van-tab>
        <van-tab title="待处理" name="1">
          <div class="content-middle-list">
            <div class="content-middle-list-item await-conduct" v-for="item in notExamineList" @click="skipHandlePage(item)">
              <div class="list-item">
                <p class="list-item-left">
                  预警类型: {{item.warnType}}
                </p>
                <p class="list-item-right">
                  所属医院: <span>{{item.proName}}</span>
                </p>
                <div class="list-strip">
                  <p class="list-sign">批次号: {{item.batchNumber}}</p>
                  <p class="list-sign">预警原因: {{item.warnReason}}</p>
                  <p class="list-times">处理人: {{item.dealName}}</p>
                  <p class="list-code">处理时间: {{item.dealTime}}</p>
                </div>
                <div class="list-item-bottom">
                  收集人员: <span>{{item.workerName}}</span>
                </div>
              </div>
            </div>
          </div>
        </van-tab>
        <van-tab title="待审核" name="2">
          <div class="content-middle-list">
            <div class="content-middle-list-item await-check" v-for="item in finishList">
              <div class="list-item">
                <p class="list-item-left">
                  预警类型: {{item.warnType}}
                </p>
                <p class="list-item-right">
                  所属医院: <span>{{item.proName}}</span>
                </p>
                <div class="list-strip">
                  <p class="list-sign">批次号: {{item.batchNumber}}</p>
                  <p class="list-sign">处理意见: {{item.warnReason}}</p>
                  <p class="list-times">处理人: {{item.dealName}}</p>
                  <p class="list-code">处理时间: {{item.dealTime}}</p>
                  <p class="list-code">收集时间: {{item.createTime}}</p>
                </div>
                <div class="list-item-bottom">
                  收集人员: <span>{{item.workerName}}</span>
                </div>
              </div>
            </div>
          </div>
        </van-tab>
        <van-tab title="已完成" name="3">
          <div class="content-middle-list">
            <div class="content-middle-list-item finished" v-for="item in unFinishList">
              <div class="list-item">
                <p class="list-item-left">
                  预警类型: {{item.warnType}}
                </p>
                <p class="list-item-right">
                  所属医院: <span>{{item.proName}}</span>
                </p>
                <div class="list-strip">
                  <p class="list-sign">批次号: {{item.batchNumber}}</p>
                  <p class="list-sign">审核意见: {{item.checkIdea}}</p>
                  <p class="list-sign">预警原因: {{item.warnReason}}</p>
                  <p class="list-times">审核人: {{item.checkName}}</p>
                  <p class="list-code">审核时间: {{item.checkTime}}</p>
                </div>
                <div class="list-item-bottom">
                  收集人员: <span>{{item.workerName}}</span>
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
import {queryWarning, warningDispose} from '../api/rubbishCollect.js'
import { pushHistory } from '@/common/js/utils'
export default {
   components:{
    HeaderTop,
    FooterBottom
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
      minDateEnd: new Date(2018, 0, 1)
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
    pushHistory();
    window.onpopstate = () => {
      this.$router.push({path: 'home'});  //输入要返回的上一级路由地址
      this.changeTitleTxt({tit: '医废监测'})
    };
    this.initDate();
    this.queryWarning(this.getUserInfo, this.formatTime(), this.formatTime(), '')
  },
  methods: {
    ...mapMutations([
      'changeTitleTxt',
      'storeWarningInfo'
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
      this.storeWarningInfo(item);
      this.$router.push({path: 'handleIdea'})
      this.changeTitleTxt({tit:'填写处理信息'})
    },
    // 初始化时间显示框
    initDate () {
      let currentDateList = this.formatTime().split('-');
      this.startTime = `${currentDateList[0]}-${currentDateList[1]}-${currentDateList[2]}`;
      this.endTime = `${currentDateList[0]}-${currentDateList[1]}-${currentDateList[2]}`
    },
    // 点击标签按钮事件
    onClickTab (name, title) {
      let state;
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
      this.overtimeList = [];
      this.notExamineList = [];
      this.finishList = [];
      this.unFinishList = [];
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
      this.overtimeList = [];
      this.notExamineList = [];
      this.finishList = [];
      this.unFinishList = [];
      let warningInfo = {
        proId,  
        startDate,
        endDate, 
        warnId: '',
        workerId: '', //收集人员ID 
        depId: '',    //科室ID
        state  //状态
      };
      queryWarning(warningInfo).then((res) => {
        if (res) {
          if (res.data.code == 200) {
            if (state === '') {
              if (res.data.data.length > 0) {
                let outStorage = res.data.data;
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
        this.$dialog.alert({
          message: `${err.message}`,
          closeOnPopstate: true
        }).then(() => {
        });
      })
    },
    // 时间格式方法1
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
    };
     /deep/ .van-dialog {
      .van-dialog__content{
        margin-top: 10px !important
      }
    };
    .content-middle {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      margin-top: 60px;
      background: #fff;
      /deep/ .van-tabs--line {
        margin-top: 4px;
        .van-tabs__line {
          background-color: @color-theme;
        }
        .van-tabs__content {
          // margin-top: 10px;
        }
      }
      .content-middle-top {
        position: relative;
        /deep/ .van-cell {
          width: 40%;
          display: inline-block
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
        height: 76vh;
        overflow: auto;
       .content-middle-list-item {
          padding: 14px;
          height: 140px;
          border-bottom: 1px solid #e8e4e4;
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
              top: 4px;
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
          height: 156px
        }
        .await-conduct {
          height: 144px
        }
        .finished {
          height: 156px
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
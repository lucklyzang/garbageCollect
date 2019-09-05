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
          <van-datetime-picker  v-model="currentDateStart"  type="date"  :min-date="minDate"
          @cancel="startTimePop = false"  @confirm="startTimePop = false"  @change="startTimeChange"/>
        </van-popup>
        <van-field v-model="endTime" placeholder="结束日期" readonly="readonly" @click="endTimePop = true"/>
        <van-popup v-model="endTimePop" label="离开时间" position="bottom" :overlay="true"> 
          <van-datetime-picker  v-model="currentDateEnd"  type="date"  
          @cancel="endTimePop = false"  @confirm="endTimePop = false"  @change="endTimeChange"/>
        </van-popup>
        <p class="middle-top-search">
          <van-button type="info" size="small" @click="searchWarning(startTime,endTime)">搜索</van-button>
        </p>
      </div>
      <div class="content-middle-list">
        <div class="content-middle-list-item" v-for="item in overtimeList">
          <div class="list-item">
            <p class="list-item-left">
              预警类型: {{item.warnType}}
            </p>
            <p class="list-item-right">
              所属医院: <span>{{item.proName}}</span>
            </p>
            <div class="list-strip">
              <p>科室: {{item.depName}}</p>
              <p class="list-sign">预警原因: {{item.warnReason}}</p>
              <p class="list-times">处理人: {{item.dealName}}</p>
              <p class="list-code">预警时间: {{item.createTime}}</p>
            </div>
            <div class="list-item-bottom">
              收集人员: <span>{{item.workerName}}</span>
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
import {queryWarning} from '../api/rubbishCollect.js'
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
      currentDateEnd: '',
      startTime: '',
      endTime: '',
      topTitle: '医废收集',
      overtimeList: [],
      clickQueryBtn: false,
      minDate: new Date(2018, 0, 1)
    };
  },
  computed: {
    ...mapGetters([
      'navTopTitle',
      'userInfo'
    ])
  },

  mounted() {
    pushHistory();
    window.onpopstate = () => {
      this.$router.push({path: 'home'});  //输入要返回的上一级路由地址
      this.changeTitleTxt({tit: '医废监测'})
    };
    this.initDate();
    this.queryWarning();
  },
  methods: {
    ...mapMutations([
      'changeTitleTxt'
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
      this.$router.go(-1);
      this.changeTitleTxt({tit:'医废监测'})
    },
    // 跳转到我的页面
    skipMyInfo () {
      this.$router.push({path: 'myInfo'});
      this.changeTitleTxt({tit:'我的'})
    },
    // 初始化时间显示框
    initDate () {
      let currentDateList = this.formatTime().split('-');
      this.startTime = `${currentDateList[0]}-${currentDateList[1]}-${currentDateList[2]}`;
      this.endTime = `${currentDateList[0]}-${currentDateList[1]}-${currentDateList[2]}`
    },
    searchWarning (startTime,endTime) {
      if (this.startTime == '' || this.endTime == '') {
        this.$dialog.alert({
          message: '开始或结束日期不能为空'
        }).then(() => {
        });
      } else {
        this.queryWarning(startTime,endTime)
      }
    },
    // 查询预警批次
    queryWarning (startTime = this.formatTime(), endTime = this.formatTime()) {
      this.overtimeList = [];
      let warningInfo = {
        proId: this.userInfo.proId,  
        startDate: startTime,
        endDate:  endTime, 
        warnId: 3,
        workerId: '',    //收集人员ID 
        depId: '',       //科室ID
        state: '',       //状态
      };
      queryWarning(warningInfo).then((res) => {
        if (res) {
          if (res.data.code == 200) {
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
                })
              }
            } else {
               this.$dialog.alert({
                  message: '当前没有预警的批次信息'
                }).then(() => {
                // this.$router.push({path: 'home'});
                // this.changeTitleTxt({tit: '医废监测'})
              });
            }
          }
        }
      })
      .catch((err)=>{
        console.log(err)
      })
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
      background: #fff;
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
        height: 500px;
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
              top: 0;
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
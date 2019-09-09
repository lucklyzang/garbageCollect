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
        <p class="middle-top-search">
          <van-button type="info" size="small" @click="searchOutStorage(startTime,endTime)">搜索</van-button>
        </p>
      </div>
      <div class="changeBtn">
        <van-checkbox v-model="checkedAll" @click="toggleCheckedAll">全选</van-checkbox>
      </div>
      <div class="content-middle-list">
        <div class="content-middle-list-item" v-for="item in classList">
          <div class="change-btn-position">
            <van-checkbox v-model="item.check"  @change="oneChecked(item.check)"></van-checkbox>
          </div>
          <div class="list-item">
            <p class="list-item-left">回收趟次: {{item.batchNumber}}</p>
            <div class="list-strip">
              <p class="list-times">收集人员: {{item.inWorkerName}}</p>
              <p class="list-code">时间: {{item.inTime}}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="btn-group">
        <p>
          <van-button type="info" @click="sureInStorage" size="normal">确定出库</van-button>
        </p>
      </div>
    </div>
    <!-- <FooterBottom></FooterBottom> -->
  </div>
</template>

<script>
import HeaderTop from '../components/HeaderTop'
import FooterBottom from '../components/FooterBottom'
import { mapGetters, mapMutations } from 'vuex'
import {queryOutStorage} from '../api/rubbishCollect.js'
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
      stagingMsg: '',
      checkedAll: false,
      classList: [],
      totalWeight: 0,
      batchsArray: [],
      minDateStart: new Date(2018, 0, 1),
      minDateEnd: new Date(2018, 0, 1)
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
    this.queryNotInStorage();
  },
  methods: {
    ...mapMutations([
      'changeTitleTxt',
      'changeTotalWeight',
      'changeBatchs',
      'initTotalWeight',
      'initBatchs'

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
    searchOutStorage (startTime,endTime) {
      if (this.startTime == '' || this.endTime == '') {
        this.$dialog.alert({
          message: '开始或结束日期不能为空'
        }).then(() => {
        });
      } else {
        this.queryNotInStorage(startTime,endTime)
      }
    },
    // 跳转到我的页面
    skipMyInfo () {
      this.$router.push({path: 'myInfo'});
      this.changeTitleTxt({tit:'我的'})
    },
    //确定入库
    sureInStorage () {
      this.initTotalWeight();
      this.initBatchs();
      let outStorageArray = this.classList.filter((item)=>{
        return item.check == true
      });
      if (outStorageArray.length == 0) {
        this.$dialog.alert({
          message: '请选择要出库的批次'
        }).then(() => {
        });
      } else {
        for (let item of outStorageArray) {
          this.totalWeight += item.trashHeight;
          this.batchsArray.push(item.batchNumber)
        };
        this.changeTotalWeight(this.totalWeight);
        this.changeBatchs(this.batchsArray);
        this.$router.push({path:'medicalInStorageIncrease'});
        this.changeTitleTxt({tit: '医废入库新增'});
      }
    },
    // 全选操作
    toggleCheckedAll(){
       if(this.checkedAll){
          this.classList.forEach((item)=>{
            item.check = false  
          })
          this.checkedAll = false
       }else{
          this.classList.forEach((item)=>{
            item.check = true  
          })
          this.checkedAll = true
       }
     },
    // 单选操作
     oneChecked(cart){
       if(!cart){
        this.checkedAll = false
       }
       let isExitCheckedNo = this.classList.every(item=>{
          return item.check == true     
       });
       if(isExitCheckedNo){
          this.checkedAll = true    
       }else{
          this.checkedAll = false
       }
    },
    
    // 初始化时间显示框
    initDate () {
      let currentDateList = this.formatTime().split('-');
      this.startTime = `${currentDateList[0]}-${currentDateList[1]}-${currentDateList[2]}`;
      this.endTime = `${currentDateList[0]}-${currentDateList[1]}-${currentDateList[2]}`
    },

    // 查询未出库批次
    queryNotInStorage (startTime = this.formatTime(), endTime = this.formatTime()) {
      this.classList = [];
      let batchInfo = {
        proId: this.userInfo.proId,  
        startDate: startTime,
        endDate:  endTime, 
        state: '', 
      };
      queryOutStorage(batchInfo).then((res) => {
        if (res) {
          if (res.data.code == 200) {
            if (res.data.data.length > 0) {
              let outStorage = res.data.data;
              for (let item of outStorage) {
                this.classList.push({
                  batchNumber: item.batchNumber,
                  inWorkerName: item.inWorkerName,
                  inTime: item.inTime,
                  trashHeight: item.inTotalWeight,
                  check: false
                })
              }
            } else {
               this.$dialog.alert({
                  message: '当前没有待出库的批次'
                }).then(() => {
                  this.$router.push({path: 'home'});
                  this.changeTitleTxt({tit: '医废监测'})
              });
            }
          }
        }
      })
      .catch((err)=>{
        this.$dialog.alert({
          message: `${err.message}`
        }).then(() => {
        });
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
        height: 385px;
        overflow: auto;
        .content-middle-list-item {
          position: relative;
          box-sizing: border-box;
          padding: 10px 10px;
          height: 100px;
          border-bottom: 1px solid #e8e4e4;
          .change-btn-position {
            position: absolute;
            top: 30px;
            left: 10px;
            /deep/ .van-icon {
              background: @color-theme;
              border-color: @color-theme
            }
          }
          .list-item {
            position: relative;
            height: 100%;
            margin-left: 30px;
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
              bottom: 2px;
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
        position: fixed;
        left: 0;
        bottom: 10px;
        width: 100%;
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
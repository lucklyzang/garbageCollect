<template>
  <div class="content-wrapper">
    <HeaderTop :title="navTopTitle">
      <van-icon name="arrow-left" slot="left" @click="backTo"></van-icon> 
      <van-icon name="manager-o" slot="right" @click="skipMyInfo"></van-icon> 
    </HeaderTop>
    <ul class="left-dropDown" v-show="leftDownShow">
      <li v-for="(item, index) in leftDropdownDataList" :key="index" :class="{liStyle:liIndex == index}" @click="leftLiCLick(index)">{{item}}</li>
    </ul>
    <loading :isShow="showLoadingHint"></loading>
    <div class="content-middle-top content-middle-top-outStorage">
      <span class="time-between-outstorage">至</span>
      <div class="content-middle-top-content content-middle-top-content-outstorage">
        <div class="left-time">
          <van-field v-model="startTime" placeholder="开始日期" readonly="readonly" @click="startTimePop = true" right-icon="newspaper-o"/>
        </div>
        <div class="right-time">
          <van-field v-model="endTime" placeholder="结束日期" readonly="readonly" @click="endTimePop = true" right-icon="newspaper-o"/>
        </div>
      </div>
      <p class="middle-top-search middle-top-search-outStorage">
        <van-button type="info" size="small" @click="searchOutStorage(startTime,endTime)">搜索</van-button>
      </p>
      <van-popup v-model="startTimePop" label="离开时间" position="bottom" :overlay="true"> 
        <van-datetime-picker  v-model="currentDateStart"  type="date"  :min-date="minDateStart"
        @cancel="startTimePop = false"  @confirm="startTimePop = false"  @change="startTimeChange"/>
      </van-popup>
      <van-popup v-model="endTimePop" label="离开时间" position="bottom" :overlay="true"> 
        <van-datetime-picker  v-model="currentDateEnd"  type="date"  :min-date="minDateEnd"
        @cancel="endTimePop = false"  @confirm="endTimePop = false"  @change="endTimeChange"/>
      </van-popup>
    </div>
    <div class="changeBtn">
      <van-checkbox v-model="checkedAll" @click="toggleCheckedAll">全选</van-checkbox>
    </div>
    <div class="content-middle">
      <div class="content-middle-list content-middle-list-outStorage">
        <div class="content-middle-list-item" v-for="(item,index) in classList"  :key="index">
          <div class="change-btn-position">
            <van-checkbox v-model="item.check"  @change="oneChecked(item.check)"></van-checkbox>
          </div>
          <div class="list-item">
            <p class="list-item-left">回收批次: {{item.batchNumber}}</p>
            <p class="list-item-right">
              重量: <span>{{item.trashHeight}}kg</span>
            </p>
            <div class="list-strip">
              <p class="list-times">收集人员: {{item.inWorkerName}}</p>
              <p class="list-code">时间: {{item.inTime}}</p>
              <p class="list-code">包数: {{item.totalCount}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="btn-group">
      <p>
        <van-button type="info" @click="sureInStorage" size="normal">确定出库</van-button>
      </p>
    </div>
    <!-- <FooterBottom></FooterBottom> -->
  </div>
</template>

<script>
import HeaderTop from '../components/HeaderTop'
import FooterBottom from '../components/FooterBottom'
import Loading from '../components/Loading'
import { mapGetters, mapMutations } from 'vuex'
import {queryOutStorage} from '../api/rubbishCollect.js'
import {getDictionaryData} from '@/api/login.js'
import { formatTime, setStore, IsPC, removeStore } from '@/common/js/utils'
export default {
   components:{
    HeaderTop,
    FooterBottom,
    Loading
  },
  data () {
    return {
      leftDownShow: false,
      liIndex: null,
      leftDropdownDataList: ['刷新','我的', '测试'],
      endTimePop: false,
      startTimePop: false,
      currentDateStart: new Date(),
      currentDateEnd: new Date(),
      startTime: '',
      endTime: '',
      topTitle: '医废收集',
      stagingMsg: '',
      checkedAll: false,
      showLoadingHint: false,
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
    // 控制设备物理返回按键
    if (!IsPC()) {
      let that = this;
      pushHistory();
      that.gotoURL(() => { 
        pushHistory()
        this.$router.push({path: 'home'});  //输入要返回的上一级路由地址
        this.changeTitleTxt({tit: '医废监测'});
        setStore('currentTitle','医废监测');
      });
    };
    this.initDate();
    this.queryNotInStorage()
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
      this.$router.push({name:'home'});
      this.changeTitleTxt({tit:'医废监测'});
      setStore('currentTitle','医废监测');
    },
    searchOutStorage (startTime,endTime) {
      if (this.startTime == '' || this.endTime == '') {
        this.$dialog.alert({
          message: '开始或结束日期不能为空',
          closeOnPopstate: true
        }).then(() => {
        });
      } else {
        this.checkedAll = false;
        this.queryNotInStorage(startTime,endTime)
      }
    },
    // 右边下拉框菜单点击
    leftLiCLick (index) {
      this.liIndex = index;
      if (this.liIndex == 1) {
        this.$router.push({path: 'myInfo'});
        this.changeTitleTxt({tit:'我的'});
        setStore('currentTitle','我的')
      } else if (this.liIndex == 0) {
        // 清除扫码字典数据
        removeStore('hospitalData');
        removeStore('careData');
        removeStore('departmentData');
        removeStore('pointData');
        removeStore('wasteTypeData');
        // 请求科室字典数据
        getDictionaryData(this.userInfo.proId).then((res) => {
          if (res && res.data.code == 200) {
            this.$dialog.alert({
              message: '刷新完毕',
              closeOnPopstate: true
            })
            .then(()=>{
              this.leftDownShow = false;
            });
            // 存入医院数据
            setStore('hospitalData', res.data.data['hospital']);
            // 存入医护数据
            setStore('careData', res.data.data['cares']);
            // 存入科室数据
            setStore('departmentData', res.data.data['departments'])
            // 存入暂存点数据
            setStore('pointData', res.data.data['points'])
            // 存入医废类型数据
            setStore('wasteTypeData', res.data.data['wasteType'])
          }
        })
      } else if (this.liIndex == 2) {
        this.$router.push({path: 'testPage'});
        this.changeTitleTxt({tit:'测试页'});
        setStore('currentTitle','测试页')
      }
    },

    // 跳转到我的页面
    skipMyInfo () {
      this.leftDownShow = !this.leftDownShow;
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
          message: '请选择要出库的批次',
          closeOnPopstate: true
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
        this.changeTitleTxt({tit: '医废出库新增'});
        setStore('currentTitle','医废入出新增');
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
      let currentDateList = formatTime('YYYY-MM-DD').split('-');
      this.startTime = `${currentDateList[0]}-${currentDateList[1]}-${currentDateList[2]}`;
      this.endTime = `${currentDateList[0]}-${currentDateList[1]}-${currentDateList[2]}`
    },

    // 查询未出库批次
    queryNotInStorage (startTime = formatTime('YYYY-MM-DD'), endTime = formatTime('YYYY-MM-DD')) {
      this.classList = [];
      let batchInfo = {
        proId: this.userInfo.proId,  
        startDate: startTime,
        endDate:  endTime, 
        state: '', 
      };
      this.showLoadingHint = true;
      queryOutStorage(batchInfo).then((res) => {
        this.showLoadingHint = false;
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
                  totalCount: item.totalCount,
                  check: false
                })
              }
            } else {
               this.$dialog.alert({
                  message: '当前没有待出库的批次',
                  closeOnPopstate: true
                }).then(() => {
              });
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
    }
  }
}

</script>
<style lang='less' scoped>
@import "../common/stylus/variable.less";
@import "../common/stylus/modifyUi.less";
@import "../common/stylus/mixin.less";
  .content-wrapper {
    .content-wrapper();
    .left-dropDown {
      .rightDropDown
    }
    .content-middle {
      flex:1;
      overflow: auto;
      .content-middle-list {
        height: 100%;
        .content-middle-list-item {
          position: relative;
          box-sizing: border-box;
          padding: 20px 10px;
          height: auto;
          margin: 0 auto;
          height: 150px;
          background: #fff;
          margin-bottom: 20px;
          border-radius: 8px;
          box-shadow: 0 2.5px 12px 4px #d1d1d1;
          .bottom-border-1px(#d3d3d3);
          .change-btn-position {
            position: absolute;
            top: 80px;
            right: 10px;
            z-index: 1000;
            /deep/ .van-icon {
              background: @color-theme;
              border-color: @color-theme
            }
          }
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
              bottom: 2px;
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
          }
        }
      }
    }
    .content-middle-top {
      background: #fff;
      position: relative;
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
        top: 10px;
        display: inline-block;
        right: 10px;
        button {
          background: @color-theme;
          border-color: @color-theme
        }
      }
      .content-middle-top-content {
        position: relative;
        margin: 0 auto;
        height: 100%;
        > div {
          position: absolute;
          top: 14%;
        }
      }
    }
    .changeBtn {
      height: 40px;
      background: #fbfbfb;
      line-height: 40px;
      padding-left: 10px;
      padding-top: 11px;
      box-sizing: border-box;
      /deep/ .van-icon {
        background: @color-theme;
        border-color: @color-theme
      }
    }
    .btn-group {
      padding: 4px 0;
      text-align: center;
      p {
        button {
          background: @color-theme;
          border-color: @color-theme;
          letter-spacing: 2px;
          text-indent: 2px;
          padding: 0 120px
        }
      }
    }
  }
</style>
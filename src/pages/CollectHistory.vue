<template>
  <div class="content-wrapper">
    <HeaderTop :title="navTopTitle">
      <van-icon name="arrow-left" slot="left" @click="backTo"></van-icon> 
      <van-icon name="manager-o" slot="right" @click="skipMyInfo"></van-icon>
    </HeaderTop>
    <div class="content-middle">
      <loading :isShow="showLoadingHint"></loading>
      <div class="content-middle-top">
        <span class="time-between">至</span>
        <div class="content-middle-top-content">
          <div style="left:0">
            <van-field v-model="startTime" placeholder="开始日期" readonly="readonly" @click="startTimePop = true" right-icon="newspaper-o"/>
          </div>
          <div style="right:0">
            <van-field v-model="endTime" placeholder="结束日期" readonly="readonly" @click="endTimePop = true" right-icon="newspaper-o"/>
          </div>
          <p class="middle-top-search" v-show="false">
            <van-button type="info" size="small">搜索</van-button>
          </p>
        </div>
        <van-popup v-model="startTimePop" label="离开时间" position="bottom" :overlay="true"> 
          <van-datetime-picker  v-model="currentDateStart"  type="date"  :min-date="minDateStart"
          @cancel="startTimePop = false"  @confirm="startTimePop = false"  @change="startTimeChange"/>
        </van-popup>
        <van-popup v-model="endTimePop" label="离开时间" position="bottom" :overlay="true"> 
          <van-datetime-picker  v-model="currentDateEnd"  type="date"  :min-date="minDateEnd"
          @cancel="endTimePop = false"  @confirm="endTimePop = false"  @change="endTimeChange"/>
        </van-popup>
      </div>
      <van-tabs v-model="activeName" @click="onClickTab">
        <van-tab name="0">
          <div slot="title">
            <span class="title">未入库</span>
            <span class="right-sign sign-not-in" v-show="currentIndex == 0">{{signNotIn == '' ? 0 : signNotIn}}</span>
          </div>
          <div class="content-middle-list content-middle-list-warning">
            <div class="content-middle-list-item not-inStorage" v-for="item in notInStorageList" @click="skipDetail(item)">
              <div class="list-item">
                <p class="list-item-left">批次: {{item.batchNumber}}</p>
                <p class="list-item-right">
                  重量: <span>{{item.totalWeight}}kg</span>
                </p>
                <div class="list-strip">
                  <p>医院: {{item.proName}}</p>
                  <p class="list-sign">入库人: {{item.inWorkerName}}</p>
                </div>
              </div>
            </div>
          </div>
        </van-tab>
        <van-tab name="1">
          <div slot="title">
            <span class="title">已入库</span>
            <span class="right-sign sign-in" v-show="currentIndex == 1">{{signIn == '' ? 0 : signIn}}</span>
          </div>
          <div class="content-middle-list content-middle-list-warning">
            <div class="content-middle-list-item inStorage" v-for="item in inStorageList" @click="skipDetail(item)">
              <div class="list-item">
                <p class="list-item-left">批次: {{item.batchNumber}}</p>
                <p class="list-item-right">
                  入库重量: <span>{{item.inTotalWeight}}kg</span>
                </p>
                <div class="list-strip">
                  <p>医院: {{item.proName}}</p>
                  <p class="list-sign">入库人: {{item.inWorkerName}}</p>
                  <p class="list-times">入库时间: {{item.inTime}}</p>
                </div>
              </div>
            </div>
          </div>
        </van-tab>
        <van-tab  name="2">
          <div slot="title">
            <span class="title">已出库</span>
            <span class="right-sign sign-out" v-show="currentIndex == 2">{{signOut == '' ? 0 : signOut}}</span>
          </div>
           <div class="content-middle-list content-middle-list-warning">
            <div class="content-middle-list-item out-storage" v-for="item in outStorageList" @click="skipDetail(item)">
              <div class="list-item">
                <p class="list-item-left">批次: {{item.batchNumber}}</p>
                <p class="list-item-right">
                  出库重量: <span>{{item.outTotalWeight}}kg</span>
                </p>
                <div class="list-strip">
                  <p>医院: {{item.proName}}</p>
                  <p class="list-sign">入库人: {{item.inWorkerName}}</p>
                  <p class="list-times">交接公司: {{item.company ? item.company : '无'}}</p>
                  <p class="list-code">收集车号: {{item.cardNumber}}</p>
                  <p class="list-code">出库时间: {{item.outTime}}</p>
                </div>
                <div class="list-item-bottom">
                  交接人员: <span>{{item.companyName}}</span>
                </div>
              </div>
            </div>
          </div>
        </van-tab>
        <van-tab  name="3">
          <div slot="title">
            <span class="title">已完成</span>
            <span class="right-sign sign-finish" v-show="currentIndex == 3">{{signFinish == '' ? 0 : signFinish}}</span>
          </div>
          <div class="content-middle-list content-middle-list-warning">
            <div class="content-middle-list-item in-finished" v-for="item in finishList" @click="skipDetail(item)">
              <div class="list-item">
                <p class="list-item-left">批次: {{item.batchNumber}}</p>
                <p class="list-item-right">
                  重量: <span>{{item.outTotalWeight}}kg</span>
                </p>
                <div class="list-strip">
                  <p>医院: {{item.proName}}</p>
                  <p class="list-sign">入库人: {{item.inWorkerName}}</p>
                  <p class="list-times">入库时间: {{item.inTime}}</p>
                  <p class="list-code">出库时间: {{item.outTime ? item.outTime : '无'}}</p>
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
import { formatTime, setStore, IsPC } from '@/common/js/utils'
import {queryCollectHistory} from '../api/rubbishCollect.js'
export default {
  components: {
    HeaderTop,
    FooterBottom,
    Loading
  },
  data () {
    return {
      endTimePop: false,
      startTimePop: false,
      showLoadingHint: false,
      currentDateStart: '',
      currentDateEnd: '',
      startTime: '',
      endTime: '',
      topTitle: '医废收集',
      notInStorageList: [],
      inStorageList: [],
      outStorageList: [],
      finishList: [],
      currentName: 0,
      activeName: 0,
      minDateStart: new Date(2018, 0, 1),
      minDateEnd: new Date(2018, 0, 1),
      currentIndex: '',
      signNotIn: '',
      signIn: '',
      signOut: '',
      signFinish: ''
    };
  },
  computed: {
    ...mapGetters([
      'navTopTitle',
      'userInfo',
      'isCall'
    ]),
    getUserInfo () {
      return this.userInfo.proId
    }
  },

  mounted () {
    // 控制设备物理返回按键
    if (!IsPC()) {
      this.monitorBack()
    };
    this.initMethod()
  },

  // 由于该页面被缓存,调用activated钩子函数保证每次组件切换时,监听物理返回按键的方法都会执行
  activated () {
    // 控制设备物理返回按键
    if (!IsPC()) {
      this.monitorBack()
    };
    if (this.isCall) {
      this.initMethod()
    }
  },

  methods: {
    ...mapMutations([
      'changeTitleTxt',
      'storeCollectInfo',
      'storeCurrentName',
      'initCollectInfo'
    ]),
    // 返回上一页
    backTo () {
      this.$router.push({name:'home'});
      this.changeTitleTxt({tit:'医废监测'});
      setStore('currentTitle','医废监测');
    },
    // 跳转到我的页面
    skipMyInfo () {
      this.$router.push({path: 'myInfo'});
      this.changeTitleTxt({tit:'我的'});
      setStore('currentTitle','我的');
    },
    startTimeChange(e) { 
      let startTimeArr = e.getValues();//["2019", "03", "22", "17", "28"] 
      this.startTime = `${startTimeArr[0]}-${startTimeArr[1]}-${startTimeArr[2]}`
    },
    endTimeChange(e) {
      let endTimeArr = e.getValues();//["2019", "03", "22", "17", "28"] 
      this.endTime = `${endTimeArr[0]}-${endTimeArr[1]}-${endTimeArr[2]}`
    },
    // 初始化时间显示框
    initDate () {
      let currentDateList = formatTime('YYYY-MM-DD').split('-');
      this.startTime = `${currentDateList[0]}-${currentDateList[1]}-${currentDateList[2]}`;
      this.endTime = `${currentDateList[0]}-${currentDateList[1]}-${currentDateList[2]}`
    },
    // 跳转到详情页
    skipDetail (item) {
      this.initCollectInfo();
      this.storeCollectInfo(item);
      this.storeCurrentName(this.currentName);
      setStore('currentItem',item);
      setStore('refreshCurrentItem',this.currentName);
      this.$router.push({path:'CollectDetails'});
      this.changeTitleTxt({tit:'收集历史详情'});
      setStore('currentTitle','收集历史详情');
    },
    // 点击标签按钮事件
    onClickTab (name, title) {
      this.currentName = name;
      this.currentIndex = name;
      if (this.startTime == "" || this.endTime == "") {
        this.$dialog.alert({
            message: '请选择开始或结束日期',
            closeOnPopstate: true
          }).then(() => {
        });
      } else {
        this.queryMethods(this.userInfo.proId, this.startTime, this.endTime, name)
      }
    },
    // 收集历史请求方法
    queryMethods (proId,startDate,endDate,name) {
      this.initData();
      let dataParams = {
        proId,
        startDate,
        endDate,
        state: name   
      };
      this.showLoadingHint = true;
      queryCollectHistory(dataParams).then((res) => {
        this.showLoadingHint = false;
        if (res && res.data) {
          if (res.data.code == 200) {
            if (name == 0) {
              if (res.data.data.length > 0) {
                this.signNotIn = res.data.data.length;
                for (let item of res.data.data) {
                  this.notInStorageList.push(
                    {
                      'batchNumber': item.batchNumber,  //批次号  				
                      'cardNumber': item.cardNumber,   //收集车号
                      'company': item.company,     //交接公司
                      'companyId': item.companyId ,    //交接人编号
                      'companyName': item.companyName,   //交接人姓名    
                      'id': item.id,
                      'inTime': item.inTime, //入库时间
                      'inTotalWeight': item.inTotalWeight, //入库总重量
                      'inWorkerName': item.inWorkerName,  //入库人姓名
                      'outTime': item.outTime, //出库时间
                      'outTotalWeight': item.outTotalWeight, //出库总重量
                      'outWorkerName': item.outWorkerName,  //出库人姓名
                      'proId': item.proId, //所属医院ID
                      'proName': item.proName,//所属医院名称
                      'state': item.state, //状态
                      'storeNumber': item.storeNumber, //总暂存点编号
                      'totalCount': item.totalCount, //总包数
                      'totalWeight': item.totalWeight, //收集总重量
                    }
                  )
                }
              } else {
                this.$dialog.alert({
                  message: '未入库信息为空',
                  closeOnPopstate: true
                }).then(() => {
                });
              }
            } else if (name == 1) {
               if (res.data.data.length > 0) {
                for (let item of res.data.data) {
                  this.signIn = res.data.data.length;
                  this.inStorageList.push(
                    {
                      'batchNumber':  item.batchNumber,  //批次号  				
                      'cardNumber':  item.cardNumber,   //收集车号
                      'company': item.company,     //交接公司
                      'companyId': item.companyId ,    //交接人编号
                      'companyName': item.companyName,   //交接人姓名    
                      'id': item.id,
                      'inTime': item.inTime, //入库时间
                      'inTotalWeight': item.inTotalWeight, //入库总重量
                      'inWorkerName': item.inWorkerName,  //入库人姓名
                      'outTime': item.outTime, //出库时间
                      'outTotalWeight': item.outTotalWeight, //出库总重量
                      'outWorkerName': item.outWorkerName,  //出库人姓名
                      'proId': item.proId, //所属医院ID
                      'proName': item.proName,//所属医院名称
                      'state': item.state, //状态
                      'storeNumber': item.storeNumber, //总暂存点编号
                      'totalCount': item.totalCount, //总包数
                      'totalWeight': item.totalWeight, //收集总重量
                    }
                  )
                }
              } else {
                this.$dialog.alert({
                  message: '已入库信息为空',
                  closeOnPopstate: true
                }).then(() => {
                });
              }
            } else if (name == 2) {
               if (res.data.data.length > 0) {
                this.signOut = res.data.data.length;
                for (let item of res.data.data) {
                  this.outStorageList.push(
                    {
                      'batchNumber':  item.batchNumber,  //批次号  				
                      'cardNumber':  item.cardNumber,   //收集车号
                      'company': item.company,     //交接公司
                      'companyId': item.companyId ,    //交接人编号
                      'companyName': item.companyName,   //交接人姓名    
                      'id': item.id,
                      'inTime': item.inTime, //入库时间
                      'inTotalWeight': item.inTotalWeight, //入库总重量
                      'inWorkerName': item.inWorkerName,  //入库人姓名
                      'outTime': item.outTime, //出库时间
                      'outTotalWeight': item.outTotalWeight, //出库总重量
                      'outWorkerName': item.outWorkerName,  //出库人姓名
                      'proId': item.proId, //所属医院ID
                      'proName': item.proName,//所属医院名称
                      'state': item.state, //状态
                      'storeNumber': item.storeNumber, //总暂存点编号
                      'totalCount': item.totalCount, //总包数
                      'totalWeight': item.totalWeight, //收集总重量
                    }
                  )
                }
              } else {
                this.$dialog.alert({
                  message: '已出库信息为空',
                  closeOnPopstate: true
                }).then(() => {
                });
              }
            } else if (name == 3) {
               if (res.data.data.length > 0) {
                this.signFinish = res.data.data.length;
                for (let item of res.data.data) {
                  this.finishList.push(
                    {
                      'batchNumber':  item.batchNumber,  //批次号  				
                      'cardNumber':  item.cardNumber,   //收集车号
                      'company': item.company,     //交接公司
                      'companyId': item.companyId ,    //交接人编号
                      'companyName': item.companyName,   //交接人姓名    
                      'id': item.id,
                      'inTime': item.inTime, //入库时间
                      'inTotalWeight': item.inTotalWeight, //入库总重量
                      'inWorkerName': item.inWorkerName,  //入库人姓名
                      'outTime': item.outTime, //出库时间
                      'outTotalWeight': item.outTotalWeight, //出库总重量
                      'outWorkerName': item.outWorkerName,  //出库人姓名
                      'proId': item.proId, //所属医院ID
                      'proName': item.proName,//所属医院名称
                      'state': item.state, //状态
                      'storeNumber': item.storeNumber, //总暂存点编号
                      'totalCount': item.totalCount, //总包数
                      'totalWeight': item.totalWeight, //收集总重量
                    }
                  )
                }
              } else {
                this.$dialog.alert({
                  message: '已完成信息为空',
                  closeOnPopstate: true
                }).then(() => {
                });
              }
            }
          } else {
            this.$dialog.alert({
              message: `${res.data.msg}`,
              closeOnPopstate: true
            }).then(() => {
            });
          }
        }
      })
      .catch((err) => {
        this.showLoadingHint = false;
        this.$dialog.alert({
          message: `${err.message}`,
          closeOnPopstate: true
        }).then(() => {
        })
      })
    },
   
    // 初始化数据
    initData () {
      this.notInStorageList = [];
      this.inStorageList = [];
      this.outStorageList = [];
      this.finishList = [];
      this.signNotIn = '';
      this.signIn =  '';
      this.signOut = '';
      this.signFinish = ''
    },

    // 控制设备物理返回按键
    monitorBack () {
      let that = this;
      pushHistory()
      that.gotoURL(() => { 
        pushHistory()
        this.$router.push({path: 'home'});  //输入要返回的上一级路由地址
        this.changeTitleTxt({tit: '医废监测'})
      })
    },

    //初始化方法
    initMethod () {
      this.activeName = 0;
      this.currentIndex = 0;
      this.initData();
      this.initDate();
      this.queryMethods(this.userInfo.proId, formatTime('YYYY-MM-DD'), formatTime('YYYY-MM-DD'), 0)
    }
  }
}

</script>
<style lang='less' scoped>
  @import "../common/stylus/variable.less";
  @import "../common/stylus/modifyUi.less";
  @import "../common/stylus/mixin.less";
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
        position: relative;
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
        .time-between {
          color: black;
          position: absolute;
        }
        .content-middle-top-content {
          position: relative;
          height: 100%;
          width: 98%;
          margin: 0 auto;
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
      .content-middle-list {
        overflow: auto;
        margin-top: 10px;
        .content-middle-list-item {
          position: relative;
          box-sizing: border-box;
          padding: 20px 10px;
          height: 140px;
          margin: 0 auto;
          background: #fff;
          margin-bottom: 20px;
          border-radius: 8px;
          box-shadow: 0 2.5px 12px 4px #d1d1d1;
          .bottom-border-1px(#d3d3d3);
          &:last-child {
            // margin-bottom: 0
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
              top: 32px;
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
        .not-inStorage {
          height: 130px;
          .list-item-right {
            top: 74px !important
          }
        }
        .inStorage {
          height: 156px;
          .list-item-right {
            top: 98px !important
          }
        }
        .out-storage {
          height: 204px;
          .list-item-bottom {
            bottom: 5px !important
          }
        }
        .in-finished {
          height: 184px;
           .list-item-right {
            top: 126px !important
          }
        }
      }
  }
  
</style>
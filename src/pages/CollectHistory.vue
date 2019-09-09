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
        <p class="middle-top-search" v-show="false">
          <van-button type="info" size="small">搜索</van-button>
        </p>
      </div>
      <van-tabs v-model="activeName" @click="onClickTab">
        <van-tab title="未入库" name="0">
          <div class="content-middle-list">
            <div class="content-middle-list-item" v-for="item in notInStorageList">
              <div class="list-item">
                <p class="list-item-left">批次: {{item.batchNumber}}</p>
                <p class="list-item-right">
                  重量: <span>{{item.totalWeight}}kg</span>
                </p>
                <div class="list-strip">
                  <p>医院: {{item.proName}}</p>
                  <p class="list-sign">入库人: {{item.inWorkerName}}</p>
                  <p class="list-times">交接公司: {{item.company}}</p>
                  <p class="list-code">收集车号: {{item.cardNumber}}</p>
                </div>
                <div class="list-item-bottom">
                  交接人员: <span>{{item.companyName}}</span>
                </div>
              </div>
            </div>
          </div>
        </van-tab>
        <van-tab title="已入库" name="1">
          <div class="content-middle-list">
            <div class="content-middle-list-item" v-for="item in inStorageList">
              <div class="list-item">
                <p class="list-item-left">批次: {{item.batchNumber}}</p>
                <p class="list-item-right">
                  入库重量: <span>{{item.inTotalWeight}}kg</span>
                </p>
                <div class="list-strip">
                  <p>医院: {{item.proName}}</p>
                  <p class="list-sign">入库人: {{item.inWorkerName}}</p>
                  <p class="list-times">交接公司: {{item.company}}</p>
                  <p class="list-code">收集车号: {{item.cardNumber}}</p>
                </div>
                <div class="list-item-bottom">
                  交接人员: <span>{{item.companyName}}</span>
                </div>
              </div>
            </div>
          </div>
        </van-tab>
        <van-tab title="已出库" name="2">
           <div class="content-middle-list">
            <div class="content-middle-list-item" v-for="item in outStorageList">
              <div class="list-item">
                <p class="list-item-left">批次: {{item.batchNumber}}</p>
                <p class="list-item-right">
                  出库总重量: <span>{{item.outTotalWeight}}kg</span>
                </p>
                <div class="list-strip">
                  <p>医院: {{item.proName}}</p>
                  <p class="list-sign">入库人: {{item.inWorkerName}}</p>
                  <p class="list-times">交接公司: {{item.company}}</p>
                  <p class="list-code">收集车号: {{item.cardNumber}}</p>
                </div>
                <div class="list-item-bottom">
                  交接人员: <span>{{item.companyName}}</span>
                </div>
              </div>
            </div>
          </div>
        </van-tab>
        <van-tab title="已完成" name="3">
          <div class="content-middle-list">
            <div class="content-middle-list-item" v-for="item in finishList">
              <div class="list-item">
                <p class="list-item-left">批次: {{item.batchNumber}}</p>
                <p class="list-item-right">
                  重量: <span>{{item.totalWeight}}kg</span>
                </p>
                <div class="list-strip">
                  <p>医院: {{item.proName}}</p>
                  <p class="list-sign">入库人: {{item.inWorkerName}}</p>
                  <p class="list-times">交接公司: {{item.company}}</p>
                  <p class="list-code">收集车号: {{item.cardNumber}}</p>
                </div>
                <div class="list-item-bottom">
                  交接人员: <span>{{item.companyName}}</span>
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
import { pushHistory } from '@/common/js/utils'
import {queryCollectHistory} from '../api/rubbishCollect.js'
export default {
  components: {
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
      notInStorageList: [],
      inStorageList: [],
      outStorageList: [],
      finishList: [],
      activeName: 0,
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

  mounted () {
    pushHistory();
    window.onpopstate = () => {
      this.$router.push({path: 'home'});  //输入要返回的上一级路由地址
      this.changeTitleTxt({tit: '医废监测'})
    };
    this.initDate();
    this.queryMethods(this.userInfo.proId, this.formatTime(), this.formatTime(), 0)
  },

  methods: {
    ...mapMutations([
      'changeTitleTxt'
    ]),
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
      let currentDateList = this.formatTime().split('-');
      this.startTime = `${currentDateList[0]}-${currentDateList[1]}-${currentDateList[2]}`;
      this.endTime = `${currentDateList[0]}-${currentDateList[1]}-${currentDateList[2]}`
    },
    // 点击标签按钮事件
    onClickTab (name, title) {
      this.notInStorageList = [];
      this.inStorageList = [];
      this.outStorageList = [];
      this.finishList = [];
      if (this.startTime == "" || this.endTime == "") {
        this.$dialog.alert({
            message: '请选择开始或结束日期'
          }).then(() => {
        });
      } else {
        this.queryMethods(this.userInfo.proId, this.startTime, this.endTime, name)
      }
    },
    // 收集历史请求方法
    queryMethods (proId,startDate,endDate,name) {
      this.notInStorageList = [];
      this.inStorageList = [];
      this.outStorageList = [];
      this.finishList = [];
      let dataParams = {
        proId,
        startDate,
        endDate,
        state: name   
      };
      queryCollectHistory(dataParams).then((res) => {
        if (res && res.data) {
          if (res.data.code == 200) {
            if (name == 0) {
              if (res.data.data.length > 0) {
                for (let item of res.data.data) {
                  this.notInStorageList.push(
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
                  message: '未入库信息为空'
                }).then(() => {
                });
              }
            } else if (name == 1) {
               if (res.data.data.length > 0) {
                for (let item of res.data.data) {
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
                  message: '已入库信息为空'
                }).then(() => {
                });
              }
            } else if (name == 2) {
               if (res.data.data.length > 0) {
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
                  message: '已出库信息为空'
                }).then(() => {
                });
              }
            } else if (name == 3) {
               if (res.data.data.length > 0) {
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
                  message: '已完成信息为空'
                }).then(() => {
                });
              }
            }
          } else {
            this.$dialog.alert({
              message: `${res.data.msg}`
            }).then(() => {
            });
          }
        }
      })
      .catch((err) => {
        console.log(err);
        this.$dialog.alert({
          message: `${err.message}`
        }).then(() => {
        })
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
      /deep/ .van-icon-manager-o {
        position: absolute;
        top: 22px;
        right: 6px;
        font-size: 18px;
        color: #fff;
      }
       /deep/ .van-icon-arrow-left {
        position: absolute;
        top: 22px;
        left: 4px;
        font-size: 20px;
        color: #fff
      }
    }
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
          width: 48%;
          display: inline-block;
          padding: 10px 24px
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
      .content-middle-list {
        height: 500px;
        overflow: auto;
        .content-middle-list-item {
          position: relative;
          box-sizing: border-box;
          padding: 10px 10px;
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
  }
  
</style>
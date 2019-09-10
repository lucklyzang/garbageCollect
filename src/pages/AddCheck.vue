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
        <van-tab title="待审核" name="0">
          <div class="content-middle-list">
            <div class="content-middle-list-item" v-for="item in notCheckList" @click="addRecordCheck(item)">
              <div class="list-item">
                <p class="list-item-left">
                  补录批次: {{item. batchNumber}}
                </p>
                <p class="list-item-right">
                  所属医院: <span>{{item.proName}}</span>
                </p>
                <div class="list-strip">
                  <p>补录人: {{item.suppName}}</p>
                  <p class="list-sign">补录原因: {{item.remark}}</p>
                  <p class="list-code">补录时间: {{item.createTime}}</p>
                  <p class="list-code">收集时间: {{item.collectTime}}</p>
                  <p class="list-code">重量: {{item.weight}} <span style="color:#c97889">kg</span></p>
                </div>
                <div class="list-item-bottom">
                  收集人员: <span>{{item.workerName}}</span>
                </div>
              </div>
            </div>
          </div>
        </van-tab>
        <van-tab title="已审核" name="1">
          <div class="content-middle-list">
            <div class="content-middle-list-item" v-for="item in checkedList">
              <div class="list-item">
                <p class="list-item-left">
                  补录批次: {{item. batchNumber}}
                </p>
                <p class="list-item-right">
                  所属医院: <span>{{item.proName}}</span>
                </p>
                <div class="list-strip">
                  <p>补录人: {{item.suppName}}</p>
                  <p class="list-sign">补录原因: {{item.remark}}</p>
                   <p class="list-sign">审核意见: {{item.checkIdea}}</p>
                  <p class="list-code">补录时间: {{item.createTime}}</p>
                  <p class="list-code">收集时间: {{item.collectTime}}</p>
                  <p class="list-code">重量: {{item.weight}} <span style="color:#c97889">kg</span></p>
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
    <van-dialog
      v-model="addCheckShow"
      title="补录审核意见"
      show-cancel-button
      confirmButtonText="通过"
      cancelButtonText="不通过"
      @confirm="checkSure"
      @cancel="checkCancle"
      >
      <van-cell-group>
        <van-field
          v-model="checkWaringMsg"
          label="审核意见"
          type="textarea"
          placeholder="请输入审核意见"
          rows="3"
          autosize
        />
      </van-cell-group>
    </van-dialog>
    <!-- <FooterBottom></FooterBottom> -->
  </div>
</template>

<script>
import HeaderTop from '../components/HeaderTop'
import FooterBottom from '../components/FooterBottom'
import { mapGetters, mapMutations } from 'vuex'
import {queryAddList, addCheck} from '../api/rubbishCollect.js'
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
      notCheckList: [],
      checkedList: [],
      activeName: 0,
      checkWaringMsg: '',
      clickQueryBtn: false,
      addCheckShow: false,
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
    this.queryAdd(this.getUserInfo, this.formatTime(), this.formatTime(), 0)
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
      this.$router.go(-1);
      this.changeTitleTxt({tit:'医废监测'})
    },
    // 跳转到我的页面
    skipMyInfo () {
      this.$router.push({path: 'myInfo'});
      this.changeTitleTxt({tit:'我的'})
    },
    // 弹出补录审核弹框
    addRecordCheck (item) {
      this.addCheckShow = true;
      this.currentId = item.id
    },
    // 初始化时间显示框
    initDate () {
      let currentDateList = this.formatTime().split('-');
      this.startTime = `${currentDateList[0]}-${currentDateList[1]}-${currentDateList[2]}`;
      this.endTime = `${currentDateList[0]}-${currentDateList[1]}-${currentDateList[2]}`
    },
    // 点击标签按钮事件
    onClickTab (name, title) {
      this.notCheckList = [];
      this.checkedList = [];
      let currentName;
      name == 0 ? currentName = 0 : currentName = 1;
      if (this.startTime == "" || this.endTime == "") {
        this.$dialog.alert({
            message: '请选择开始或结束日期'
          }).then(() => {
        });
      } 
      this.queryAdd(this.userInfo.proId, this.startTime, this.endTime, currentName)
    },
  
    // 审核通过处理事件
    checkSure () {
      let checkData = {
        id: this.currentId,  //预警ID
        checkId: this.userInfo.id,  //审核人ID,
        checkName: this.userInfo.workerName, //审核人姓名,			
        checkIdea: this.checkWaringMsg,   //审核意见  
        state: 1,     //同意
        checkTime: this.formatTimeOther()    
      };
      addCheck(checkData).then((res) => {
        this.checkWaringMsg = '';
        if (res.data.code == 200) {
          this.$dialog.alert({
            title: '',
            message: '审核通过处理成功'
          }).then(() => {
            this.queryAdd(this.getUserInfo,  this.startTime, this.endTime, 0)
          });
        } else {
          this.$dialog.alert({
            title: '',
            message: `${res.data.msg}`
          }).then(() => {
          });
        }
        this.addCheckShow = false
      })
      .catch((err) => {
        this.$dialog.alert({
          title: '',
          message: `${err.message}`
        }).then(() => {
        });
        this.addCheckShow = false
      })
    },
    // 审核不通过事件
    checkCancle () {
       let checkData = {
        id: this.currentId,  //预警ID
        checkId: this.userInfo.id,  //审核人ID,
        checkName: this.userInfo.workerName, //审核人姓名,			
        checkIdea: this.checkWaringMsg,   //审核意见  
        state: 2,  //不同意
        checkTime: this.formatTimeOther()    
      };
      addCheck(checkData).then((res) => {
        this.checkWaringMsg = '';
        if (res.data.code == 200) {
          this.$dialog.alert({
            title: '',
            message: '审核不通过处理成功'
          }).then(() => {
            this.queryAdd(this.getUserInfo,  this.startTime, this.endTime, 0)
          });
        } else {
          this.$dialog.alert({
            title: '',
            message: `${res.data.msg}`
          }).then(() => {
          });
        }
        this.addCheckShow = false;
      })
      .catch((err) => {
        this.$dialog.alert({
          title: '',
          message: `${err.message}`
        }).then(() => {
        });
        this.addCheckShow = false;
      })
    },

    // 查询补录批次
    queryAdd (proId,startDate,endDate,state) {
      this.notCheckList = [];
      this.checkedList = [];
      let addMsg = {
        proId,
        startDate,
        endDate,
        state
      };
      queryAddList(addMsg).then((res) => {
        if (res) { 
          if (res.data.code == 200) {
            if (state == 0) {
              if (res.data.data.length > 0) {
                let outStorage = res.data.data;
                for (let item of outStorage) {
                  this.notCheckList.push({
                    'batchNumber': item.batchNumber, //补录批次
                    'collectTime': item.collectTime, //收集时间
                    'createTime': item.createTime,  //补录时间			
                    'id': item.id,			
                    'proId': item.proId,
                    'proName': item.proName,
                    'remark': item.remark,
                    'state': item.state,             //状态
                    'storeNumber': item.storeNumber,
                    'suppId': item.suppId,
                    'suppName': item.suppName,       //补录人
                    'total': item.total,             //补录包数
                    'wasteId': item.wasteId,
                    'wasteName': item.wasteName,
                    'weight': item.weight,           //重量
                    'workerId': item.workerId,
                    'workerName': item.workerName,   //收集人姓名
                  })
                }
              }else {
                this.$dialog.alert({
                    message: '当前未补录批次信息为空'
                  }).then(() => {
                });
              }
            } else if (state === 1) {
               if (res.data.data.length > 0) {
                let outStorage = res.data.data;
                for (let item of outStorage) {
                  this.checkedList.push({
                    'batchNumber': item.batchNumber, //补录批次
                    'collectTime': item.collectTime, //收集时间
                    'createTime': item.createTime,  //补录时间			
                    'id': item.id,			
                    'proId': item.proId,
                    'proName': item.proName,
                    'checkIdea': item.checkIdea,
                    'remark': item.remark,
                    'state': item.state,             //状态
                    'storeNumber': item.storeNumber,
                    'suppId': item.suppId,
                    'suppName': item.suppName,       //补录人
                    'total': item.total,             //补录包数
                    'wasteId': item.wasteId,
                    'wasteName': item.wasteName,
                    'weight': item.weight,           //重量
                    'workerId': item.workerId,
                    'workerName': item.workerName,   //收集人姓名
                  })
                }
              }else {
                this.$dialog.alert({
                    message: '当前未补录批次信息为空'
                  }).then(() => {
                });
              }
            }
          }
        }
      })
      .catch((err) => {
        console.log(err)
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
        height: 500px;
        overflow: auto;
       .content-middle-list-item {
          padding: 14px;
          height: 150px;
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
              top: 30px;
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
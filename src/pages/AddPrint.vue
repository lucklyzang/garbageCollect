<template>
  <div class="content-wrapper">
    <HeaderTop :title="navTopTitle">
      <van-icon name="arrow-left" slot="left" @click="backTo"></van-icon> 
      <van-icon name="manager-o" slot="right" @click="skipMyInfo"></van-icon> 
    </HeaderTop>
    <div class="content-middle">
      <loading :isShow="showLoadingHint"></loading>
      <div class="content-middle-top">
        <van-field v-model="startTime" placeholder="开始日期" readonly="readonly" @click="startTimePop = true"/>
        <van-popup v-model="startTimePop" position="bottom" :overlay="true">
          <van-datetime-picker  v-model="currentDateStart"  type="date"  :min-date="minDateStart"
          @cancel="startTimePop = false"  @confirm="startTimePop = false"  @change="startTimeChange"/>
        </van-popup>
        <van-field v-model="endTime" laceholder="结束日期" readonly="readonly" @click="endTimePop = true"/>
        <van-popup v-model="endTimePop" position="bottom" :overlay="true"> 
          <van-datetime-picker  v-model="currentDateEnd"  type="date"  :min-date="minDateEnd"
          @cancel="endTimePop = false"  @confirm="endTimePop = false"  @change="endTimeChange"/>
        </van-popup>
      </div>
      <div class="middle-top-select">
        <van-dropdown-menu  active-color="#38bdd0">
          <van-dropdown-item v-model="office" :options="officeList" />
          <van-dropdown-item v-model="collectPerson" :options="collectPersonList" />
          <van-dropdown-item v-model="reprint" :options="reprintList" />
        </van-dropdown-menu>
        <p class="middle-top-search">
          <van-button type="info" size="small" @click="queryPrintMessage">搜索</van-button>
        </p>
      </div>
      <div class="changeBtn">
        <van-checkbox v-model="checkedAll" @click="toggleCheckedAll">全选</van-checkbox>
      </div>
      <div class="content-middle-list">
        <div class="content-middle-list-item" v-for="item in rawInfoList">
          <div class="change-btn-position">
            <van-checkbox v-model="item.check"  @change="oneChecked(item.check)"></van-checkbox>
          </div>
          <div class="list-item">
            <p class="list-item-left">医废类型: {{item.wasteName}}</p>
            <p class="list-item-right">
              重量: <span>{{item.weight}}kg</span>
            </p>
            <div class="list-strip">
              <p>科室: {{item.depName}}</p>
              <p class="list-sign">条码标识: {{item.collectNumber}}</p>
              <p class="list-times">回收趟次: {{item.batchNumber}}</p>
              <p class="list-code">时间: {{item.createTime}}</p>
              <p class="list-code">收集人: {{item.workerName}}</p>
            </div>
            <div class="list-item-bottom">
              移交人员: <span>{{item.careName}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="btn-group">
        <p>
          <van-button type="info" @click="printSlip" size="normal">打印凭条</van-button>
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
import Loading from '../components/Loading'
import {queryPrintInfo, queryOffice, queryCollectPerson, postReplenishPrintData} from '../api/rubbishCollect.js'
import { formatTime } from '@/common/js/utils'
export default {
   components:{
    HeaderTop,
    FooterBottom,
    Loading
  },
  data () {
    return {
      rawInfoList: [],
      printData: [],
      endTimePop: false,
      startTimePop: false,
      showLoadingHint: false,
      checkedAll: false,
      minDateStart: new Date(2018, 0, 1),
      minDateEnd: new Date(2018, 0, 1),
      currentDateStart: '',
      currentDateEnd: '',
      startTime: '',
      endTime: '',
      office: 13,
      officeList: [],
      collectPerson: 2,
      collectPersonList: [],
      reprint: 0,
      reprintList: [
        {
          text: '设备故障',
          value: 0
        },
        {
          text: '设备没电',
          value: 1
        },
        {
          text: '设备没纸',
          value: 2
        },
        {
          text: '其它',
          value: 3
        }
      ],
      lajiBarCode: [],
      keshiCode: [],
      lajiCodeName: [],
      lanyaCz: [],
      yihuCode: [],
      collectWorkerName: []
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
    this.queryAllBatch();
    this.initDate();
    this.querySelectInfo();
    this.initWasteInfo()
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

    // 初始化时间显示框
    initDate () {
      let currentDateList = formatTime('YYYY-MM-DD').split('-');
      this.startTime = `${currentDateList[0]}-${currentDateList[1]}-${currentDateList[2]}`;
      this.endTime = `${currentDateList[0]}-${currentDateList[1]}-${currentDateList[2]}`
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
    // 查询科室与部门信息
    querySelectInfo () {
      this.officeList = [];
      this.collectPersonList = [];
      // 查询科室信息
      queryOffice({proId: this.userInfo.proId}).then((res) => {
        if (res && res.data.code == 200) {
          if (res.data.data.length > 0) {
            let officeList = res.data.data;
            for (let item of officeList) {
              this.officeList.push({
                text: item.departmentName,
                value: item.id
              })
            }
          }
        }
      })
      .catch((err) => {
        this.$dialog.alert({
          message: `${err.message}`,
          closeOnPopstate: true
        }).then(() => {
        });
      });
      // 查询收集人员信息
      queryCollectPerson({proId: this.userInfo.proId,type:2}).then((res) => {
        if (res && res.data.code == 200) {
          if (res.data.data.length > 0) {
            let officeList = res.data.data;
            for (let item of officeList) {
              this.collectPersonList.push({
                text: item.workerName,
                value: item.id
              })
            }
          }
        }
      })
      .catch((err) => {
        this.$dialog.alert({
          message: `${err.message}`,
          closeOnPopstate: true
        }).then(() => {
        });
      })
    },
    // 查询收集的医废信息
    queryAllBatch () {
      if (this.endTime !== this.startTime) {
        this.$dialog.alert({
          message: '起始日期与结束日期必需相同',
          closeOnPopstate: true
        }).then(() => {
        });
        return
      };
      this.showLoadingHint = true;
      this.rawInfoList = [];
      queryPrintInfo({ 
        proId: this.userInfo.proId, //项目ID
        workerId: '', //当前收集人this.collectPerson
        depId: '', //部门IDthis.office
        startDate: this.startTime,   //起始日期 格式 yyyy-MM-dd 必输
        endDate: this.endTime,      //终止日期 格式 yyyy-MM-dd 必输		
        currentPage: 1, //当前页
        pageSize: 20, //每页显示条数
        isPage: 0
      }).then((res)=>{
        if (res && res.data.code == 200) {
          if (res.data.data.data.length > 0) {
            let dataList = res.data.data.data;
            for (let item of dataList) {
              this.rawInfoList.push({
                collectNumber: item.collectNumber,
                wasteName: item.wasteName,
                weight: item.weight,
                createTime: item.createTime,
                careName: item.careName,
                depName: item.depName,
                batchNumber: item.batchNumber,
                workerName: item.workerName,
                check: false
              })
            }
          } else {
             this.$dialog.alert({
              message: '当前没有查询到收集的医废信息',
              closeOnPopstate: true
            }).then(() => {
            });
          }
        };
        this.showLoadingHint = false
      })
      .catch((err)=> {
        this.showLoadingHint = false;
        this.$dialog.alert({
          message: `${err.message}`,
          closeOnPopstate: true
        }).then(() => {
        });
      })
    },

    // 搜索按钮
    queryPrintMessage () {
      this.checkedAll = false;
      this.queryAllBatch()
    },

    // 全选操作
    toggleCheckedAll(){
       if(this.checkedAll){
          this.rawInfoList.forEach((item)=>{
            item.check = false  
          })
          this.checkedAll = false
       }else{
          this.rawInfoList.forEach((item)=>{
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
       let isExitCheckedNo = this.rawInfoList.every(item=>{
          return item.check == true     
       });
       if(isExitCheckedNo){
          this.checkedAll = true    
       }else{
          this.checkedAll = false
      }
    },

    //获取补充打印
    getPrintReason () {
      let reason = this.reprint;
      if (reason == '0') {
        return '设备故障'
      } else if (reason == '1') {
        return '设备没电'
      } else if (reason == '2') {
        return '设备没纸'
      } else {
        return '其它'
      }
    },

    // 提交打印数据到服务端
    postPrintData () {
      let checkData = [];
      this.rawInfoList.filter((item) => { return item.check == true}).forEach((item) => {
        Object.keys(item).forEach((currentItem) => {
          if (currentItem == 'collectNumber') {
            checkData.push(item[currentItem])
          }
        })
      });
      let printData = {
        "proId": this.getUserInfo, //打印项目ID
        "proName": this.userInfo.proName, //打印项目名称
        "workerId": this.userInfo.id,//打印者ID
        "workerName": this.userInfo.workerName, //打印者名称
        "printReason": this.getPrintReason(), //补打原因
        "remark": checkData //打印医废条码数组
      };
      postReplenishPrintData(printData).then((res) => {
         if (res && res.data.code == 200) {
          this.$dialog.alert({
            message: `${res.data.msg}`,
            closeOnPopstate: true
          }).then(() => {
          });
         } else {
            this.$dialog.alert({
            message: `${res.data.msg}`,
            closeOnPopstate: true
          }).then(() => {
          });
         }
      })
      .catch((err) => {
        this.$dialog.alert({
          message: `${err.message}`,
          closeOnPopstate: true
        }).then(() => {
        });
      })
    },

    // 清空上次存储的打印信息
    initWasteInfo () {
      this.lajiBarCode = [],
      this.keshiCode = [],
      this.lajiCodeName = [],
      this.lanyaCz = [],
      this.yihuCode = [],
      this.collectWorkerName = []
    },

    // 打印方法
    printProof (num,dep,category,weight,collector,handover) {
      window.android.printInfo(num,dep,category,weight,collector,handover)
    },

    // 打印凭条
    printSlip () {
      this.printData = [];
      this.initWasteInfo();
      this.printData = this.rawInfoList.filter((item) => {
        return item.check == true
      });
      for (let item of this.printData) {
        this.lajiBarCode.push(item.collectNumber),
        this.keshiCode.push(item.depName),
        this.lajiCodeName.push(item.wasteName),
        this.lanyaCz.push(item.weight),
        this.yihuCode.push(item.careName),
        this.collectWorkerName.push(item.workerName)
      };
      // num,dep,category,weight,collector,handover
      // this.lajiCode[0].wasteName,
      // 编号, 科室, 垃圾类型，垃圾重量，收集人，交接人
      if (this.lajiBarCode.length == 0) {
        this.$dialog.alert({
          message: '当前没有要打印的凭条',
          closeOnPopstate: true
        }).then(() => {
        });
        return
      };
      if (this.lajiBarCode.length == 1) {
        let flag = true;
        this.printProof(this.lajiBarCode[0],this.keshiCode[0],this.lajiCodeName[0],
          this.lanyaCz[0],this.collectWorkerName[0],this.yihuCode[0]);
        if (flag) {
           this.printProof(this.lajiBarCode[0],this.keshiCode[0],this.lajiCodeName[0],
          this.lanyaCz[0],this.collectWorkerName[0],this.yihuCode[0]);
        }
      } else if (this.lajiBarCode.length > 1) {
        let map = {};
        // 记录打印次数
        let timeNum = 1;
        // 合并重复的垃圾类型及其重量
        this.lajiCodeName.forEach((value, index) => {
          Object.prototype.hasOwnProperty.call(map, value) || (map[value] = 0);
          map[value] += Number(this.lanyaCz[index]);
        });
        // 循环调用打印接口
        for (var i = 0, len = this.lajiBarCode.length; i<len; i++) {
          if (i == Object.values(map).length) {return};
          this.printProof(this.lajiBarCode[i],this.keshiCode[0],Object.keys(map)[i],
          Object.values(map)[i],this.collectWorkerName[0],this.yihuCode[i]);
          // 打印两联
          if (timeNum < 2) { 
            if (i == Object.values(map).length-1) {
              i = -1;
              timeNum++
            }
          }
        }
      };
      // 提交打印数据到服务端
      this.postPrintData()
    }
  }
}

</script>
<style lang='less' scoped>
@import "../common/stylus/variable.less";
@import "../common/stylus/modifyUi.less";
@import "../common/stylus/mixin.less";
  .content-wrapper {
    .content-middle {
      .content-middle();
       .content-middle-top {
        padding: 0 10px;
        position: relative;
        /deep/ .van-cell {
          width: 48%;
          display: inline-block;
          padding: 10px 0
        }
      }
      /deep/ .middle-top-select {
        position: relative;
        .van-dropdown-menu__item {
          flex: none;
          width: 25%;
          justify-content: left
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
          padding-top: 11px;
          box-sizing: border-box;
          /deep/ .van-icon {
            background: @color-theme;
            border-color: @color-theme
          }
      }
      .content-middle-list {
        height: 62vh;
        overflow: auto;
        .content-middle-list-item {
          position: relative;
          box-sizing: border-box;
          padding: 10px 10px 10px 40px;
          height: 170px;
          .bottom-border-1px(#d3d3d3);
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
        position: fixed;
        left: 0;
        bottom: 6px;
        width: 100%;
        text-align: center;
        p {
          button {
            background: @color-theme;
            border-color: @color-theme;
            letter-spacing: 2px;
            padding: 0 120px
          }
        }
      }
    }
  }
</style>
<template>
  <div class="content-wrapper">
    <HeaderTop :title="navTopTitle">
      <van-icon name="arrow-left" slot="left" @click="backTo"></van-icon> 
      <van-icon name="manager-o" slot="right" @click="skipMyInfo"></van-icon> 
    </HeaderTop>
    <ul class="left-dropDown" v-show="leftDownShow">
      <li v-for="(item, index) in leftDropdownDataList"  :key="index" :class="{liStyle:liIndex == index}" @click="leftLiCLick(index)">{{item}}</li>
    </ul>
    <div class="content-middle">
     <loading :isShow="showLoadingHint"></loading>
      <div class="content-middle-title">
        <div class="day-height">
          <p>今日医废总重量:</p>
          <p>{{dayTotalWeight}}kg</p>
        </div>
        <div class="week-height">
          <p>一周医废总重量: </p>
          <p>{{weekTotalWeight}}kg</p>
        </div>
        <div class="month-height">
         <p>一月医废总重量:</p> 
         <p>{{monthTotalWeight}}kg</p>
        </div>
        <div class="year-height">
          <p>一年医废总重量: </p>
          <p>{{yearTotalWeight}}kg</p>
        </div>
      </div>
      <div class="data-wrapper" style="width: 97%;margin: 0 auto;text-align: center;">
        <div id="content-middle-dayData"></div>
        <div id="content-middle-weekData"></div>
        <div id="content-middle-monthData"></div>
        <div id="content-middle-yearData"></div>
      </div>
    </div>
    <!-- <FooterBottom></FooterBottom> -->
  </div>
</template>

<script>
import HeaderTop from '../components/HeaderTop'
import FooterBottom from '../components/FooterBottom'
import { mapGetters, mapMutations } from 'vuex'
import {getDictionaryData} from '@/api/login.js'
import { formatTime, setStore, removeStore, IsPC } from '@/common/js/utils'
import Loading from '../components/Loading'

import {statisticsData} from '../api/rubbishCollect.js'
export default {
   components:{
    HeaderTop,
    FooterBottom,
    Loading
  },
  data () {
    return {
      topTitle: '医废收集',
      leftDownShow: false,
      liIndex: null,
      leftDropdownDataList: ['刷新','我的','测试'],
      dayData: [],
      weekData: [],
      monthData: [],
      yearData: [],
      wasteType: ['感染性','损伤性','药物性','病理性','化学性', '其它'],
      dayTotalWeight: '',
      monthTotalWeight: '',
      yearTotalWeight: '',
      weekTotalWeight: '',
      showLoadingHint: false
    };
  },
  computed: {
    ...mapGetters([
      'navTopTitle',
      'batchNumber',
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
        this.$router.push({path: 'home'});
        this.changeTitleTxt({tit: '医废监测'});
        setStore('currentTitle','医废监测');
      })
    };
   
    let vesselEleDay = this.$echarts.init(
      document.getElementById("content-middle-dayData"), '', {'height': '190px'}
    );
    let vesselEleWeek = this.$echarts.init(
      document.getElementById("content-middle-weekData"), '', {'height': '190px'}
    );
    let vesselEleMonth = this.$echarts.init(
      document.getElementById("content-middle-monthData"), '', {'height': '190px'}
    );
    let vesselEleYear = this.$echarts.init(
      document.getElementById("content-middle-yearData"), '', {'height': '190px'}
    );
    
    // 自适应不同尺寸的屏幕
    window.onresize = function(){
      vesselEleDay.resize();
      vesselEleWeek.resize();  
      vesselEleMonth.resize();  
      vesselEleYear.resize();             
    };
    this.getChartData();
  },

  methods: {
    ...mapMutations([
      'changeTitleTxt', 
    ]),
    // 返回上一页
    backTo () {
      this.$router.push({name:'home'});
      this.changeTitleTxt({tit:'医废监测'});
      setStore('currentTitle','医废监测');
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

    // 绘制图表
    drawLine (name,text,data) {
      name.setOption({
        title : {
        text: text,
        x:'left',
        y: '0',
        textStyle: {
          color: '#464646',
          fontSize: 15
        }
      },
        tooltip : {
          trigger: 'item',
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          y: '18%',
          data: ['感染性','损伤性','药物性','病理性','化学性','其它'],
          textStyle: {
            fontSize: 10
          }
        },
        color: ['#2b3fa2','#42c2c3','#277b9d','#f6b37f','#52ba87','#7890f0'], 
        series: [
        {
          name:'医废类型',
          type:'pie',
          radius: ['67%', '50%'],
          center: ['70%', '55%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: false,
              position: 'center'
            },
            emphasis: {
              show: true,
              textStyle: {
                fontSize: '30',
                fontWeight: 'bold'
              }
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          data: data
          }
        ]
      })
    },
    // 获取图表数据
    getChartData () {
      this.dayData = [];
      this.weekData = [];
      this.monthData = [];
      this.yearData = [];
      this.weekTotalWeight = '';
      this.showLoadingHint = true;
      statisticsData(this.userInfo.proId, {workerId: this.userInfo.id}).then((res) => {
        this.showLoadingHint = false;
        if (res && res.data) {
          if (res.data.code == 200) {
            if (res.data.data.todayList.length > 0 && res.data.data.monthList.length > 0 && res.data.data.sevenDays.length > 0
             && res.data.data.yearList.length > 0) {
              this.dayTotalWeight = res.data.data.today.toFixed(2);
              this.yearTotalWeight = res.data.data.year.toFixed(2)
              // 一天的数据
              res.data.data.todayList.forEach((item,index) => {
                this.dayData.push({
                  value: item,
                  name: this.wasteType[index]
                })
              });
              this.drawLine(this.$echarts.init(
                document.getElementById("content-middle-dayData")
              ),'今日医废类型分布情况',this.dayData);

              // 一周的数据
              res.data.data.sevenDays.forEach((item,index) => {
                this.weekData.push({
                  value: item,
                  name: this.wasteType[index]
                })
              });
              this.drawLine(this.$echarts.init(
                document.getElementById("content-middle-weekData")
              ),'一周医废类型分布情况',this.weekData);

              // 一周的总重量
              this.weekTotalWeight = (res.data.data.sevenDays.reduce((total,current) => {return total + current})).toFixed(2)
              // 一月的数据
              res.data.data.thirtyDays.forEach((item,index) => {
                this.monthData.push({
                  value: item,
                  name: this.wasteType[index]
                })
              });
              // 一月的总量
              this.monthTotalWeight = (res.data.data.thirtyDays.reduce((total,current) => {return total + current})).toFixed(2);
              this.drawLine(this.$echarts.init(
                document.getElementById("content-middle-monthData")
              ),'一月医废类型分布情况',this.monthData);

              // 一年的数据
              res.data.data.yearList.forEach((item,index) => {
                this.yearData.push({
                  value: item,
                  name: this.wasteType[index]
                })
              });
              this.drawLine(this.$echarts.init(
                document.getElementById("content-middle-yearData")
              ),'一年医废类型分布情况',this.yearData);
            } else {
              this.$dialog.alert({
                message: '收集医废数据为空',
                closeOnPopstate: true
              }).then(() => {
              });
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
    }
  }
}

</script>
<style lang='less' scoped>
@import "../common/stylus/variable.less";
@import "../common/stylus/modifyUi.less";
@import "../common/stylus/index.less";
  .content-wrapper {
    .content-wrapper();
    .left-dropDown {
      .rightDropDown
    }
    .content-middle {
      padding-bottom: 14px;
      flex:1;
      overflow: auto;
      position: relative !important;
      .content-middle-title {
        height: auto;
        padding-top: 14px;
        width: 97%;
        margin: 0 auto;
        text-align: center;
       > div {
          display: inline-block;
          vertical-align: middle;
          border-radius: 4px;
          background: #fff;
          height: 12vh;
          color: #fff;
          text-align: center;
          line-height: 6vh;
          font-size: 12px;
          margin-bottom: 4%;
          color: #333333;
          box-shadow: 0 2.5px 12px 4px #d1d1d1;
          p {
            text-align: left;
            padding-left:14px;
            &:last-child {
              font-weight: bold
            }
          }
        }
      }
      #content-middle-dayData,#content-middle-weekData,#content-middle-monthData,#content-middle-yearData {
        display: inline-block;
        vertical-align: middle;
        box-sizing: border-box;
        height: 28vh;
        box-shadow: 0 2.5px 12px 4px #d1d1d1;
      }
    }
  }
</style>
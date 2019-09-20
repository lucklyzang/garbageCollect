<template>
  <div class="content-wrapper">
    <HeaderTop :title="navTopTitle">
      <van-icon name="arrow-left" slot="left" @click="backTo"></van-icon> 
      <van-icon name="manager-o" slot="right" @click="skipMyInfo"></van-icon> 
    </HeaderTop>
    <div class="content-middle">
      <div class="content-middle-title">
        <p class="day-height">今日医废总重量: {{dayTotalWeight}}kg</p>
        <p class="week-height">一周医废总重量: {{weekTotalWeight}}kg</p>
        <p class="month-height">一月医废总重量: {{monthTotalWeight}}kg</p>
        <p class="year-height">一年医废总重量: {{yearTotalWeight}}kg</p>
      </div>
      <div id="content-middle-dayData"></div>
      <div id="content-middle-weekData"></div>
      <div id="content-middle-monthData"></div>
      <div id="content-middle-yearData"></div>
    </div>
    <!-- <FooterBottom></FooterBottom> -->
  </div>
</template>

<script>
import HeaderTop from '../components/HeaderTop'
import FooterBottom from '../components/FooterBottom'
import { mapGetters, mapMutations } from 'vuex'
import { pushHistory } from '@/common/js/utils'
import {statisticsData} from '../api/rubbishCollect.js'
export default {
   components:{
    HeaderTop,
    FooterBottom
  },
  data () {
    return {
      topTitle: '医废收集',
      dayData: [],
      weekData: [],
      monthData: [],
      yearData: [],
      wasteType: ['感染性','损伤性','药物性','病理性','化学性', '其它'],
      dayTotalWeight: '',
      monthTotalWeight: '',
      yearTotalWeight: '',
      weekTotalWeight: ''
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
    let that = this;
    pushHistory()
    that.gotoURL(() => { 
      pushHistory()
      this.$router.push({path: 'home'});  //输入要返回的上一级路由地址
      this.changeTitleTxt({tit: '医废监测'})
    });
    // 基于准备好的dom，初始化echarts实例 写在 mounted（）里面
    let vesselEleDay = this.$echarts.init(
      document.getElementById("content-middle-dayData")
    );
    let vesselEleWeek = this.$echarts.init(
      document.getElementById("content-middle-weekData")
    );
    let vesselEleMonth = this.$echarts.init(
      document.getElementById("content-middle-monthData")
    );
    let vesselEleYear = this.$echarts.init(
      document.getElementById("content-middle-yearData")
    );
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
      this.changeTitleTxt({tit:'医废监测'})
    },
    // 跳转到我的页面
    skipMyInfo () {
      this.$router.push({path: 'myInfo'});
      this.changeTitleTxt({tit:'我的'})
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
          y: '22%',
          data: ['感染性','损伤性','药物性','病理性','化学性','其它'],
          textStyle: {
            fontSize: 10
          }
        },
        color: ['#7ff7eb','#3c94c2','#399ad1','#b06c83','#efd5a2','#afd6dd'], 
        series : [
          {
            name: '医废类型',
            type: 'pie',
            radius : '55%',
            center: ['67%', '58%'],
            data: data,
            itemStyle: {
              emphasis: {
                shadowBlur: 0,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
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
      statisticsData(this.userInfo.proId, {workerId: this.userInfo.id}).then((res) => {
        if (res && res.data) {
          if (res.data.code == 200) {
            if (res.data.data.todayList.length > 0 && res.data.data.monthList.length > 0 && res.data.data.sevenDays.length > 0
             && res.data.data.yearList.length > 0) {
              this.dayTotalWeight = res.data.data.today.toFixed(2);
              this.monthTotalWeight = res.data.data.month.toFixed(2);
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
              res.data.data.monthList.forEach((item,index) => {
                this.monthData.push({
                  value: item,
                  name: this.wasteType[index]
                })
              });
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
      width: 100%;
      height: 100vh;
      padding-bottom: 14px;
      overflow: auto;
      background: #fff;
      margin-top: -40px;
      .content-middle-title {
        height: 15vh;
        padding-top: 14px;
        width: 97%;
        margin: 0 auto;
        text-align: center;
        p {
          display: inline-block;
          vertical-align: middle;
          width: 48%;
          border-radius: 4px;
          background: green;
          height: 6vh;
          color: #fff;
          text-align: center;
          line-height: 6vh;
          font-size: 12px
        }
        .day-height {
          margin-right: 10px;
          background: #f25858
        }
        .week-height {
          background: #f2e189
        }
        .month-height {
          margin-top: 10px;
          margin-right: 10px;
          background: #3ad675
        }
        .year-height {
          margin-top: 10px;
          background: #4096c9
        }
      }
      #content-middle-dayData,#content-middle-weekData,#content-middle-monthData,#content-middle-yearData {
        width: 97%;
        margin: 0 auto;
        margin-top: 14px;
        height: 28vh;
        box-shadow: 0 0 5px #c1bcbc
      }
    }
  }
</style>
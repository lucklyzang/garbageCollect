<template>
  <div class="content-wrapper">
    <HeaderTop :title="navTopTitle">
      <van-icon name="arrow-left" slot="left" @click="backTo"></van-icon> 
      <van-icon name="manager-o" slot="right" @click="skipMyInfo"></van-icon> 
    </HeaderTop>
    <div class="content-middle">
      <div id="content-middle-dayData"></div>
      <div id="content-middle-weekData"></div>
      <div id="content-middle-month"></div>
      <div id="content-middle-year"></div>
    </div>
    <!-- <FooterBottom></FooterBottom> -->
  </div>
</template>

<script>
import HeaderTop from '../components/HeaderTop'
import FooterBottom from '../components/FooterBottom'
import { mapGetters, mapMutations } from 'vuex'
import { pushHistory } from '@/common/js/utils'
import {queryBatch} from '../api/rubbishCollect.js'
export default {
   components:{
    HeaderTop,
    FooterBottom
  },
  data () {
    return {
      topTitle: '医废收集',
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
    pushHistory();
    window.onpopstate = () => {
      this.$router.push({path: 'home'});  //输入要返回的上一级路由地址
      this.changeTitleTxt({tit: '医废监测'})
    };
    // 基于准备好的dom，初始化echarts实例 写在 mounted（）里面
    let vesselEle = this.$echarts.init(
      document.getElementById("content-middle-dayData")
    );
    window.onresize = function(){
      vesselEle.resize();           
    }
    this.drawLine(vesselEle)
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
    drawLine (name) {
      name.setOption({
        title : {
        text: '一天各种类型医废收集情况',
        x:'left',
        y: '0'
      },
        tooltip : {
          trigger: 'item',
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          y: '20%',
          data: ['感染性','损伤性','药物性','病理性','化学性','其它']
        },
        series : [
          {
            name: '访问来源',
            type: 'pie',
            radius : '55%',
            center: ['65%', '55%'],
            data:[
              {value:335, name:'感染性'},
              {value:310, name:'损伤性'},
              {value:234, name:'药物性'},
              {value:135, name:'病理性'},
              {value:1548, name:'化学性'},
              {value:1548, name:'其它'}
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 5,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
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
      height: 100%;
      background: #fff;
      #content-middle-dayData {
        width: 100%;
        height: 25vh
      } 
    }
  }
</style>
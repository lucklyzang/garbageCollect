<template>
  <div class="content-wrapper">
    <HeaderTop :title="navTopTitle">
      <van-icon name="arrow-left" slot="left" @click="backTo"></van-icon> 
      <van-icon name="manager-o" slot="right" @click="skipMyInfo"></van-icon> 
    </HeaderTop>
    <div class="content-middle">
      <div class="select-wrapper" ref="selectWrapper">
        <VanFieldSelectPicker
          label="监测区域"
          placeholder="请输入"
          v-model="monitorArea"
          :columns="monitorAreaList"
        />
        <VanFieldSelectPicker
          label="监测点"
          placeholder="请输入"
          v-model="monitorDot"
          :columns="monitorDotList"
        />
        <van-field
          label="出库人员"
          readonly
          placeholder="请输入"
          v-model="outboundPerson"
        />
        <van-field
          label="物品重量"
          readonly
          placeholder="请输入"
          v-model="calculate"
        />
        <VanFieldSelectPicker
          label="交接单位"
          placeholder="请选择"
          v-model="company"
          :columns="companyList"
        />
        <VanFieldSelectPicker
          label="交接人员"
          placeholder="请选择"
          v-model="companyName"
          :columns="companyNameList"
        />
        <VanFieldSelectPicker
          label="车牌号码"
          placeholder="请选择"
          v-model="cardNumber"
          :columns="cardNumberList"
        />
      </div>
    </div>
    <p class="increaseBtn">
      <van-cell-group>
        <van-button  @click="increase" size="normal">新增</van-button>
      </van-cell-group>
    </p>
    <!-- <FooterBottom></FooterBottom> -->
  </div>
</template>

<script>
import HeaderTop from '../components/HeaderTop'
import FooterBottom from '../components/FooterBottom'
import VanFieldSelectPicker from '../components/VanFieldSelectPicker'
import {operateOutStorage, queryCompany, queryMonitorInfo} from '../api/rubbishCollect.js'
import { formatTime, setStore, IsPC} from '@/common/js/utils'
import { mapGetters, mapMutations } from 'vuex'
export default {
  components:{
    HeaderTop,
    FooterBottom,
    VanFieldSelectPicker
  },
  data () {
    return {
      monitorArea: '',
      monitorDot: '',
      cardNumber: '',
      cardNumberList: [],
      itemWeight: this.totalWeight,
      company: '',
      companyList: [],
      companyName: '',
      companyNameList: [],
      monitorAreaList: [],
      monitorDotList: [],
      companyIdList: [],
      outCompanyMsg: []
    };
  },
  computed: {
    ...mapGetters([
      'navTopTitle',
      'totalWeight',
      'batchs',
      'userInfo'
    ]),
    calculate () {
      return Math.round(this.totalWeight * 100) / 100
    },
    // 出库人员
    outboundPerson: {
      get () {
        return this.userInfo.workerName
      },
      set () {}
    }
  },

  mounted () {
    // 控制设备物理返回按键
    if (!IsPC()) {
      let that = this;
      pushHistory()
      that.gotoURL(() => { 
        pushHistory()
        this.$router.push({path: 'medicalOutStorage'});  //输入要返回的上一级路由地址
        this.changeTitleTxt({tit: '医废出库'});
        setStore('currentTitle','医废出库')
      })
    };
    // 键盘弹起时不会遮住输入框
    // if (IsPC()) {
    //   debugger;
    //   let originalHeight = document.documentElement.clientHeight || document.body.clientHeight;
    //   window.onresize = () => {
    //     let resizeHeight = document.documentElement.clientHeight || document.body.clientHeight;
    //     if (resizeHeight < originalHeight) {
    //       return (()=>{
    //         this.$refs['selectWrapper'].style.cssText='height:200px;overflow:auto' 
    //       })()
    //     } else {
    //       this.$refs['selectWrapper'].style.cssText='height:auto' 
    //     }
    //   }
    // };
    // 查询出库公司
    this.queryCompanyInfo();
    // 查询监测区域与监测点信息
    this.queryMonitorMessage()
  },

  watch: {
    // 根据公司名显示对应的车牌号及收集人员姓名
    company: {
      handler (newVal,oldVal) {
        this.companyNameList = [];
        this.cardNumberList = [];
        this.companyName = '';
        this.cardNumber = '';
        let currentCompanyMsg = this.outCompanyMsg.filter((item) => {
          return item.company == this.company
        });
        for (let itemList of currentCompanyMsg) {
          for (let item in itemList) {
            if (Object.prototype.toString.call(itemList[item]) == '[object Object]') {
              Object.keys(itemList[item]).forEach((line) => {
                if (line) {
                  this.companyNameList.push(line);
                }
              })
            } else if (Object.prototype.toString.call(itemList[item]) == '[object Array]') {
              itemList[item].forEach((item) => {
                if (item) {
                  this.cardNumberList.push(item)
                }
              })
            }
          }
        }
      },
      immediate: true
    }
  },

  methods: {
    ...mapMutations([
      'changeTitleTxt',
      'initTotalWeight',
      'initBatchs',
      'changeTotalWeight',
      'initBatchs'
    ]),

    initFormContent () {
      this.monitorArea = '',
      this.monitorDot = '',
      this.cardNumber = '',
      this.company = '',
      this.companyName = '',
      this.changeTotalWeight(0)
    },

    // 返回上一页
    backTo () {
      this.$router.push({name:'medicalOutStorage'});
      this.changeTitleTxt({tit:'医废出库'});
      setStore('currentTitle','医废出库');
    },
    // 跳转到我的页面
    skipMyInfo () {
      this.$router.push({path: 'myInfo'});
      this.changeTitleTxt({tit:'我的'});
      setStore('currentTitle','我的');
    },
    // 新增出库
    increase () {
      let outStorageMsg = {
        cardNumber: this.cardNumber ,//车牌号
        company: this.company, //收集公司
        companyId: '', //交接人员编号this.companyIdList[this.companyNameList.indexOf(this.companyName)]
        companyName: this.companyName, //交接人姓名
        outTime: formatTime('YYYY-MM-DD HH:mm:ss'), //出库时间  格式 yyyy-MM-dd HH:mm:ss
        outTotalWeight: this.calculate,  //出库重量
        batchs: this.batchs, //出库的批次
        monitorArea: this.monitorArea,  //监测区域
		    monitorPoint: this.monitorDot   //监测点
      };
      operateOutStorage(outStorageMsg).then((res) => {
        if (res) {
          if (res.data.code == 200) {
            this.initTotalWeight();
            this.initBatchs();
            this.$dialog.alert({
              message: '医废出库成功',
              closeOnPopstate: true
            }).then(() => {
              this.$router.push({path: 'home'});
              this.changeTitleTxt({tit: '医废监测'});
              setStore('currentTitle','医废监测');
              this.initFormContent()
            });
          } else {
            this.$dialog.alert({
              message: `${res.data.msg}`,
              closeOnPopstate: true
            }).then(() => {
              this.initFormContent();
              this.$router.push({path: 'medicalOutStorage'});
              this.changeTitleTxt({tit: '医废出库'});
              setStore('currentTitle','医废出库');
              this.initBatchs()
            });
          }
        }
      })
      .catch((err) => {
        this.$dialog.alert({
          message: `${err.message}`,
          closeOnPopstate: true
        }).then(() => {
          this.initFormContent();
          this.$router.push({path: 'medicalOutStorage'});
          this.changeTitleTxt({tit: '医废出库'});
          setStore('currentTitle','医废出库');
          this.initBatchs()
        });
        console.log(err)
      })
    },
    // 查询出库公司信息
    queryCompanyInfo () {
      this.companyList = [];
      this.outCompanyMsg = [];
      queryCompany(this.userInfo.proId).then((res) => {
        if (res && res.data.code == 200) {
          if (res.data.data.length > 0) {
            this.outCompanyMsg = res.data.data;
            for (let item of res.data.data) {
              for (let single in item) {
                if (single === 'company' ) {
                  if (item[single] !== '') {
                    this.companyList.push(item[single])
                  }
                }
              }
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

    queryMonitorMessage () {
      this.monitorDotList = [];
      this.monitorAreaList = [];
      queryMonitorInfo(this.userInfo.proId)
      .then((res) => {
        if (res) {
          if (res.data.code == 200) {
            this.monitorDotList = res.data.data['point'];
            this.monitorAreaList = res.data.data['area']
          } else {
            this.$dialog.alert({
              message: `${res.data.msg}`,
              closeOnPopstate: true
            }).then(() => {
            })
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
    .content-middle {
      flex:1;
      overflow: auto;
      .select-wrapper {
        width: 92%;
        height: 100%;
        margin: 0 auto;
        padding-top: 10px;
        box-sizing: border-box;
        /deep/ .van-cell {
          border-bottom: 1px solid #dcdcdc;
          .van-cell__title {
            font-size: 12px
          }
          .van-cell__value {
            font-size: 12px;
            input {
              text-align: right
            }
          }
          .van-icon {
            font-size: 12px
          }
        }
      }
    }
    .increaseBtn {
      padding: 4px 0;
      text-align: center;
        .van-cell-group {
          margin: 0 auto;
          /deep/ .van-button {
          width: 100%;
          background: @color-theme;
          color: #fff;
          border-radius: 0;
          border: none;
          letter-spacing: 2px;
          text-indent: 2px
        }
      }
    }
  }
</style>
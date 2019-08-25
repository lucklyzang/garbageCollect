<template>
  <div class="content-wrapper">
    <HeaderTop :title="navTopTitle">
      <van-icon name="arrow-left" slot="left" @click="backTo"></van-icon> 
      <van-icon name="manager-o" slot="right" @click.native="backTo"></van-icon> 
    </HeaderTop>
    <div class="content-middle">
      <p class="select-wrapper">
        <van-field
          label="监测区域"
          placeholder="请输入"
          v-model="monitorArea"
        />
        <van-field
          label="监测点"
          placeholder="请输入"
          v-model="monitorDot"
        />
        <van-field
          label="车牌号码"
          placeholder="请输入"
          v-model="cardNumber"
        />
        <van-field
          label="出库人员"
          placeholder="请输入"
          v-model="outboundPerson"
        />
        <van-field
          label="物品重量"
          readonly
          placeholder="请输入"
          v-model="calculate"
        />
        <van-field
          label="交接单位"
          placeholder="请输入"
          v-model="company"
        />
        <van-field
          label="交接人员"
          placeholder="请输入"
          v-model="companyName"
        />
      </p>
      <p class="increaseBtn">
        <van-cell-group>
          <van-button  @click="increase">新增</van-button>
        </van-cell-group>
      </p>
    </div>
    <FooterBottom></FooterBottom>
  </div>
</template>

<script>
import HeaderTop from '../components/HeaderTop'
import FooterBottom from '../components/FooterBottom'
import VanFieldSelectPicker from '../components/VanFieldSelectPicker'
import {operateOutStorage} from '../api/rubbishCollect.js'
import { mapGetters } from 'vuex'
import { mapMutations } from 'vuex'
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
      outboundPerson: '',
      itemWeight: this.totalWeight,
      company: '',
      companyName: ''
    };
  },
  computed: {
    ...mapGetters([
      'navTopTitle',
      'totalWeight',
      'batchs'
    ]),
    calculate () {
      return Math.round(this.totalWeight * 100) / 100
    }
  },

  mounted () {},

  methods: {
    ...mapMutations([
      'changeTitleTxt',
      'initTotalWeight',
      'initBatchs'
    ]),
    // 返回上一页
    backTo () {
      this.$router.go(-1);
      this.changeTitleTxt({tit:'医废监测'})
    },
    // 新增出库
    increase () {
      let outStorageMsg = {
        cardNumber: this.cardNumber ,//车牌号
        company: this.company, //收集公司
        companyId: '',       //交接人员编号
        companyName: this.companyName, //交接人姓名
        outTime: this.formatTime(), //出库时间  格式 yyyy-MM-dd HH:mm:ss
        outTotalWeight: this.calculate,  //出库重量
        batchs: this.batchs, //出库的批次
      };
      operateOutStorage(outStorageMsg).then((res) => {
        if (res) {
          if (res.data.code == 200) {
            this.initTotalWeight();
            this.initBatchs();
            this.$dialog.alert({
              message: '医废出库成功'
            }).then(() => {
              // this.sweepAstoffice()
            });
          } else {
            this.$dialog.alert({
              message: '医废出库失败'
            }).then(() => {
              // this.sweepAstoffice()
            });
          }
        }
      })
      .catch((err) => {
        this.$dialog.alert({
          message: '医废出库失败'
        }).then(() => {
          // this.sweepAstoffice()
        });
        console.log(err)
      })
    },
    // 时间格式方法
    formatTime () {
      return this.$moment(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss')
    }
  }
}

</script>
<style lang='less' scoped>
  .content-wrapper {
     /deep/ .van-icon-arrow-left {
      position: absolute;
      top: 44px;
      left: 4px;
      font-size: 20px;
      color: #fff
    }
    /deep/ .van-icon-manager-o {
      position: absolute;
      top: 44px;
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
      margin-top: 80px;
      background: #fff;
      .select-wrapper {
        width: 92%;
        margin: 0 auto;
        padding-top: 10px;
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
      .increaseBtn {
        width: 92%;
        margin: 0 auto;
        padding-top: 10px;
          .van-cell-group {
            width: 100%;
            margin: 0 auto;
            /deep/ .van-button {
            width: 100%;
            margin-top: 35px;
            background: #38bdd0;
            color: #fff;
            border-radius: 0;
            font-size: 12px;
            border-radius: 30px;
            height: 35px;
            border: none;
            line-height: 35px;
          }
        }
      }
    }
  }
</style>
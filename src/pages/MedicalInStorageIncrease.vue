<template>
  <div class="content-wrapper">
    <HeaderTop :title="navTopTitle">
      <van-icon name="arrow-left" slot="left" @click="backTo"></van-icon> 
      <van-icon name="manager-o" slot="right" @click.native="backTo"></van-icon> 
    </HeaderTop>
    <div class="content-middle">
      <p class="select-wrapper">
        <van-field-select-picker
          label="监测区域"
          placeholder="请选择"
          v-model="monitorArea"
          :columns="[1, 2, 3]"
        />
        <van-field-select-picker
          label="监测点"
          placeholder="请选择"
          v-model="monitorDot"
          :columns="[1, 2, 3]"
        />
        <van-field-select-picker
          label="车牌号码"
          placeholder="请选择"
          v-model="licenseNumber"
          :columns="['1', '2', '3']"
        />
        <van-field-select-picker
          label="出库人员"
          placeholder="请选择"
          v-model="outboundPerson"
          :columns="[1, 2, 3]"
        />
        <van-field-select-picker
          label="物品重量"
          placeholder="请选择"
          v-model="itemWeight"
          :columns="[1, 2, 3]"
        />
        <van-field-select-picker
          label="交接单位"
          placeholder="请选择"
          v-model="transferUnits"
          :columns="[1, 2, 3]"
        />
        <van-field-select-picker
          label="交接人员"
          placeholder="请选择"
          v-model="transferStaff"
          :columns="[1, 2, 3]"
        />
      </p>
      <p class="increaseBtn">
        <van-cell-group>
          <van-button  @click.native="increase">新增</van-button>
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
      licenseNumber: '',
      outboundPerson: '',
      itemWeight: '',
      transferUnits: '',
      transferStaff: ''
    };
  },
  computed: {
    ...mapGetters([
      'navTopTitle',
    ])
  },

  mounted () {},

  methods: {
    ...mapMutations([
      'changeTitleTxt', 
    ]),
    // 返回上一页
    backTo () {
      this.$router.go(-1);
      this.changeTitleTxt({tit:'医废监测'})
    },
    // 新增入库
    increase () {

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
<template>
  <div class="content-wrapper">
    <HeaderTop :title="navTopTitle">
      <van-icon name="arrow-left" slot="left" @click="backTo"></van-icon> 
      <van-icon name="manager-o" slot="right" @click.native="backTo"></van-icon> 
    </HeaderTop>
    <div class="content-middle">
      <div class="changeBtn">
        <van-checkbox v-model="checked">全选</van-checkbox>
      </div>
      <div class="content-middle-list">
        <div class="content-middle-list-item" v-for="item in classList">
          <div class="change-btn-position">
            <van-checkbox v-model="checked"></van-checkbox>
          </div>
          <div class="list-item">
            <p class="list-item-left">回收趟次: {{item.times}}</p>
            <div class="list-strip">
              <p class="list-times">收集人员: {{item.times}}</p>
              <p class="list-code">时间: {{item.collectTime}}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="btn-group">
        <van-button type="info" @click="sureInStorage" size="small">确定</van-button>
      </div>
    </div>
    <FooterBottom></FooterBottom>
  </div>
</template>

<script>
import HeaderTop from '../components/HeaderTop'
import FooterBottom from '../components/FooterBottom'
import { mapGetters } from 'vuex'
import { mapMutations } from 'vuex'
export default {
   components:{
    HeaderTop,
    FooterBottom
  },
  data () {
    return {
      topTitle: '医废收集',
      stagingMsg: '',
      checked: true,
      classList: [
        {type: '血液透析/感染性', weight: '3.04', collectTime: '2019-8-23 16:38:47', sign: '0912121212',times: '12121212121212', code: '1212121', peopleName: '王克荛'},
        {type: '血液透析/感染性', weight: '3.04', collectTime: '2019-8-23 16:38:47', sign: '0912121212',times: '12121212121212', code: '1212121', peopleName: '王克荛'}
      ]
    };
  },
  computed: {
    ...mapGetters([
      'navTopTitle',
    ])
  },

  mounted() {
  },
  methods: {
    ...mapMutations([
      'changeTitleTxt', 
    ]),
    // 返回上一页
    backTo () {
      this.$router.go(-1);
      this.changeTitleTxt({tit:'医废监测'})
    },
    //确定入库
    sureInStorage () {
      this.$router.push({path:'medicalInStorageIncrease'});
      this.changeTitleTxt({tit: '医废入库新增'});
    }
  }
}

</script>
<style lang='less' scoped>
  .content-wrapper {
    margin-top: 100px;
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
      .changeBtn {
        height: 40px;
        background: #fbfbfb;
        line-height: 40px;
        padding-left: 10px;
        /deep/ .van-icon {
          background: #38bdd0;
          border-color: #38bdd0
        }
      }
      .content-middle-list {
        height: 420px;
        overflow: auto;
        .content-middle-list-item {
          position: relative;
          box-sizing: border-box;
          padding: 10px 80px;
          height: 100px;
          border-bottom: 1px solid #e8e4e4;
          .change-btn-position {
            position: absolute;
            top: 30px;
            left: 10px;
            /deep/ .van-icon {
              background: #38bdd0;
              border-color: #38bdd0
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
              bottom: 2px;
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
        margin-top: 20px;
        text-align: center;
        button {
          background: #38bdd0;
          border: 1px solid #e7e9ec;
        }
      }
    }
  }
</style>
<template>
  <div class="content-wrapper">
    <HeaderTop :title="navTopTitle">
      <van-icon name="arrow-left" slot="left" @click="backTo"></van-icon> 
    </HeaderTop>
    <div class="content-middle">
      <div class="content-middle-top">
        <van-cell-group>
          <van-field
            v-model="handleMessage"
            label="处理意见"
            type="textarea"
            placeholder="请输入处理意见"
            rows="1"
            autosize
          />
        </van-cell-group>
      </div>
      <div class="content-middle-bottom">
        <van-cell-group>
          <van-button  @click="sureInfo" size="normal">确定</van-button>
        </van-cell-group>
      </div>
    </div>
    <!-- <FooterBottom></FooterBottom> -->
  </div>
</template>

<script>
import HeaderTop from '../components/HeaderTop'
import FooterBottom from '../components/FooterBottom'
import { mapGetters, mapMutations } from 'vuex'
import { formatTime } from '@/common/js/utils'
import {warningDispose} from '../api/rubbishCollect.js'
import {queryCollectHistory} from '../api/rubbishCollect.js'
export default {
  components: {
    HeaderTop,
    FooterBottom
  },
  data () {
    return {
      handleMessage: ''
    };
  },
  computed: {
    ...mapGetters([
      'navTopTitle',
      'userInfo',
      'warningInfo'
    ]),
    getUserInfo () {
      return this.userInfo.proId
    }
  },

  mounted () {
    // 控制设备物理返回按键
    let that = this;
    pushHistory()
    that.gotoURL(() => { 
      pushHistory()
      this.$router.push({path: 'abnormalWarning'});  //输入要返回的上一级路由地址
      this.changeTitleTxt({tit: '医废预警'})
    });
    this.handleMessage = '';
  },

  methods: {
    ...mapMutations([
      'changeTitleTxt',
      'initWaningInfo'
    ]),
    // 返回上一页
    backTo () {
      this.$router.push({path: 'abnormalWarning'});
      this.changeTitleTxt({tit: '医废预警'});
      this.initWaningInfo()
    },
    // 提交处理意见
    sureInfo () {
      if (this.handleMessage.length == 0) {
        this.$dialog.alert({
            closeOnPopstate: true,
            message: '处理意见不能为空'
        }).then(() => {
        });
        return
      }
      let disposeMsg = {
        id: this.warningInfo.id,  //预警ID
        dealId: this.userInfo.id,  //预警处理人ID,
        dealName: this.userInfo.workerName, //预警处理人姓名,			
        warnReason: this.handleMessage,   //预警原因  
        state: 1, //状态，处理时传1，审核时传2
        dealTime: formatTime('YYYY-MM-DD HH:mm:ss')    
      };
      warningDispose(disposeMsg).then((res) => {
        if (res.data.code == 200) {
          this.$dialog.alert({
            closeOnPopstate: true,
            message: '处理成功'
          }).then(() => {
            this.initWaningInfo();
            this.handleMessage = '';
            this.$router.push({path: 'abnormalWarning'})
            this.changeTitleTxt({tit:'医废预警'})
          });
        } else {
          this.$dialog.alert({
            closeOnPopstate: true,
            message: `${res.data.msg}`
          }).then(() => {
            this.handleMessage = '';
          });
        }
      })
      .catch((err) => {
        this.$dialog.alert({
          closeOnPopstate: true,
          message: `${err.message}`
        }).then(() => {
          this.handleMessage = '';
        });
      })
    }
  }
}

</script>
<style lang='less' scoped>
  @import "../common/stylus/variable.less";
  @import "../common/stylus/modifyUi.less";
  .content-wrapper {
    .content-middle {
     .content-middle(0,'');
      .content-middle-top {
        margin-top: 80px;
        height: 80vh;
        overflow: auto;
      }
      .content-middle-bottom {
         width: 100%;
        position: fixed;
        bottom: 6px;
        left: 0;
          .van-cell-group {
            width: 80%;
            margin: 0 auto;
            background-color: transparent;
            /deep/ .van-button {
            width: 100%;
            margin-top: 35px;
            background: @color-theme;
            color: #fff;
            border-radius: 0;
            border: none;
            line-height: 35px;
            padding: 0 120px
          }
          &:after {
            display: none
          }
        }
      }
    }
  }
</style>
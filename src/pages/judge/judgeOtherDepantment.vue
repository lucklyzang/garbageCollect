<template>
  <div></div>
</template>

<script>
import { mapMutations } from 'vuex'
import { formatTime, setStore, getStore, removeStore, IsPC } from '@/common/js/utils'
export default {
  data () {
    return {
    };
  },

  mounted() {
    this.showDialog();
    // 控制设备物理返回按键
    if (!IsPC()) {
      pushHistory();
      this.gotoURL(() => { 
        pushHistory();
        this.$dialog.alert({
          message: '请先处理是否其它科室搜集弹框',
          closeOnPopstate: true
        }).then(() => {
          this.showDialog()
        });
      })
    }
  },

  methods: {
    ...mapMutations([
      'changeTitleTxt',
      'changeFlowState',
      'clearTrashStore',
      'changePrintBtn',
      'changeOtherBtn',
      'changeCollectBtn',
      'changeSureBtn',
      'changeBackoutBtn',
      'changeClickBackoutBtn',
      'changeCurrentActive',
      'changeBagCodeShow',
      'changeAstOfficeShow',
      'changeStaffCodeShow',
      'changebluetoothWeighShow',
      'changeCodeStep',
      'changeManualWeighShow',
      'changeIsCollectCurrentOffice'
    ]),

    showDialog () {
      this.$dialog.confirm({
        message: '是否其它科室收集?',
        closeOnPopstate: true
      }).then(() => {
        this.$router.push({path: 'medicalCollect'});
        this.changeTitleTxt({tit: '医废收集'});
        setStore('currentTitle','医废收集');
        this.initState()
      }).catch(() => {
        this.$router.push({path:'home'});
        this.changeTitleTxt({tit: '医废监测'});
        setStore('currentTitle','医废监测');
        this.initState()
      });
    },

    //清除部分存储信息
    clearPartStorage () {
      removeStore('currentCollectMsg');
      removeStore('currentStep');
      removeStore('weightMethods')
    },

    // 返回到首页和收集页的状态重置
    initState () {
      // 清空上个科室存储的数据
      this.clearTrashStore();
      this.changeFlowState(-1);
      this.changeClickBackoutBtn(false);
      this.changePrintBtn(false);
      this.changeBagCodeShow(false);
      this.changeAstOfficeShow(false);
      this.changeStaffCodeShow(false);
      this.changebluetoothWeighShow(false);
      this.changeManualWeighShow(false);
      this.changeCollectBtn(true);
      this.changeSureBtn(false);
      this.changeBackoutBtn(true);
      this.changeOtherBtn(false);
      this.clearPartStorage()
    }
  }
}

</script>
<style lang='less' scoped>
</style>
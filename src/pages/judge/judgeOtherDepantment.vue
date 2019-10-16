<template>
  <div></div>
</template>

<script>
import { mapMutations } from 'vuex'
import { formatTime, setStore, getStore, removeStore } from '@/common/js/utils'
export default {
  data () {
    return {
    };
  },

  mounted() {
    this.showDialog();
    // 控制设备物理返回按键
    pushHistory();
    this.gotoURL(() => { 
      pushHistory();
      this.$dialog.alert({
        message: '请先处理是否其它科室搜集弹框',
        closeOnPopstate: true
      }).then(() => {
        this.showDialog()
      });
    });
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
      'changeCurrentLajicodeState',
      'changeBackoutBtn',
      'changeClickBackoutBtn',
      'changeCurrentActive',
      'changeBagCodeShow',
      'changeAstOfficeShow',
      'changeStaffCodeShow',
      'changebluetoothWeighShow',
      'changeCodeStep',
      'changeManualWeighShow'
    ]),
    showDialog () {
      this.$dialog.confirm({
        message: '是否其它科室收集?',
        closeOnPopstate: true
      }).then(() => {
        this.changeFlowState(-1);
        this.$router.push({path: 'medicalCollect'});
        this.changeTitleTxt({tit: '医废收集'});
        this.changeCollectBtn(true);
        this.changeSureBtn(false);
        this.changePrintBtn(false);
        this.changeOtherBtn(false);
        this.changeClickBackoutBtn(false);
        this.changeBagCodeShow(false);
        this.changeAstOfficeShow(false);
        this.changeStaffCodeShow(false);
        this.changebluetoothWeighShow(false);
        this.changeManualWeighShow(false);
        // 清空上个科室存储的数据
        this.clearTrashStore();
        this.changeCurrentLajicodeState(false);
        this.changeBackoutBtn(true);
        removeStore('currentCollectMsg');
        removeStore('currentStep');
        removeStore('weightMethods');
        removeStore('continueCurrentCollect')
      }).catch(() => {
        this.$router.push({path:'medicalInStorage'});
        this.changeTitleTxt({tit: '医废入库'});
        // 清空上个科室存储的数据
        this.clearTrashStore();
        this.changeFlowState(-1);
        this.changeClickBackoutBtn(false);
        this.changePrintBtn(false);
        this.changeCurrentLajicodeState(false);
        this.changeBagCodeShow(false);
        this.changeAstOfficeShow(false);
        this.changeStaffCodeShow(false);
        this.changebluetoothWeighShow(false);
        this.changeManualWeighShow(false);
        this.changeCollectBtn(true);
        this.changeSureBtn(false);
        this.changeBackoutBtn(true);
        this.changeOtherBtn(false);
        removeStore('currentCollectMsg');
        removeStore('currentStep');
        removeStore('weightMethods');
        removeStore('continueCurrentCollect')
      });
    }
  }
}

</script>
<style lang='less' scoped>
</style>
<template>
  <div></div>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'
import { formatTime, setStore, getStore, removeStore } from '@/common/js/utils'
export default {
  data () {
    return {
    };
  },
 
  computed:{
    ...mapGetters(['garColMsg'])
  },

  mounted() {
    this.showDialog();
    // 控制设备物理返回按键
    pushHistory();
    this.gotoURL(() => { 
      pushHistory();
      setTimeout(() => {
        this.$dialog.alert({
          message: '请先处理是否当前科室继续收集弹框',
          closeOnPopstate: true
        }).then(() => {
          this.showDialog()
        })
      },10)
    });
  },

  methods: {
    ...mapMutations([
      'changeFlowState',
      'changeCollectBtn',
      'changeSureBtn',
      'changePrintBtn',
      'changeOtherBtn',
      'changeCurrentLajicodeState',
      'changeClickBackoutBtn',
      'changeCurrentActive',
      'changebluetoothWeighShow',
      'changeStaffCodeShow',
      'changeBagCodeShow',
      'changeBackoutBtn',
      'changeAstOfficeShow',
      'changeManualWeighShow',
      'changeIsCollectCurrentOffice'
    ]),
    showDialog () {
      this.$dialog.confirm({
        message: '是否当前科室继续收集?',
        closeOnPopstate: true
      }).then(() => {
        this.$router.push({path: 'medicalCollect'});
        this.changeFlowState(1);
        this.changeCurrentLajicodeState(false);
        this.changeCollectBtn(false);
        this.changeBackoutBtn(true);
        this.changeSureBtn(true);
        this.changePrintBtn(false);
        this.changeOtherBtn(false);
        this.changeClickBackoutBtn(false);
        this.changeBagCodeShow(false);
        this.changeStaffCodeShow(false);
        this.changebluetoothWeighShow(false);
        this.changeManualWeighShow(false);
        this.changeIsCollectCurrentOffice(true);
        setStore('currentCollectMsg', this.garColMsg);
        setStore('currentStep', 0);
      }).catch(() => {
        this.$router.push({path: 'medicalCollect'});
        this.changeFlowState(2);
        this.changeCurrentLajicodeState(true);
        this.changeCollectBtn(false);
        this.changeBackoutBtn(true);
        this.changeSureBtn(true);
        this.changePrintBtn(false);
        this.changeOtherBtn(false);
        this.changeClickBackoutBtn(false);
        this.changeBagCodeShow(false);
        this.changeAstOfficeShow(false);
        this.changeStaffCodeShow(false);
        this.changeIsCollectCurrentOffice(false);
        setStore('currentCollectMsg', this.garColMsg);
        setStore('currentStep', 2);
      });
    }
  }
}

</script>
<style lang='less' scoped>
</style>
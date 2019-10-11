<template>
  <div></div>
</template>

<script>
import { mapMutations } from 'vuex'
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
      'changeBackoutBtn'
    ]),
    showDialog () {
      this.$dialog.confirm({
        message: '是否当前科室继续收集?',
        closeOnPopstate: true
      }).then(() => {
        this.$router.push({path: 'medicalCollect'});
        this.changeFlowState(2);
        this.changeCollectBtn(false);
        this.changeBackoutBtn(true);
        this.changeSureBtn(true);
        this.changePrintBtn(false);
        this.changeOtherBtn(false);
        this.changeCurrentLajicodeState(false);
        this.changeClickBackoutBtn(false);
        this.changeBagCodeShow(false);
        this.changebluetoothWeighShow(false);
        this.changeStaffCodeShow(true)
      }).catch(() => {
        this.changeCurrentLajicodeState(false);
        this.$router.replace({path:'judgeCurrentCollectFinish'});
        this.changeClickBackoutBtn(false);
        this.changeBagCodeShow(false);
        this.changebluetoothWeighShow(false)   
      });
    }
  }
}

</script>
<style lang='less' scoped>
</style>
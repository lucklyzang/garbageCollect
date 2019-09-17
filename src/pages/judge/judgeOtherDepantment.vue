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

  components: {},

  computed: {},

  mounted() {
    this.showDialog()
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
      'changeIsExecute'
    ]),
    showDialog () {
      this.$dialog.confirm({
        message: '是否其它科室收集?',
        closeOnPopstate: true
      }).then(() => {
        this.changeIsExecute(true);
        this.changeFlowState(0);
        this.$router.push({path: 'medicalCollect'});
        this.changeCollectBtn(true);
        this.changeSureBtn(false);
        this.changePrintBtn(false);
        this.changeOtherBtn(false);
        this.changeClickBackoutBtn(false);
        this.changeBagCodeShow(false);
        this.changeAstOfficeShow(false);
        this.changeStaffCodeShow(false);
        this.changebluetoothWeighShow(false);
        // 清空上个科室存储的数据
        this.clearTrashStore();
        this.changeCurrentLajicodeState(false);
        this.changeBackoutBtn(true)
      }).catch(() => {
        this.changeIsExecute(true);
        this.$router.push({path:'medicalInStorage'});
        this.changeTitleTxt({tit: '医废入库'});
        // 清空上个科室存储的数据
        this.clearTrashStore();
        this.changeFlowState(0);
        this.changeClickBackoutBtn(false);
        this.changePrintBtn(false);
        this.changeCurrentLajicodeState(false);
        this.changeBagCodeShow(false);
        this.changeAstOfficeShow(false);
        this.changeStaffCodeShow(false);
        this.changebluetoothWeighShow(false);
        this.changeCollectBtn(true);
        this.changeSureBtn(false);
        this.changeBackoutBtn(true);
        this.changeOtherBtn(false); 
      });
    }
  }
}

</script>
<style lang='less' scoped>
</style>
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
      'changeBackoutBtn'
    ]),
    showDialog () {
      this.$dialog.confirm({
        message: '是否其它科室收集?'
      }).then(() => {
        this.changeFlowState(0);
        this.$router.push({path: 'medicalCollect'});
        this.changeCollectBtn(true);
        this.changeSureBtn(false);
        this.changePrintBtn(false);
        this.changeOtherBtn(false);
        // 清空上个科室存储的数据
        this.clearTrashStore();
        this.changeCurrentLajicodeState(false);
        this.changeBackoutBtn(true)
      }).catch(() => {
        this.$router.push({path:'medicalInStorage'});
        this.changeTitleTxt({tit: '医废入库'});
        // 清空上个科室存储的数据
        this.clearTrashStore();
        this.changeCurrentLajicodeState(false);
        this.changeBackoutBtn(true)   
      });
    }
  }
}

</script>
<style lang='less' scoped>
</style>
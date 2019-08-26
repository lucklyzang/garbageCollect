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
      'changeFlowState',
      'changeCollectBtn',
      'changeSureBtn',
      'changePrintBtn',
      'changeOtherBtn'
    ]),
    showDialog () {
      this.$dialog.confirm({
        message: '是否当前科室继续收集?'
      }).then(() => {
        this.$router.replace({path: 'medicalCollect'});
        this.changeFlowState(2);
        this.changeCollectBtn(false);
        this.changeSureBtn(true);
        this.changePrintBtn(false);
        this.changeOtherBtn(false)
      }).catch(() => {
        this.$router.push({path:'judgeCurrentCollectFinish'})   
      });
    }
  }
}

</script>
<style lang='less' scoped>
</style>
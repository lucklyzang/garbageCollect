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
    ]),
    showDialog () {
      this.$dialog.confirm({
        title: '',
        message: '是否当前科室继续收集?'
      }).then(() => {
        this.$router.replace({path: 'medicalCollect'});
        this.changeFlowState(2)
      }).catch(() => {
        this.$router.push({path:'judgeCurrentCollectFinish'})   
      });
    }
  }
}

</script>
<style lang='less' scoped>
</style>
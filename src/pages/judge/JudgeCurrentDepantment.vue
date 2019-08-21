<template>
  <div></div>
</template>

<script>
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
    showDialog () {
      this.$dialog.confirm({
        title: '',
        message: '是否科室继续收集'
      }).then(() => {
        this.$router.replace({path: 'medicalCollect'})
      }).catch(() => {
        this.$router.push({path:'judgeCurrentCollectFinish'})   
      });
    }
  }
}

</script>
<style lang='less' scoped>
</style>
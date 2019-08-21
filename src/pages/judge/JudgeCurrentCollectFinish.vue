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
        message: '此次收集已完成'
      }).then(() => {
      }).catch(() => {
        this.$router.replace({path: 'judgeCurrentDepantment'})
      });
    }
  }
}
</script>
<style lang='less' scoped>
</style>
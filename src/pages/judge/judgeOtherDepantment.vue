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
    ]),
    showDialog () {
      this.$dialog.confirm({
        title: '',
        message: '是否其它科室收集'
      }).then(() => {
        this.$router.replace({path: 'medicalCollect'})
      }).catch(() => {
        this.$router.replace({path:'medicalInStorage'});
        this.changeTitleTxt({tit: '医废入库'})   
      });
    }
  }
}

</script>
<style lang='less' scoped>
</style>
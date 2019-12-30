<template>
  <div></div>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'
import { formatTime, setStore, getStore, removeStore, IsPC } from '@/common/js/utils'
export default {
  data () {
    return {
    };
  },
 
  computed:{
    ...mapGetters(['garColMsg','lajiCode','lanyaCz'])
  },

  mounted() {
    this.showDialog();
    // 控制设备物理返回按键
    if (!IsPC()) {
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
      })
    }
  },

  methods: {
    ...mapMutations([
      'changeFlowState',
      'changeCollectBtn',
      'changeSureBtn',
      'changePrintBtn',
      'changeOtherBtn',
      'changeClickBackoutBtn',
      'changeCurrentActive',
      'changebluetoothWeighShow',
      'changeStaffCodeShow',
      'changeBagCodeShow',
      'changeBackoutBtn',
      'changeAstOfficeShow',
      'changeManualWeighShow',
      'changeIsCollectCurrentOffice',
      'changeTitleTxt'
    ]),
    showDialog () {
      this.$dialog.confirm({
        message: '是否当前科室继续收集?',
        closeOnPopstate: true,
        confirmButtonColor: 'black',
        cancelButtonColor: 'red'
      }).then(() => {
        this.$router.push({path: 'medicalCollect'});
        this.changeTitleTxt({tit: '医废收集'});
        setStore('currentTitle','医废收集');
        this.changeFlowState(1)
      }).catch(() => {
        if (this.lajiCode.length !== 0) {
          this.$router.replace({path:'judgeCurrentCollectFinish'})
        } else {
          this.$router.replace({path:'judgeOtherDepantment'})
         }
      })
    }
  }
}

</script>
<style lang='less' scoped>
</style>
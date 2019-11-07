<template>
  <div class="loading-hint" v-show="isShow">
    <van-loading :size="size" :type="typeShape" :text-size="textSize" vertical :color="textColor">
      {{textContent}}
    </van-loading>
  </div>
</template>

<script>
export default {
  props: {
    size : {
      type: String,
      default: '30px'
    },
    typeShape : {
      type: String,
      default: 'spinner'
    },
    textSize : {
      type: String,
      default: '16px'
    },
    textColor : {  
      type: String,
      default: '#05dc00'
    },
    isShow: {
      type: Boolean,
      default: false
    },
    textContent: {
      type: String,
      default: '数据加载中····'
    }
  },
  data () {
    return {
    };
  },
  components: {},

  computed: {},

  mounted () {},

  methods: {}
}

</script>
<style lang='less' scoped>
@import "../common/stylus/variable.less";
@import "../common/stylus/modifyUi.less";
@import "../common/stylus/mixin.less";
.loading-hint {
  .init-height();
}
</style>
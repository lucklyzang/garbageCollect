<template>
  <div class="footer">
      <div class="foot-item" v-for="item in itemFooter">
        <img src="" alt="">
        <p>{{item.itemText}}</p>
      </div>
    </div>
</template>

<script>
export default {
  data () {
    return {
      itemFooter: [
          { itemText: '首页', imgUrl: ''},{ itemText: '消息', imgUrl: ''},
          { itemText: '社区', imgUrl: ''},{ itemText: '我的', imgUrl: ''},
        ]
    };
  },

  components: {},

  computed: {},

  mounted() {},

  methods: {}
}

</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "../common/stylus/variable.styl"
@import "../common/stylus/mixin.styl"
  .footer
      width 100%
      height 58px
      display flex
      position fixed
      bottom 0
      background $color-theme
      flex-direction row
      flex-wrap wrap
      .foot-item
        flex-direction column
        width 25%
        height 58px
        display: flex
        align-items: center
        font-size 12px
        justify-content: center
        img
          width 20px
          height 20px
        p 
          margin-top 6px
          font-size 14px
          color #fff   
</style>
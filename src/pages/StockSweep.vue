<template>
  <div class="content-wrapper">
    <div class="content-img">
      <p>医护人员扫码</p>
      <p class="img-cover"></p>
    </div>
  </div>
</template>

<script>
export default {
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
  .content-wrapper {
    margin-top: 100px;
    .content-img {
      width: 80%;
      height: 300px;
      margin: 0 auto;
      text-align: center;
      .img-cover {
        width: 100%;
        height: 100%;
        background: url(../common/images/sweep-code.gif)  no-repeat center center/cover
      }
    }
  }
</style>
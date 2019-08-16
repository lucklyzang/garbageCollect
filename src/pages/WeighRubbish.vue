<template>
  <div class="content-wrapper">
    <div class="content-img">
      <p>垃圾称重</p>
      <div class="flex-table">
        <div class="item itemOne">1</div>
        <div class="item itemOne">2</div>
        <div class="item itemOne">3</div>
        <div class="item itemOne">4</div>
        <div class="item itemOne">5</div>
        <div class="item itemOne">6</div>
        <div class="item itemOne">7</div>
        <div class="item itemOne">8</div>
        <div class="item itemOne">9</div>
      </div>
      <!-- <img src="../common/images/sweep-code.gif" alt=""> -->
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

  methods: {
     onClickLeft() {
      Toast('返回');
    },
    onClickRight() {
      Toast('按钮');
    }

  }
}

</script>
<style lang='less' scoped>
  .content-wrapper {
    margin-top: 100px;
    .content-img {
      width: 100%;
      text-align: center;
      img {
        width: 70%;
        height: auto
      }
      .flex-table {
        width: 100%;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        font-size: 24px;
        justify-content: center;
        .item {
          width: 30%;
          height: 40px;
          box-sizing: border-box;
          border: 1px solid #000;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
  }
</style>
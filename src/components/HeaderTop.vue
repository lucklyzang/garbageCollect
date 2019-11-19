<template>
  <header class="header">
    <slot name="left" class="left"></slot>
    <span class="header_title">
      <span class="header_title_text ellipsis">{{title}}</span>
    </span>
    <slot name="right" class="right"></slot>
  </header>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import Loading from '../components/Loading'
import {queryWarning, warningDispose} from '../api/rubbishCollect.js'
import { formatTime, setStore, IsPC} from '@/common/js/utils'
  export default {
    props:{
      title:String
    }
  }
</script>

<style lang='less' scoped>
  @import "../common/stylus/mixin.less";
  @import "../common/stylus/variable.less";
  .header {
    background-color: @color-theme;
    width: 100%;
    height: @header-title-height;
    line-height: @header-title-height;
    .header_title {
      position: absolute;
      top: .8rem;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 50%;
      color: #fff;
      text-align: center;
      .header_title_text {
        font-size: 18px;
        color: #fff;
        display: block
      }
    }
  }
</style>

<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"/>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"/>
  </div>

</template>
<script>
  export default {
    // mounted () {
    //    if (!!window.ActiveXObject || 'ActiveXObject' in window) {
    //   window.addEventListener('hashchange', () => {
    //       let currentPath = window.location.hash.slice(1)
    //       if (this.$route.path !== currentPath) {
    //           this.$router.push(currentPath);// 主动更改路由界面
    //       }
    //   }, false);
    // }
    // }
  }
  //App接口
  window['setAppInfo'] =function (uid,os) {
    window.os=os
    window.uid=uid
  }
  //H5接口
  window.addEventListener('message',function(event){
    let data = event.data
    if(data.os !== undefined){
      window.os=data.os
      window.uid=data.uid
    }
  },false)
</script>
<style lang="less" scoped>

</style>

<template>
  <div class="content-wrapper">
    <HeaderTop :title="navTopTitle">
      <van-icon name="arrow-left" slot="left" @click="backTo"></van-icon>
      <van-icon name="manager-o" slot="right" @click="skipMyInfo"></van-icon>  
    </HeaderTop>
    <ul class="left-dropDown" v-show="leftDownShow">
      <li v-for="(item, index) in leftDropdownDataList" :class="{liStyle:liIndex == index}" @click="leftLiCLick(index)">{{item}}</li>
    </ul>
    <div class="content-middle">
      <div class="content-middle-top">
        
      </div>
    </div>
    <!-- <FooterBottom></FooterBottom> -->
  </div>
</template>

<script>
import HeaderTop from '../components/HeaderTop'
import FooterBottom from '../components/FooterBottom'
import { mapGetters, mapMutations } from 'vuex'
import { formatTime, setStore, removeStore, IsPC } from '@/common/js/utils'
import {getDictionaryData} from '@/api/login.js'
export default {
  components: {
    HeaderTop,
    FooterBottom
  },
  data () {
    return {
      leftDownShow: false,
      liIndex: null,
      leftDropdownDataList: ['刷新','我的']
    };
  },
  computed: {
    ...mapGetters([
      'navTopTitle',
      'userInfo',
    ]),
    getUserInfo () {
      return this.userInfo.proId
    }
  },

  mounted () {
    // 控制设备物理返回按键
    if (!IsPC()) {
      let that = this;
      pushHistory();
      that.gotoURL(() => { 
        pushHistory()
        this.$router.push({path: 'home'});  //输入要返回的上一级路由地址
        this.changeTitleTxt({tit: '医废监测'});
        setStore('currentTitle','医废监测');
      })
    }
  },

  methods: {
    ...mapMutations([
      'changeTitleTxt'
    ]),
    // 返回上一页
    backTo () {
      this.$router.push({path: 'home'});
      this.changeTitleTxt({tit: '医废监测'});
      setStore('currentTitle','医废监测');
    },
    // 右边下拉框菜单点击
    leftLiCLick (index) {
      this.liIndex = index;
      if (this.liIndex == 1) {
        this.$router.push({path: 'myInfo'});
        this.changeTitleTxt({tit:'我的'});
        setStore('currentTitle','我的')
      } else {
        // 清除扫码字典数据
        removeStore('hospitalData');
        removeStore('careData');
        removeStore('departmentData');
        removeStore('pointData');
        removeStore('wasteTypeData');
        // 请求科室字典数据
        getDictionaryData(this.userInfo.proId).then((res) => {
          if (res && res.data.code == 200) {
            this.$dialog.alert({
              message: '刷新完毕',
              closeOnPopstate: true
            })
            .then(()=>{
              this.leftDownShow = false;
            });
            // 存入医院数据
            setStore('hospitalData', res.data.data['hospital']);
            // 存入医护数据
            setStore('careData', res.data.data['cares']);
            // 存入科室数据
            setStore('departmentData', res.data.data['departments'])
            // 存入暂存点数据
            setStore('pointData', res.data.data['points'])
            // 存入医废类型数据
            setStore('wasteTypeData', res.data.data['wasteType'])
          }
        })
      }
    },

    // 跳转到我的页面
    skipMyInfo () {
      this.leftDownShow = !this.leftDownShow;
    }
  }
}

</script>
<style lang='less' scoped>
  @import "../common/stylus/variable.less";
  @import "../common/stylus/modifyUi.less";
  .content-wrapper {
    .left-dropDown {
      .rightDropDown
    }
    .content-middle {
    }
  }
</style>
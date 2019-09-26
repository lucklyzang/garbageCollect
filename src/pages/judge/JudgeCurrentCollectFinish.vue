<template>
  <loading :isShow="showLoading" textContent="数据提交中..."></loading>
</template>

<script>
import {trashCollectOne,trashCollectMore} from '../../api/rubbishCollect.js'
import Loading from '@/components/Loading'
import { mapGetters, mapMutations } from 'vuex'
export default {
  data () {
    return {
      showLoading: false
    };
  },

  components: {
    Loading
  },

  computed: {
     ...mapGetters([
      'navTopTitle',
      'keshiCode',
      'yihuCode',
      'lanyaCz',
      'lajiCode',
      'judgeFlowValue',
      'applicationCollectTime',
      'startCollectTime',
      'batchNumber',
      'userInfo',
      'clickBackoutBtn'
    ])
  },

  mounted() {
    this.showDialog();
    // 控制设备物理返回按键
    pushHistory();
    this.gotoURL(() => { 
      pushHistory();
      this.$dialog.alert({
        message: '请先处理此科室收集是否已完成弹框',
        closeOnPopstate: true
      }).then(() => {
        this.showDialog()
      });
    });
  },

  methods: {
    ...mapMutations([
      'changePrintBtn',
      'changeOtherBtn',
      'changeCollectBtn',
      'changeSureBtn',
      'changeFlowState',
      'clearTrashStore',
      'changeBackoutBtn',
      'changeTotalWeight',
      'changeCurrentLajicodeState',
      'changeClickBackoutBtn',
      'changeTitleTxt',
      'changeCurrentActive',
      'changeBagCodeShow',
      'changeAstOfficeShow',
      'changeStaffCodeShow',
      'changebluetoothWeighShow',
      'changeCodeStep'
    ]),
    showDialog () {
      this.$dialog.confirm({
        message: '此科室收集已完成?',
        closeOnPopstate: true
      }).then(() => {
        if (this.lajiCode.length == 0) {
          if (this.clickBackoutBtn) {
            this.$router.replace({path:'judgeOtherDepantment'});
            this.changeCollectBtn(true);
            this.changeSureBtn(false);
            this.changeBagCodeShow(false);
            this.changeAstOfficeShow(false);
            this.changeStaffCodeShow(false);
            this.changebluetoothWeighShow(false);
            this.changeFlowState(0);
            // 清空存储的数据
            this.clearTrashStore();
          } else {
            this.$dialog.alert({
              message: '当前没有收集到任何医废数据,请重新扫描',
              closeOnPopstate: true
            }).then(() => {
              this.changeBackoutBtn(true);
              this.$router.push({path: 'medicalCollect'});
              this.changeTitleTxt({tit: '医废收集'});
              this.changeFlowState(2);
              this.changeCollectBtn(false);
              this.changeSureBtn(true);
              this.changePrintBtn(false);
              this.changeOtherBtn(false);
            })
          };
        };
        if (this.lajiCode.length == 1) {
           this.$dialog.alert({
             message: `收集${this.lanyaCz.length}条医废数据`,
             closeOnPopstate: true
              }).then(() => {
                this.postTrashOne();
             });
        } else if (this.lajiCode.length > 1) {
           this.$dialog.alert({
              message: `收集${this.lanyaCz.length}条医废数据`,
              closeOnPopstate: true
               }).then(() => {
                this.postTrashMore();
             });
        };
        this.changeCurrentLajicodeState(false);
        this.changeClickBackoutBtn(false);
      }).catch(() => {
        this.$router.replace({path: 'judgeCurrentDepantment'});
        this.changeCurrentLajicodeState(false);
        this.changeClickBackoutBtn(false)
      });
    },

    // 单条数据提交服务端
    postTrashOne () {
      let trashData = { 
        "collectNumber": this.lajiCode[0].barCode,  //收集条码，在二维码中获取的编号 必输
        "batchNumber":  this.batchNumber,  //批次号 必输
        "vehicleNumber":  "", //收集车号，非必输
        "bucketNumber":  "",  //垃圾桶号，非必输
        "depId":  this.yihuCode[0].depId,  //部门ID 在护士返回数据中得到
        "depNumber":  "",   //部门编号 非必输
        "depName":  this.yihuCode[0].depName, //部门名称
        "proId":  this.yihuCode[0].proId, //项目编号
        "proName":  this.keshiCode[0].proName,  //项目名称
        "workerId":  this.userInfo.id,  //收集人员ID
        "workerName": this.userInfo.workerName,  //收集人员名称
        "careId":  this.yihuCode[0].id, //护士ID
        "wasteId": this.lajiCode[0].id, //垃圾类型id
        "wasteName" : this.lajiCode[0].wasteName,
        "careName":  this.yihuCode[0].workerName, //护士名称
        "weight":  this.lanyaCz[0]  //医废重量
      };
      this.showLoading = true;
      // 本次科室收集垃圾提交到服务端
      trashCollectOne(trashData).then((res) => {
        if (res) {
          if (res.data.code == 200) {
              this.showLoading = false;
              this.$dialog.alert({
                message: '收集数据提交成功',
                closeOnPopstate: true
                }).then(() => {
                  this.changeBackoutBtn(false);
                  this.$router.push({path: 'medicalCollect'});
                  this.changeSureBtn(false);
                  this.changePrintBtn(true);
                  this.changeOtherBtn(true);
                  this.changeFlowState(0);
                  this.changebluetoothWeighShow(false);
                  this.changeBagCodeShow(false);
                  this.changeAstOfficeShow(false);
                  this.changeStaffCodeShow(false);
              });
          } else {
            this.showLoading = false;
            this.$dialog.alert({
              message: `${res.data.msg}`,
              closeOnPopstate: true
              }).then(() => {
              this.changeBackoutBtn(true);
              this.changeFlowState(0);
              this.$router.push({path: 'medicalCollect'});
              // 清空存储的数据
              this.clearTrashStore();
              this.changeCollectBtn(true);
              this.changeSureBtn(false);
              this.changebluetoothWeighShow(false);
              this.changeBagCodeShow(false);
              this.changeAstOfficeShow(false);
              this.changeStaffCodeShow(false);
            })
          }
        }
      })
      .catch((err) => {
        this.showLoading = false;
         this.$dialog.alert({
          message: `${err.message}`,
          closeOnPopstate: true
            }).then(() => {
            this.changeBackoutBtn(true);
            this.changeFlowState(0);
            this.$router.push({path: 'medicalCollect'});
            // 清空存储的数据
            this.clearTrashStore();
            this.changeCollectBtn(true);
            this.changeSureBtn(false);
            this.changebluetoothWeighShow(false);
            this.changeBagCodeShow(false);
            this.changeAstOfficeShow(false);
            this.changeStaffCodeShow(false);
        })
      })
    },

    // 多条数据提交服务端
    postTrashMore () {
      let listObi = {};
      let trashDataList = [];
      this.showLoading = true;
      for (let i = 0, len = this.lajiCode.length; i < len; i++) {
        trashDataList.push({
          "collectNumber": this.lajiCode[i].barCode,  //收集条码，在二维码中获取的编号 必输
          "batchNumber":  this.batchNumber,  //批次号 必输
          "vehicleNumber":  "", //收集车号，非必输
          "bucketNumber":  "",  //垃圾桶号，非必输
          "depId":  this.yihuCode[0].depId,  //部门ID 在护士返回数据中得到
          "depNumber":  "",   //部门编号 非必输
          "depName":  this.yihuCode[0].depName, //部门名称
          "proId":  this.yihuCode[0].proId, //项目编号
          "proName":  this.keshiCode[0].proName,  //项目名称
          "workerId":  this.userInfo.id,  //收集人员ID
          "workerName": this.userInfo.workerName,  //收集人员名称
          "careId":  this.yihuCode[0].id, //护士ID
          "wasteId": this.lajiCode[i].id, //垃圾类型id
          "wasteName" : this.lajiCode[i].wasteName,
          "careName":  this.yihuCode[0].workerName, //护士名称
          "weight":  this.lanyaCz[i]  //医废重量
        })
      };
      listObi['list'] = trashDataList;
      // 本次科室收集垃圾提交到服务端
      trashCollectMore(listObi).then((res) => {
        if (res) {
           if (res.data.code == 200) {
             this.showLoading = false;
             this.$dialog.alert({
                message: '收集数据提交成功',
                closeOnPopstate: true
                }).then(() => {
                  this.changeBackoutBtn(false);
                  this.$router.push({path: 'medicalCollect'});
                  this.changeSureBtn(false);
                  this.changePrintBtn(true);
                  this.changeFlowState(0);
                  this.changeOtherBtn(true);
                  this.changebluetoothWeighShow(false);
                  this.changeBagCodeShow(false);
                  this.changeAstOfficeShow(false);
                  this.changeStaffCodeShow(false);
              });
          } else {
            this.showLoading = false;
            this.$dialog.alert({
              message: `${res.data.msg}`,
              closeOnPopstate: true
                }).then(() => {
                this.changeBackoutBtn(true);
                this.changeFlowState(0);
                this.$router.push({path: 'medicalCollect'});
                // 清空存储的数据
                this.clearTrashStore();
                this.changeCollectBtn(true);
                this.changeSureBtn(false);
                this.changebluetoothWeighShow(false);
                this.changeBagCodeShow(false);
                this.changeAstOfficeShow(false);
                this.changeStaffCodeShow(false);
            })
          }
        }
      })
      .catch((err) => {
        this.showLoading = false;
         this.$dialog.alert({
          message: `${err.message}`,
          closeOnPopstate: true
            }).then(() => {
            this.changeBackoutBtn(true);
            this.changeFlowState(0);
            this.$router.push({path: 'medicalCollect'});
            // 清空存储的数据
            this.clearTrashStore();
            this.changeCollectBtn(true);
            this.changeSureBtn(false);
            this.changebluetoothWeighShow(false);
            this.changeBagCodeShow(false);
            this.changeAstOfficeShow(false);
            this.changeStaffCodeShow(false);
        })
      })
    }
  }
}
</script>
<style lang='less' scoped>
</style>
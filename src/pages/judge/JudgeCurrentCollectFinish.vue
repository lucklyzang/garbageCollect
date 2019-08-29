<template>
  <div></div>
</template>

<script>
import {trashCollectOne,trashCollectMore} from '../../api/rubbishCollect.js'
import { mapGetters } from 'vuex'
import { mapMutations } from 'vuex'
export default {
  data () {
    return {
    };
  },

  components: {},

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
    this.showDialog()
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
      'changebluetoothWeighShow',
      'changeCurrentActive',
      'changeBagCodeShow',
      'changeAstOfficeShow',
      'changeStaffCodeShow',
      'changebluetoothWeighShow',
    ]),
    showDialog () {
      this.$dialog.confirm({
        message: '此次收集已完成?'
      }).then(() => {
        if (this.lajiCode.length == 0) {
          if (this.clickBackoutBtn) {
            this.$router.push({path:'medicalInStorage'});
            this.changeTitleTxt({tit: '医废入库'});
            this.changeCollectBtn(true);
            this.changeSureBtn(false);
            this.changeBagCodeShow(false);
            this.changeAstOfficeShow(false);
            this.changeStaffCodeShow(false);
            this.changebluetoothWeighShow(false);
            this.changeCurrentActive(0);
          } else {
            this.$dialog.alert({
              message: '当前没有收集到任何医废数据,请重新扫描'
            }).then(() => {
              this.changeBackoutBtn(true);
              this.$router.push({path: 'medicalCollect'});
              this.changeFlowState(2);
              this.changeCurrentActive(1);
              this.changeCollectBtn(false);
              this.changeSureBtn(true);
              this.changePrintBtn(false);
              this.changeOtherBtn(false)
            })
          };
        };
        if (this.lajiCode.length == 1) {
           this.$dialog.alert({
             message: `收集单条数测试${this.lanyaCz.length}`
              }).then(() => {
                this.postTrashOne();
                this.changeCurrentActive(0);
                this.changeBagCodeShow(false);
                this.changeAstOfficeShow(false);
                this.changeStaffCodeShow(false);
                this.changebluetoothWeighShow(false);
             });
        } else if (this.lajiCode.length > 1) {
           this.$dialog.alert({
               message: `收集多条数测试${this.lanyaCz.length}`
               }).then(() => {
                this.postTrashMore();
                this.changeCurrentActive(0);
                this.changeBagCodeShow(false);
                this.changeAstOfficeShow(false);
                this.changeStaffCodeShow(false);
                this.changebluetoothWeighShow(false);
             });
        };
        this.changeCurrentLajicodeState(false);
        this.changeClickBackoutBtn(false);
      }).catch(() => {
        this.$router.replace({path: 'judgeCurrentDepantment'});
        this.changeCurrentLajicodeState(false);
        this.changeClickBackoutBtn(false);
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
      // 本次科室收集垃圾提交到服务端
      trashCollectOne(trashData).then((res) => {
        if (res) {
          if (res.data.code == 200) {
             this.$dialog.alert({
                message: '收集数据提交成功'
                }).then(() => {
                  this.changeBackoutBtn(false);
                  this.$router.push({path: 'medicalCollect'});
                  this.changeSureBtn(false);
                  this.changePrintBtn(true);
                  this.changeOtherBtn(true);
                  this.changeCurrentActive(0);
                  this.changebluetoothWeighShow(false)
              });
          } else {
            this.$dialog.alert({
              message: `提交服务端数据${res.data.code}`
              }).then(() => {
              this.changeBackoutBtn(true);
              this.changeFlowState(0);
              this.changeCurrentActive(0);
              this.$router.push({path: 'medicalCollect'});
              // 清空存储的数据
              this.clearTrashStore();
              this.changeCollectBtn(true);
              this.changeSureBtn(false);
              this.changebluetoothWeighShow(false);
              this.changeBagCodeShow(false)
            })
          }
        }
      })
      .catch((err) => {
        console.log(err);
         this.$dialog.alert({
          message: `${err}`
            }).then(() => {
            this.changeBackoutBtn(true);
            this.changeFlowState(0);
            this.changeCurrentActive(0);
            this.$router.push({path: 'medicalCollect'});
            // 清空存储的数据
            this.clearTrashStore();
            this.changeCollectBtn(true);
            this.changeSureBtn(false);
        })
      })
    },

    // 多条数据提交服务端
    postTrashMore () {
      let listObi = {};
      let trashDataList = [];
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
             this.$dialog.alert({
                message: '收集数据提交成功'
                }).then(() => {
                  this.changeBackoutBtn(false);
                  this.$router.push({path: 'medicalCollect'});
                  this.changeSureBtn(false);
                  this.changePrintBtn(true);
                  this.changeCurrentActive(0);
                  this.changeOtherBtn(true);
                  this.changebluetoothWeighShow(false)
              });
          } else {
            this.$dialog.alert({
              message: `提交服务端数据${res.data.code}`
                }).then(() => {
                this.changeBackoutBtn(true);
                this.changeFlowState(0);
                this.changeCurrentActive(0);
                this.$router.push({path: 'medicalCollect'});
                // 清空存储的数据
                this.clearTrashStore();
                this.changeCollectBtn(true);
                this.changeSureBtn(false);
                this.changebluetoothWeighShow(false);
                this.changeBagCodeShow(false)
            })
          }
        }
      })
      .catch((err) => {
        console.log(err);
         this.$dialog.alert({
          message: `${err}`
            }).then(() => {
            this.changeBackoutBtn(true);
            this.changeFlowState(0);
            this.changeCurrentActive(0);
            this.$router.push({path: 'medicalCollect'});
            // 清空存储的数据
            this.clearTrashStore();
            this.changeCollectBtn(true);
            this.changeSureBtn(false);
        })
      })
    }
  }
}
</script>
<style lang='less' scoped>
</style>
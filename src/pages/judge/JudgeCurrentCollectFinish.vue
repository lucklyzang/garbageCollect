<template>
  <div>
    <loading :isShow="showLoading" textContent="数据提交中..."></loading>
    <!-- 收集数据提交成功弹框 -->
    <van-dialog
      v-model="submitDataSuccessShow"
      title="收集数据提交成功"
      :show-cancel-button="false"
      :close-on-popstate="true"
      @confirm="successSure"
    >
    </van-dialog>
     <!-- 收集数据提交状态码异常弹框 -->
    <van-dialog
      v-model="submitDataAbnormalShow"
      :title="abnormalMsg"
      :show-cancel-button="false"
      :close-on-popstate="true"
      @confirm="abnormalSure"
    >
    </van-dialog>
  </div>
</template>

<script>
import {trashCollectOne,trashCollectMore} from '../../api/rubbishCollect.js'
import Loading from '@/components/Loading'
import { mapGetters, mapMutations } from 'vuex'
import { setStore, getStore, removeStore } from '@/common/js/utils'
export default {
  data () {
    return {
      showLoading: false,
      submitDataSuccessShow: false,
      successInfo: false,
      submitDataAbnormalShow: false,
      abnormalInfo: false,
      abnormalMsg: '',
      isMoreStrip: false,
      abnormalCodeList: []
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
      'clickBackoutBtn',
      'isRepeatSubmit',
      'garColMsg'
    ])
  },

  mounted() {
    this.showDialog();
    // 控制设备物理返回按键
    pushHistory();
    this.gotoURL(() => { 
      pushHistory();
      if (this.successInfo) {
        this.$dialog.alert({
          message: '请先处理收集数据提交成功弹框',
          closeOnPopstate: false
        }).then(() => {
          this.submitDataSuccessShow = true;
          this.successInfo = true
        })
      } else if (this.abnormalInfo) {
         this.$dialog.alert({
          message: '请先处理收集数据提交医废编码异常弹框',
          closeOnPopstate: false
        }).then(() => {
          this.submitDataAbnormalShow = true;
          this.abnormalInfo = true
        })
      } else {
        this.$dialog.alert({
        message: '请先处理此科室收集是否已完成弹框',
        closeOnPopstate: false
        }).then(() => {
          this.showDialog()
        });
      }
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
      'changeCodeStep',
      'changeRepeatSubmit',
      'changeManualWeighShow',
      'changeStorageLajiCode',
      'changeStorageLanyaCz',
      'initStorageLajiCode',
      'initStorageLanyaCz'

    ]),
    showDialog () {
      this.$dialog.confirm({
        message: '此科室收集已完成?',
        closeOnPopstate: true
      })
      .then(() => {
        if (this.lajiCode.length == 0) {
          if (this.clickBackoutBtn) {
            this.$router.replace({path:'judgeOtherDepantment'})
          } else {
            this.$dialog.alert({
              message: '当前没有收集到任何医废数据,请重新扫描',
              closeOnPopstate: true
            })
            .then(() => {
              this.changeBackoutBtn(true);
              this.$router.push({path: 'medicalCollect'});
              this.changeTitleTxt({tit: '医废收集'});
              this.changeFlowState(-1);
              this.changeCollectBtn(false);
              this.changeSureBtn(true);
              this.changePrintBtn(false);
              this.changeOtherBtn(false);
              this.changeBagCodeShow(false);
              this.changeStaffCodeShow(false);
              this.changeAstOfficeShow(false);
              this.changebluetoothWeighShow(false);
              this.changeManualWeighShow(false);
              this.changeIsCollectCurrentOffice(true);
              this.clearTrashStore()
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
      })
      .catch(() => {
        this.$router.replace({path: 'judgeCurrentDepantment'})
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
        "careId":  this.yihuCode[this.yihuCode.length-1].id, //护士ID
        "wasteId": this.lajiCode[0].id, //垃圾类型id
        "wasteName" : this.lajiCode[0].wasteName,
        "careName":  this.yihuCode[this.yihuCode.length-1].workerName, //护士名称
        "weight":  this.lanyaCz[0]  //医废重量
      };
      this.showLoading = true;
      // 本次科室收集垃圾提交到服务端
      trashCollectOne(trashData).then((res) => {
        if (res) {
          if (res.data.code == 200) {
              this.showLoading = false;
              // 数据提交服务端成功过后删除h5存储每步的收集信息和流程和称重方式
              this.clearPartStorage();
              this.submitDataSuccessShow = true;
              this.successInfo = true
          } else {
            // 提交医废编码异常时的处理
            this.showLoading = false;
            this.submitDataAbnormalShow = true;
            this.abnormalInfo = true;
            this.abnormalMsg = res.data.msg
          }
        }
      })
      .catch((err) => {
        // if (err.message.toString().toLowerCase().indexOf('timeout')!= -1 || err.message.toString().toLowerCase().indexOf('network error')!= -1) 
        this.showLoading = false;
        this.$dialog.alert({
          message: `${err.message}`,
          closeOnPopstate: true
        })
        .then(() => {
          this.changeRepeatSubmit(true);
          this.changeBackoutBtn(false);
          this.changeFlowState(3);
          this.$router.push({path: 'medicalCollect'});
          this.changeCollectBtn(false);
          this.changeSureBtn(true);
          this.changebluetoothWeighShow(false);
          this.changeManualWeighShow(false);
          this.changeBagCodeShow(false);
          this.changeAstOfficeShow(false);
          this.changeStaffCodeShow(true)
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
          "careId":  this.yihuCode[this.yihuCode.length-1].id, //护士ID
          "wasteId": this.lajiCode[i].id, //垃圾类型id
          "wasteName" : this.lajiCode[i].wasteName,
          "careName":  this.yihuCode[this.yihuCode.length-1].workerName, //护士名称
          "weight":  this.lanyaCz[i]  //医废重量
        })
      };
      listObi['list'] = trashDataList;
      // 本次科室收集垃圾提交到服务端
      trashCollectMore(listObi).then((res) => {
        if (res) {
           if (res.data.code == 200) {
            this.showLoading = false;
            // 数据提交服务端成功过后删除h5存储每步的收集信息和流程和称重方式
            this.clearPartStorage();
            this.submitDataSuccessShow = true;
            this.successInfo = true
          } else {
            if (res.data.code == 400) {
              this.abnormalCodeList = [];
              this.isMoreStrip = true;
              this.abnormalCodeList = res.data.data.fail;
              this.abnormalMsg = `${res.data.msg}${res.data.data.fail}异常,确认后将剔除本次收集中的异常医废条码,可以再次提交`
            } else {
              this.abnormalMsg = res.data.msg
            }
            this.showLoading = false;
            this.submitDataAbnormalShow = true;
            this.abnormalInfo = true;
          }
        }
      })
      .catch((err) => {
        this.showLoading = false;
        this.$dialog.alert({
          message: `${err.message}`,
          closeOnPopstate: true
        })
        .then(() => {
          this.changeRepeatSubmit(true);
          this.changeBackoutBtn(false);
          this.changeFlowState(3);
          this.$router.push({path: 'medicalCollect'});
          this.changeCollectBtn(false);
          this.changeSureBtn(true);
          this.changebluetoothWeighShow(false);
          this.changeManualWeighShow(false);
          this.changeBagCodeShow(false);
          this.changeAstOfficeShow(false);
          this.changeStaffCodeShow(true)
        })
      })
    },

    // 数据提交成功弹框确定按钮的回调事件
    successSure () {
      this.submitDataSuccessShow = false;
      this.successInfo = false;
      this.changeBackoutBtn(false);
      this.$router.push({path: 'medicalCollect'});
      this.changeSureBtn(false);
      this.changePrintBtn(true);
      this.changeOtherBtn(true);
      this.changeFlowState(-1);
      this.changebluetoothWeighShow(false);
      this.changeManualWeighShow(false);
      this.changeBagCodeShow(false);
      this.changeAstOfficeShow(false);
      this.changeStaffCodeShow(false)
    },

    // 数据提交状态码异常时弹框确定按钮的回调事件
    abnormalSure () {
      let filterMsg = {};
      if (this.isMoreStrip) {
        if (this.abnormalCodeList.length > 0) {
          filterMsg = this.resetBarArray(this.lajiCode, this.lanyaCz,this.abnormalCodeList)
        };
        this.isMoreStrip = false
      };
      // 重新存储store里的收集垃圾信息
      this.initStorageLajiCode();
      this.initStorageLanyaCz();
      this.changeStorageLajiCode(filterMsg['one']);
      this.changeStorageLanyaCz(filterMsg['two']);
      this.changeRepeatSubmit(true);
      this.changeBackoutBtn(false);
      this.changeFlowState(3);
      this.$router.push({path: 'medicalCollect'});
      this.changeCollectBtn(false);
      this.changeSureBtn(true);
      this.changebluetoothWeighShow(false);
      this.changeManualWeighShow(false);
      this.changeBagCodeShow(false);
      this.changeAstOfficeShow(false);
      this.changeStaffCodeShow(true)
    },

    // 根据给出的医废编码，来删除存储中存在的医废编码
    // arrOne: 医废信息,arrTwo: 医废重量,clearArr: 要删除的医废编码
     resetBarArray (arrOne,arrTwo,clearArr) {
			for (var i = 0; i < clearArr.length; i++) {
				for (var j = 0; j < arrOne.length; j++) {
					if (arrOne[j]['barCode'] == clearArr[i]) {
						arrOne.splice(j,1);
						arrTwo.splice(j,1);
						j--
					}
				}
			};
			return {'one':arrOne,'two':arrTwo}
    },

    //清除部分存储信息
    clearPartStorage () {
      removeStore('currentCollectMsg');
      removeStore('currentStep');
      removeStore('weightMethods');
      removeStore('continueCurrentCollect') 
    }

    // 提交数据失败时的处理
    // this.changeBackoutBtn(true);
    // this.changeFlowState(-1);
    // this.$router.push({path: 'medicalCollect'});
    // // 清空存储的数据
    // this.clearTrashStore();
    // this.changeCollectBtn(true);
    // this.changeSureBtn(false);
    // this.changebluetoothWeighShow(false);
    // this.changeManualWeighShow(false);
    // this.changeBagCodeShow(false);
    // this.changeAstOfficeShow(false);
    // this.changeStaffCodeShow(false);
    // // 数据提交服务端成功过后删除h5存储每步的收集信息和流程和称重方式
    // removeStore('currentCollectMsg');
    // removeStore('currentStep');
    // removeStore('weightMethods');
    // removeStore('continueCurrentCollect')
  }
}
</script>
<style lang='less' scoped>
</style>
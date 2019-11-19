import request from '@/utils/request'
// 获取批次号
export function getBatchNumber(id) {
  return request({
    url: `collect/start/${id}`,
    method: 'get'
  })
};
// 判断暂存点
export function judgeStagingPoint(type,number,id) {
  return request({
    url: `point/verify/${type}/${number}?workerId=${id}`,
    method: 'get',
  })
};
// 判断交接人员(医护)
export function judgeMedicalPerson(careNo,batchNo) {
  return request({
    url: `medical/verify/${careNo}/${batchNo}`,
    method: 'get',
  })
};
// 医废收集(单条)
export function trashCollectOne(data) {
  return request({
    url: 'collect/add',
    method: 'post',
    data
  })
};
// 医废收集(多条)
export function trashCollectMore(data) {
  return request({
    url: 'collect/batchAdd',
    method: 'post',
    data
  })
};
// 根据批次查询
export function queryBatch(data) {
  return request({
    url: 'collect/queryAll',
    method: 'get',
    params: data
  })
};
// 汇总点校验
export function judgeSummaryPoint(type,number,id) {
  return request({
    url: `point/verifyFinal/${type}/${number}?workerId=${id}`,
    method: 'get'
  })
};
//入库接口
export function inStorageAdd(data) {
  return request({
    url: 'store/add',
    method: 'post',
    data
  })
};
//查询未出库批次
export function queryOutStorage(data) {
  return request({
    url: 'store/queryout',
    method: 'get',
    params: data
  })
};
//出库操作
export function operateOutStorage(data) {
  return request({
    url: 'store/outstore',
    method: 'put',
    data
  })
};
//查询收集历史
export function queryCollectHistory(data) {
  return request({
    url: 'store/hasOut',
    method: 'get',
    params: data
  })
};
//查询预警
export function queryWarning(data) {
  return request({
    url: 'warninfo/queryAll',
    method: 'get',
    params: data
  })
};

// 查询出库公司
export function queryCompany(proId) {
  return request({
    url: `dict/queryDict/${proId}`,
    method: 'get',
  })
};
// 预警处理
export function warningDispose(data) {
  return request({
    url: 'warninfo/update',
    method: 'put',
    data
  })
};
// 补录审核批次查询
export function queryAddList(data) {
  return request({
    url: 'supplement/queryAll',
    method: 'get',
    params: data
  })
};
// 补录审核接口
export function addCheck(data) {
  return request({
    url: 'supplement/deal',
    method: 'put',
    data
  })
};
// 统计接口
export function statisticsData(proId,data) {
  return request({
    url: `collect/statistic/${proId}`,
    method: 'get',
    params: data
  })
};
// 部门接口
export function queryOffice(data) {
  return request({
    url: 'department/queryAll',
    method: 'get',
    params: data
  })
};
//收集人员接口
export function queryCollectPerson(data) {
  return request({
    url: 'worker/queryAll',
    method: 'get',
    params: data
  })
};
//查询补充打印
export function queryPrintInfo(data) {
  return request({
    url: 'collect/history',
    method: 'get',
    params: data
  })
};
//提交补充打印数据
export function postReplenishPrintData (data) {
  return request({
    url: 'printLog/add',
    method: 'post',
    data
  })
};
// 查询监测区域和监测点
export function queryMonitorInfo (data) {
  return request({
    url: `dict/monitorDic/${data}`,
    method: 'get'
  })
}

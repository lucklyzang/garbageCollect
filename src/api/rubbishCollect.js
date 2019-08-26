import request from '@/utils/request'
// 获取批次号
export function getBatchNumber(id) {
  return request({
    url: `collect/start/${id}`,
    method: 'get'
  })
};
// 判断暂存点
export function judgeStagingPoint(type,number) {
  return request({
    url: `point/verify/${type}/${number}`,
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
export function judgeSummaryPoint(type,number) {
  return request({
    url: `point/verifyFinal/${type}/${number}`,
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
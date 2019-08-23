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
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

}
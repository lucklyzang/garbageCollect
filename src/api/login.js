import request from '@/utils/request'
export function logIn(data) {
  return request({
    url: 'worker/login',
    method: 'post',
    data
  })
}

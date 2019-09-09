import request from '@/utils/request'
export function logIn(data) {
  return request({
    url: 'login/login',
    method: 'post',
    data
  })
}

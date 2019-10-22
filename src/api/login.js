import request from '@/utils/request'

// 用户登录
export function logIn(data) {
  return request({
    url: 'login/login',
    method: 'post',
    data
  })
};

// 用户退出登录
export function exitLogIn(data) {
  return request({
    url: `login/logout/${data}?type=1`,
    method: 'get',
  })
}

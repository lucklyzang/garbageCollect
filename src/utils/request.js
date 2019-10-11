import axios from 'axios'
import store from '@/store'
// 'http://192.168.8.100:8080/blink'
// http://39.100.111.20:8080/blink
// http://47.108.27.209:8080/blink
const service = axios.create({
  baseURL: 'http://39.100.111.20:8080/blink',
  retry: 4,
  retryDelay: 1000,
  shouldRetry: (err) => true
});

// request interceptor
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['X-Token'] = 'default'
    }
    config.headers['REQUEST_TYPE'] = '1'
    return config
  },

  error => {
    console.log(error)
    return Promise.reject(error)
  }
);

// response interceptor
service.interceptors.response.use(
  response => {
    return response
  },
  (err) => {
    var config = err.config;
    // 判断是否配置了重试
    if(!config || !config.retry) return Promise.reject(err);
    if(!config.shouldRetry || typeof config.shouldRetry != 'function') {
       return Promise.reject(err);
    };
    //判断是否满足重试条件
    if(!config.shouldRetry(err)) {
      return Promise.reject(err);
    };
    // 设置重置次数，默认为0
     config.__retryCount = config.__retryCount || 0;
    // 判断是否超过了重试次数
     if(config.__retryCount > config.retry) {
        return Promise.reject(err);
     };
     //重试次数自增
     config.__retryCount += 1;
     //延时处理
     var backoff = new Promise(function(resolve) {
      setTimeout(function() {
          resolve();
      }, config.retryDelay || 1);
     });
     //重新发起axios请求
     return backoff.then(function() {
        return service(config);
     });
  }

);

export default service
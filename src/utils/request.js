import axios from 'axios'
import { MessageBox,} from 'element-ui'
import store from '@/store'
// 'http://192.168.8.100:8080/blink'
// http://39.100.111.20:8080/blink
// http://47.108.27.209:8080/blink
const service = axios.create({
  baseURL: 'http://39.100.111.20:8080/blink'
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
)

// response interceptor

service.interceptors.response.use(
  response => {
    return response
  },
  error => {
    console.log('err' + error)
    return Promise.reject(error)
  }

)



export default service
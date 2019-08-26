import axios from 'axios'
import { MessageBox,} from 'element-ui'
import store from '@/store'
// http://192.168.8.100:8080
const service = axios.create({
  baseURL: 'http://192.168.8.100:8080',
  // timeout: 5000 // request timeout
});

// request interceptor
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['X-Token'] = 'default'
    }
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
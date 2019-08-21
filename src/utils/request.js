import axios from 'axios'
import { MessageBox,} from 'element-ui'
import store from '@/store'

const service = axios.create({
  // baseURL: process.env.env.BASE_URL,
  timeout: 5000 // request timeout
})

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
  },
  error => {
    console.log('err' + error)
    return Promise.reject(error)
  }

)



export default service
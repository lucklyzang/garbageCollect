import Vue from 'vue'
import Router from 'vue-router'
import {setStore, getStore} from '@/common/js/utils.js'
import store from '@/store'
const Home = () => import('../pages/Home')
const Login = () => import('../pages/Login')
const MedicalCollect = () => import('../pages/MedicalSweepCode')
const MedicalInStorage = () => import('../pages/MedicalInStorage')
const MedicalOutStorage = () => import('../pages/MedicalOutStorage')
const JudgeCurrentDepantment = () => import('../pages/judge/JudgeCurrentDepantment')
const JudgeCurrentCollectFinish = () => import('../pages/judge/JudgeCurrentCollectFinish')
const JudgeOtherDepantment = () => import('../pages/judge/JudgeOtherDepantment')
const MedicalInStorageIncrease = () => import('../pages/MedicalInStorageIncrease')
const AbnormalWarning = () => import('../pages/AbnormalWarning')
const CollectHistory = () => import('../pages/CollectHistory')
const MyInfo = () => import('../pages/MyInfo')
const TestPage = () => import('../pages/TestPage')
const CommonSweepCode = () => import('../pages/CommonSweepCode')
const HandleIdea = () => import('../pages/HandleIdea')
const WarningCheck = () => import('../pages/WarningCheck')
const AddCheck = () => import('../pages/AddCheck')
const CollectDetails = () => import('../pages/CollectDetails')
const ReportAudit = () => import('../pages/ReportAudit')
const VideoMonitor = () => import('../pages/VideoMonitor')
const AddPrint = () => import('../pages/AddPrint')
Vue.use(Router)

let baseRoute  = [
  {
    path: '/',
    name: 'login',
    component: Login,
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
  },
  {
    path: '/commonSweepCode',
    name: 'commonSweepCode',
    component: CommonSweepCode,
  },
  {
    path: '/medicalCollect',
    name: 'medicalCollect',
    component: MedicalCollect,
  },
  {
    path: '/medicalInStorage',
    name: 'medicalInStorage',
    component: MedicalInStorage,
  },
  {
    path: '/medicalOutStorage',
    name: 'medicalOutStorage',
    component: MedicalOutStorage,
  },
  {
    path: '/judgeCurrentDepantment',
    name: 'judgeCurrentDepantment',
    component: JudgeCurrentDepantment,
  },
  {
    path: '/judgeCurrentCollectFinish',
    name: 'judgeCurrentCollectFinish',
    component: JudgeCurrentCollectFinish,
  },
  {
    path: '/judgeOtherDepantment',
    name: 'judgeOtherDepantment',
    component: JudgeOtherDepantment,
  },
  {
    path: '/medicalInStorageIncrease',
    name: 'medicalInStorageIncrease',
    component: MedicalInStorageIncrease,
  },
  {
    path: '/abnormalWarning',
    name: 'abnormalWarning',
    component: AbnormalWarning,
  },
  {
    path: '/handleIdea',
    name: 'handleIdea',
    component: HandleIdea,
  },
  {
    path: '/collectHistory',
    name: 'collectHistory',
    component: CollectHistory,
    meta: {
      keepAlive: false
    }
  },
  {
    path: '/collectDetails',
    name: 'collectDetails',
    component: CollectDetails,
  },
  {
    path: '/myInfo',
    name: 'myInfo',
    component: MyInfo,
  },
  {
    path: '/testPage',
    name: 'testPage',
    component: TestPage,
  },
  {
    path: '/warningCheck',
    name: 'warningCheck',
    component: WarningCheck,
  },
  {
    path: '/addCheck',
    name: 'addCheck',
    component: AddCheck,
  },
  {
    path: '/reportAudit',
    name: 'reportAudit',
    component: ReportAudit,
  },
  {
    path: '/videoMonitor',
    name: 'videoMonitor',
    component: VideoMonitor,
  },
  {
    path: '/addPrint',
    name: 'addPrint',
    component: AddPrint,
  }
];
let router = new Router({
  routes: baseRoute
});
router.beforeEach((to, from, next) => {
  if (getStore('isLogin')) {
    if (to.name === 'login') {
      // 判断登录方式(用户名密码登录或扫码登录)
      if (getStore('loginSweepCode') == 'false') {
        if (getStore('userName') && getStore('userPassword')) {
          next({path: '/home'})
        } else {
          next()
        }
      } else {
        if (getStore('userName')) {
          next({path: '/home'})
        } else {
          next()
        }
      }
    } else {
      next()
    }
  } else {
    if (!store.getters.routerFlag) { // 禁用路由返回，保存到vuex内的
      next(false)
      return
    } else {
      next()
    }
  }
});
export default router


import Vue from 'vue'
import Router from 'vue-router'
import {setStore, getStore} from '@/common/js/utils.js'
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
const CommonSweepCode = () => import('../pages/CommonSweepCode')
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
    path: '/collectHistory',
    name: 'collectHistory',
    component: CollectHistory,
  },
  {
    path: '/myInfo',
    name: 'myInfo',
    component: MyInfo,
  },
];
let router = new Router({
  routes: baseRoute
});
router.beforeEach((to, from, next) => {
  if (getStore('isLogin')) {
    if (to.name == 'home') {
      next();
    } else if (to.name == 'login') {
      if (getStore('userName') && getStore('userPassword')) {
        next({path: '/home'})
      } else {
        next({path: '/'})
      }
    } else {
      next()
    }
  } else {
    next()
  }
});
export default router


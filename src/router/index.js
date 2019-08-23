import Vue from 'vue'
import Router from 'vue-router'
const Home = () => import('../pages/Home')
const Login = () => import('../pages/Login')
const MedicalCollect = () => import('../pages/MedicalSweepCode')
const MedicalInStorage = () => import('../pages/MedicalInStorage')
const MedicalOutStorage = () => import('../pages/MedicalOutStorage')
const JudgeCurrentDepantment = () => import('../pages/judge/JudgeCurrentDepantment')
const JudgeCurrentCollectFinish = () => import('../pages/judge/JudgeCurrentCollectFinish')
const JudgeOtherDepantment = () => import('../pages/judge/JudgeOtherDepantment')
const MedicalInStorageIncrease = () => import('../pages/MedicalInStorageIncrease')
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
];
let router = new Router({
  routes: baseRoute
});
// router.beforeEach((to, from, next) => {
//   let routeName = to.meta.name || to.name;
//   window.document.title = (routeName ? routeName + ' - ' : '') + 'Vue-Access-Control';
//   next();
// });
export default router


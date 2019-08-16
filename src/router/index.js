import Vue from 'vue'
import Router from 'vue-router'
const Home = () => import('../pages/Home')
const Login = () => import('../pages/Login')
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
  }
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


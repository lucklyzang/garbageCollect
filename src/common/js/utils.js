import moment from 'moment'
/**
 * 格式化当前时间
*/
export const formatTime = (formatType) => {
  return moment(new Date().getTime()).format(formatType)
}

/**
 * 存储localStorage
*/
export const setStore = (name, content) => {
  if (!name) return;
  if (typeof content !== 'string') {
    content = JSON.stringify(content);
  }
  window.localStorage.setItem(name, content);
}

/**
 * 获取localStorage
*/
export const getStore = name => {
  if (!name) return;
  return window.localStorage.getItem(name);
}

/**
 * 删除localStorage
*/
export const removeStore = name => {
  if (!name) return;
  window.localStorage.removeItem(name);
}

/** 
 * 存储当前历史记录点,实现控制手机物理返回键的按钮事件
*/
export const pushHistory = () => {
  let state = {
    title: '',
    url: ''
  }
  window.history.pushState(state, state.title, state.url)
}

/** 
 * 判断设备的操作系统环境
*/
export const IsPC = () => {
  let flag;
　let system = {
　　win: false,
　　mac: false,
　　xll: false,
　　ipad: false
  };
　//检测平台
　let p = navigator.platform;
  　　system.win = p.indexOf("Win") == 0;
  　　system.mac = p.indexOf("Mac") == 0;
  　　system.x11 = (p == "X11") || (p.indexOf("Linux") == 0);
  　　system.ipad = (navigator.userAgent.match(/iPad/i) != null) ? true : false;
　if (system.win || system.mac || system.xll||system.ipad) {
    flag = true
　} else {
    flag = false
　}
  return flag
}
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
　if (system.win || system.mac || system.xll || system.ipad) {
    flag = true
　} else {
    flag = false
　}
  return flag
}

/** 
 * 扫码枪绑定方法
*/
export const scanCode = (callback) => {
  var code = '';
  var lastTime, nextTime;
  var lastCode, nextCode;
  var that = this;
  window.document.onkeypress = function(event) {
    if (window.event) { // IE
        nextCode = event.key;
    } else if (event.which) { // Netscape/Firefox/Opera
        nextCode = event.which
    }
    if (event.which === 13) {
      if (code.length < 3) {// 手动输入的时间不会让code的长度大于2，所以这里只会对扫码枪有
          return
      }
      code = decodeURIComponent(code);
      console.log('扫码结束: ' + code);
      callback(code);
      //TODO
      code = '';
      lastCode = '';
      lastTime = '';
      return
    }
    nextTime = new Date().getTime();
    if (!lastTime && !lastCode) {
      console.log('扫码开始。。。');
      code += event.key;
    }

    if (lastCode && lastTime && nextTime - lastTime > 500) { // 当扫码前有keypress事件时,防止首字缺失
      console.log('防止首字缺失。。。');
      code = event.key
    } else if (lastCode && lastTime) {
      console.log('扫码中。。。');
      code += event.key
    }
    lastCode = nextCode;
    lastTime = nextTime;
  }
}

/** 
 * 验证输入重量是否合法正则
*/
export const testWeight = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/ 
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
      // code = decodeURIComponent(code);
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

/** 
 * 扫码后从字典中取值
*/
export const Dictionary = (data, key) => {
  return data[key] ? data[key] : undefined
}

/** 
 * 判断数据是否为JSON类型
*/

export const judgeDataType = (data) => {
  var flag;
  if (typeof(data) == "object" && Object.prototype.toString.call(data) == "[object Object]" && !data.length) {
    flag = true
  } else {
    flag = false
  }
  return flag
}

/** 
 * 判断数组对象中每项某个key对应value是否相同
*/

export const judgeKeyEquail = (data,key) => {
  var flag = true;
  if (!(Object.prototype.toString.call(data) === '[object Array]')) {
    return
  };
  if (data.length > 0) {
    for (var i=1, len = data.length; i< len; i++) {
      var assignItem = data[0][key];
      if (data[i][key] !== assignItem) {
        flag = false;
        break
      }
    }
  } else {
    flag = true
  }
  return flag
}

/** 
 * 合并医废类型、重量、医废收集时间
*/

/* 医废类型 [] typeArr*/ 
/* 医废重量 [] weightArr*/ 
/* 收集时间 [] timeArr*/

export const dealMedicalWaste = (typeArr, weightArr, timeArr) => {
  const typeTarget = [];
  const weightTarget = [];
  const timeTarget = [];
  let index = 0;
  const indexMap = {};

  for (let i = 0, len = typeArr.length; i < len; i += 1) {
    const type = typeArr[i];
    let curTypeIndex = -1;
    if (type in indexMap) {
      curTypeIndex = indexMap[type]
    } else {
      curTypeIndex = indexMap[type] = index++;
      typeTarget[curTypeIndex] = type;
      weightTarget[curTypeIndex] = 0;
      timeTarget[curTypeIndex] = null
    };
    weightTarget[curTypeIndex] = weightTarget[curTypeIndex] + weightArr[i];
    timeTarget[curTypeIndex] = timeArr[i]
  };
  return [typeTarget, weightTarget, timeTarget]
}

/** 
 * 合并医废类型、重量
*/
/* 医废类型 [] wasteType*/ 
/* 医废重量 [] wasteWeight*/
export const dealMedicalWast = (wasteType,wasteWeight) => {
  let map = {};
  wasteType.forEach((value, index) => {
    Object.prototype.hasOwnProperty.call(map, value) || (map[value] = 0);
    map[value] += Number(wasteWeight[index]);
  });
  return map
}



import { Toast } from 'vant'
import { request } from '@/common/js/ajax'

/**
 * 将 apiConfig 里的接口地址配置 转换成请求函数
 * apiConfig = {
 *  get: { key: val } get请求地址对应， key 为请求函数名, val 为接口地址
 *  post: { key: val } post请求地址对应， key 为请求函数名, val 为接口地址
 *  put: { key: val } put请求地址对应， key 为请求函数名, val 为接口地址
 *  delete: { key: val } delete请求地址对应， key 为请求函数名, val 为接口地址
 * }, 提交的参数
 */
export function createApis(apiConfig) {
  const APIS = {}

  for (const method in apiConfig) {
    const methodApis = apiConfig[method]
    for (const key in methodApis) {
      APIS[key] = (obj) => request({
        url: methodApis[key],
        method,
        ...obj
      })
    }
  }

  return APIS
}

/**
 * data = {}, 提交的参数
 * api, 接口方法
 * successMsg = '提交成功',  成功提示
 * failMsg, 失败提示
 * success, 成功回调
 * fail, 失败回调
 * complete 完成回调（无论成功失败）
 */
export async function saveLoading ({
  data = {},
  api,
  successMsg = '提交成功',
  failMsg,
  success,
  fail,
  complete
}) {
  const loading = Toast.loading({
    duration: 0, // 持续展示 toast
    forbidClick: true
  })

  const res = await api(data)

  loading.clear()

  if (res.success) {
    Toast.success(successMsg)
    success && success(res)
  } else {
    Toast(failMsg || res.message)
    fail && fail(res)
  }
  complete && complete(res)
}

/* 判断是否为json */
export function isJSON (val) {
  try {
    if (Object.prototype.toString.call(val) === '[object Object]') {
      return true
    } else {
      return false
    }
  } catch (e) {
    return false
  }
}

// 格式化时间
export function dateFmt (fmt, date) {
  var o = {
    'y+': date.getFullYear(), // 年
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) { fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length)) }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) { fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length))) }
  }
  return fmt
}

//  判断手机类型
export function judgeDeviceType () {
  var ua = window.navigator.userAgent.toLocaleLowerCase()
  var isIOS = /iphone|ipad|ipod/.test(ua)
  var isAndroid = /android/.test(ua)
  var isMiuiBrowser = /miuibrowser/.test(ua)

  return {
    isIOS: isIOS,
    isAndroid: isAndroid,
    isMiuiBrowser: isMiuiBrowser
  }
}

/* 用于修改 axios 的一些公用配置，具体参看文档 */
import axios from 'axios'
import store from '@/store/index.js'
import qs from 'qs'
import { isJSON } from '@/utils/utils'
import { getToken, removeUserInfo, removeToken } from '@/common/js/cache'
import { Toast } from 'vant'

axios.defaults.transformRequest = (data, headers) => {
  if (headers['Content-Type'] === 'application/x-www-form-urlencoded' && data && Object.prototype.toString.call(data) === '[object Object]') {
    data = qs.stringify(data)
  }
  if (headers['Content-Type'] === 'application/json;charset=UTF-8' && data && Object.prototype.toString.call(data) === '[object Object]') {
    data = JSON.stringify(data)
  }
  return data
}

const newAxios = axios.create({
  timeout: 1500000
})

newAxios.interceptors.request.use(config => {
  // 如果是请求高德服务  不携带token
  if (store.state.token && config.url.indexOf('restapi.amap.com') === -1) {
    config.headers.accessToken = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  return config
}, err => {
  return Promise.reject(err)
})

newAxios.interceptors.response.use(response => {
  const accesstoken = response.headers.accesstoken
  // debugger
  const res = isJSON(response.data) || Array.isArray(response.data) ? response.data : JSON.parse(response.data)
  if (accesstoken && isJSON(res.data)) {
    res.data.accesstoken = accesstoken
  }

  if (res.code === '403') {
    Toast('该账号已在别处登录，请重新登录')
    removeToken()
    removeUserInfo()
    // location.reload()
  }
  return response.data
}, err => {
  if (err.code === 'ECONNABORTED' && err.message.indexOf('timeout') !== -1) {
    // Message.error('请求超时。。。')
    console.log('请求超时。。。')
  }

  console.log(err)
  return Promise.reject(err)
})

export function request (_param) {
  const {
    method = 'get',
    // `responseType` 表示服务器响应的数据类型，可以是 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'
    responseType = 'json', // 默认的
    headers = {},
    url = '',
    params,
    data,
    ...otherData
  } = _param
  if (!url) {
    return new Promise((resolve, reject) => {
      reject(new Error('url is null'))
    })
  }
  const _method = method.toLowerCase()

  if (_method === 'get') {
    return newAxios({
      responseType,
      url,
      headers,
      method,
      params: params || data || otherData
    })
  }

  if (_method === 'post' || _method === 'delete' || _method === 'put') {
    // eslint-disable-next-line no-prototype-builtins
    if (!headers.hasOwnProperty('Content-Type')) {
      headers['Content-Type'] = 'application/x-www-form-urlencoded'
    }
    if (params && data) {
      return newAxios({
        responseType,
        url,
        headers,
        method,
        params,
        data
      })
    } else {
      const { start, limit, ...resetData } = otherData
      return newAxios({
        responseType,
        url,
        headers,
        method,
        params: params || { start, limit },
        data: data || resetData
      })
    }
  }
}

export default newAxios

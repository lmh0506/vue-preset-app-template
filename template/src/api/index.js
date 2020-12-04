import API_CONFIG from './apiConfig'
import { request } from '@/common/js/ajax'
const APIS = {}

for (const method in API_CONFIG) {
  const methodApis = API_CONFIG[method]
  for (const key in methodApis) {
    APIS[key] = (obj) => request({
      url: methodApis[key],
      method,
      ...obj
    })
  }
}

export default APIS

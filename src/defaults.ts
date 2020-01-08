import { AxiosRequestConfig, Method } from './types'
import { transformHeadersData } from './helpers/headers'
import { transformRequestData, transformResponseData } from './helpers/data'

const defaults: AxiosRequestConfig = {
  method: 'get',

  headers: {
    common: {
      Accept: 'application/json, text/plain, */*'
    }
  },

  xsrfCookieName: 'XSRF-TOKEN',

  xsrcHeaderName: 'X-XSRF-TOKEN',

  transformRequest: [
    (data: any, headers: any): any => {
      transformHeadersData(headers, data)
      return transformRequestData(data)
    }
  ],

  transformResponse: [
    (data: any): any => {
      return transformResponseData(data)
    }
  ]
}

const methodsWithoutData: Method[] = ['get', 'delete', 'head', 'options']
const methodsWithData: Method[] = ['post', 'put', 'patch']

methodsWithoutData.forEach(method => (defaults.headers[method] = {}))
methodsWithData.forEach(
  method => (defaults.headers[method] = { 'Content-Type': 'application/x-www-form-urlencoded' })
)

export default defaults

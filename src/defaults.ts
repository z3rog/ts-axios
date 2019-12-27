import { AxiosRequestConfig, Method } from './types'

const defaults: AxiosRequestConfig = {
  method: 'get',
  headers: {
    common: {
      Accept: 'application/json, text/plain, */*'
    }
  }
}

const methodsWithoutData: Method[] = ['get', 'delete', 'head', 'options']
const methodsWithData: Method[] = ['post', 'put', 'patch']

methodsWithoutData.forEach(method => defaults.headers[method] = {})
methodsWithData.forEach(method =>
  defaults.headers[method] = { 'Content-Type': 'application/x-www-form-urlencoded' }
)

export default defaults

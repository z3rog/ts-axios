import { AxiosRequestConfig, AxiosPromise } from './types'
import xhr from './xhr'
import { buildURL } from './helpers/url'
import { transformRequestData } from './helpers/data'
import { transformHeadersData } from './helpers/headers'

function axios(config: AxiosRequestConfig): AxiosPromise {
  processConfig(config)
  return xhr(config)
}

function processConfig(config: AxiosRequestConfig): void {
  config.method = transformMethod(config)
  config.url = transformURL(config)
  config.headers = transformHeaders(config) // call before transform data
  config.data = transformData(config)
}
function transformMethod(config: AxiosRequestConfig): string {
  return config.method ? config.method.toUpperCase() : 'GET'
}
function transformURL(config: AxiosRequestConfig): string {
  const { url, params } = config
  return buildURL(url, params)
}

function transformData(config: AxiosRequestConfig): any {
  return transformRequestData(config.data)
}

function transformHeaders(config: AxiosRequestConfig): any {
  const { headers = {}, data } = config
  return transformHeadersData(headers, data)
}

export default axios

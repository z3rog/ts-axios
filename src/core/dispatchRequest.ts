import { AxiosRequestConfig, AxiosPromise, AxiosResponse, Method } from '../types'
import xhr from '../xhr'
import { buildURL } from '../helpers/url'
import { transformRequestData, transformResponseData } from '../helpers/data'
import { transformHeadersData, flatternHeaders } from '../helpers/headers'

function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
  processConfig(config)
  return xhr(config).then(res => transformResponse(res))
}

function processConfig(config: AxiosRequestConfig): void {
  config.method = transformMethod(config)
  config.url = transformURL(config)
  config.headers = transformHeaders(config) // call before transform data
  config.data = transformData(config)
  config.headers = flatternHeaders(config.headers, config.method as Method)
}
function transformMethod(config: AxiosRequestConfig): string {
  return config.method ? config.method.toUpperCase() : 'GET'
}
function transformURL(config: AxiosRequestConfig): string {
  const { url, params } = config
  return buildURL(url!, params) // Type Assertion
}

function transformData(config: AxiosRequestConfig): any {
  return transformRequestData(config.data)
}

function transformHeaders(config: AxiosRequestConfig): any {
  const { headers = {}, data } = config
  return transformHeadersData(headers, data)
}

function transformResponse(response: AxiosResponse): AxiosResponse {
  response.data = transformResponseData(response.data)
  return response
}

export default dispatchRequest


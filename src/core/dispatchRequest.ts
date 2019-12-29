import { AxiosRequestConfig, AxiosPromise, Method } from '../types'
import xhr from '../xhr'
import { buildURL } from '../helpers/url'
import { flatternHeaders } from '../helpers/headers'
import { transform } from './transform'

function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
  processConfig(config)
  return xhr(config).then(res => transform(res.data, res.headers, res.config.transformResponse))
}

function processConfig(config: AxiosRequestConfig): void {
  config.method = transformMethod(config)
  config.url = transformURL(config)
  config.data = transform(config.data, config.headers, config.transformRequest)
  config.headers = flatternHeaders(config.headers, config.method as Method)
}
function transformMethod(config: AxiosRequestConfig): string {
  return config.method ? config.method.toLowerCase() : 'get'
}
function transformURL(config: AxiosRequestConfig): string {
  const { url, params } = config
  return buildURL(url!, params) // Type Assertion
}

export default dispatchRequest

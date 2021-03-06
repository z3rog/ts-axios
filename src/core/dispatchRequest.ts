import { AxiosRequestConfig, AxiosPromise, Method } from '../types'
import xhr from '../xhr'
import { buildURL, isAbsoluteURL, combineURL } from '../helpers/url'
import { flattenHeaders } from '../helpers/headers'
import { transform } from './transform'

function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
  throwIfCancellationRequest(config) // check if cancelToken has been used(cancel before)
  processConfig(config)
  return xhr(config).then(res => transform(res.data, res.headers, res.config.transformResponse))
}

function processConfig(config: AxiosRequestConfig): void {
  config.method = transformMethod(config)
  config.url = transformURL(config)
  config.data = transform(config.data, config.headers, config.transformRequest)
  config.headers = flattenHeaders(config.headers, config.method as Method)
}
function transformMethod(config: AxiosRequestConfig): string {
  return config.method ? config.method.toLowerCase() : 'get'
}
function transformURL(config: AxiosRequestConfig): string {
  let { url, baseURL, params } = config
  if (baseURL && !isAbsoluteURL(url!)) {
    url = combineURL(baseURL, url)
  }
  return buildURL(url!, params) // Type Assertion
}

function throwIfCancellationRequest(config: AxiosRequestConfig): void {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested()
  }
}

export default dispatchRequest

import { AxiosRequestConfig } from './types'
import xhr from './xhr'
import { buildURL } from './helpers/url'
import { transformRequestData } from './helpers/data'

function axios(config: AxiosRequestConfig): void {
  processConfig(config)
  xhr(config)
}

function processConfig(config: AxiosRequestConfig): void {
  config.url = transformURL(config)
  config.data = transformRequest(config)
}

function transformURL(config: AxiosRequestConfig): string {
  const { url, params } = config
  return buildURL(url, params)
}

function transformRequest(config: AxiosRequestConfig): any {
  return transformRequestData(config.data)
}

export default axios

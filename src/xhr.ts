import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from './types'
import { parseHeaders } from './helpers/headers'

export default function request(
  config: AxiosRequestConfig
): AxiosPromise {
  return new Promise<AxiosResponse>((resolve, reject) => {
    const { data = null, method = 'GET', url } = config
    const request = new XMLHttpRequest()

    setResponseType(request, config)
    setHeaders(request, config)
    request.open(method, url, true)
    request.send(data)
    addReadyStateChangeHandler(request, resolve, config)
    addErrorHandler(request, reject)
  })
}

function setResponseType(
  request: XMLHttpRequest,
  { responseType }: AxiosRequestConfig
): void {
  if (responseType) {
    request.responseType = responseType
  }
}

function setHeaders(
  request: XMLHttpRequest,
  config: AxiosRequestConfig
): void {
  const { data = null, headers } = config

  Object.keys(headers).forEach((name) => {
    // if data === null, no need to set Content-Type
    if (data === null && name.toLowerCase() === 'content-type') {
      delete headers[name]
    } else {
      request.setRequestHeader(name, headers[name])
    }
  })
}

function addReadyStateChangeHandler(
  request: XMLHttpRequest,
  resolve: Function,
  config: AxiosRequestConfig
): void {
  request.onreadystatechange = () => {
    if (request.readyState !== 4) {
      return
    }
    /**
     * use destructuring assignment to get response/responseText from request
     * will get error in some specific responseType
     */
    const { status, statusText } = request
    const { responseType } = config
    const data = responseType !== 'text' ? request.response : request.responseText
    const headers = parseHeaders(request.getAllResponseHeaders())
    const promiseResponse: AxiosResponse = {
      status,
      statusText,
      config,
      headers,
      data,
      request
    }
    resolve(promiseResponse)
  }
}

function addErrorHandler(
  request: XMLHttpRequest,
  reject: Function
): void {
  request.onerror = () => {
    reject(new Error('Network Error'))
  }
}

import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from './types'
import { parseHeaders } from './helpers/headers'

export default function request(config: AxiosRequestConfig): AxiosPromise {
  return new Promise<AxiosResponse>((resolve, reject) => {
    const request = new XMLHttpRequest()

    setResponseTypeNTimeout(request, config)
    setHeaders(request, config)
    addReadyStateChangeHandler(request, resolve, reject, config)
    addErrorHandler(request, reject)
    addTimeoutHandler(request, reject, config)
    openXHR(request, config)
    sendXHRData(request, config)
  })
}

function setResponseTypeNTimeout(request: XMLHttpRequest, { responseType, timeout }: AxiosRequestConfig): void {
  if (responseType) {
    request.responseType = responseType
  }
  if (timeout) {
    request.timeout = timeout
  }
}

function setHeaders(request: XMLHttpRequest, config: AxiosRequestConfig): void {
  const { data = null, headers } = config

  Object.keys(headers).forEach(name => {
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
  reject: Function,
  config: AxiosRequestConfig
): void {
  request.onreadystatechange = () => {
    if (
      request.readyState !== 4 ||
      request.status === 0
    ) {
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
    handlePromiseResponse(promiseResponse, resolve, reject)
  }

  function handlePromiseResponse(
    response: AxiosResponse,
    resolve: Function,
    reject: Function
  ) {
    const { status } = response
    if (status >= 200 && status < 300) {
      resolve(response)
    } else {
      reject(new Error(`Request failed with status code ${status}`))
    }
  }
}

function addErrorHandler(request: XMLHttpRequest, reject: Function): void {
  request.onerror = () => {
    reject(new Error('Network Error'))
  }
}

function addTimeoutHandler(request: XMLHttpRequest, reject: Function, { timeout }: AxiosRequestConfig): void {
  request.ontimeout = () => {
    reject(new Error(`Timeout ${timeout}ms exceeded`))
  }
}

function openXHR(request: XMLHttpRequest, { method = 'GET', url }: AxiosRequestConfig): void {
  request.open(method, url, true)
}

function sendXHRData(request: XMLHttpRequest, { data = null}: AxiosRequestConfig): void {
  request.send(data)
}

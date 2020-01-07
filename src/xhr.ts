import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from './types'
import { parseHeaders } from './helpers/headers'
import { createAxiosError } from './helpers/error'

export default function request(config: AxiosRequestConfig): AxiosPromise {
  return new Promise<AxiosResponse>((resolve, reject) => {
    const request = new XMLHttpRequest()

    openXHR(request, config)
    setResponseTypeNTimeout(request, config)
    setHeaders(request, config)
    addReadyStateChangeHandler(request, resolve, reject, config)
    addErrorHandler(request, reject, config)
    addTimeoutHandler(request, reject, config)
    handleCancelToken(request, reject, config)
    sendXHRData(request, config)
  })
}

function setResponseTypeNTimeout(
  request: XMLHttpRequest,
  { responseType, timeout }: AxiosRequestConfig
): void {
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
    if (request.readyState !== 4 || request.status === 0) {
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
    handlePromiseResponse(promiseResponse, config, resolve, reject)
  }

  function handlePromiseResponse(
    response: AxiosResponse,
    config: AxiosRequestConfig,
    resolve: Function,
    reject: Function
  ) {
    const { status } = response
    if (status >= 200 && status < 300) {
      resolve(response)
    } else {
      reject(
        createAxiosError(
          config,
          `Request failed with status code ${status}`,
          null,
          request,
          response
        )
      )
    }
  }
}

function addErrorHandler(
  request: XMLHttpRequest,
  reject: Function,
  config: AxiosRequestConfig
): void {
  request.onerror = () => {
    reject(createAxiosError(config, 'Network Error', null, request))
  }
}

function addTimeoutHandler(
  request: XMLHttpRequest,
  reject: Function,
  config: AxiosRequestConfig
): void {
  request.ontimeout = () => {
    reject(
      createAxiosError(config, `Timeout ${config.timeout}ms exceeded`, 'ECONNABORTED', request)
    )
  }
}

function handleCancelToken(
  request: XMLHttpRequest,
  reject: Function,
  config: AxiosRequestConfig
): void {
  const { cancelToken } = config
  if (cancelToken) {
    cancelToken.promise.then(reason => {
      request.abort()
      reject(reason)
    })
  }
}

function openXHR(request: XMLHttpRequest, { method = 'GET', url }: AxiosRequestConfig): void {
  request.open(method.toUpperCase(), url!, true)
}

function sendXHRData(request: XMLHttpRequest, { data = null }: AxiosRequestConfig): void {
  request.send(data)
}

import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from './types'
import { parseHeaders } from './helpers/headers'
import { createAxiosError } from './helpers/error'
import { isURLSameOrigin } from './helpers/url'
import cookie from './helpers/cookie'
import { isFormData } from './helpers/util'

export default function request(config: AxiosRequestConfig): AxiosPromise {
  return new Promise<AxiosResponse>((resolve, reject) => {
    const request = new XMLHttpRequest()

    openXHR(request, config)
    setResponseTypeNTimeout(request, config)
    setHeaders(request, config)
    setWithCredentials(request, config)
    addReadyStateChangeHandler(request, resolve, reject, config)
    addErrorHandler(request, reject, config)
    addTimeoutHandler(request, reject, config)
    addProgressHandler(request, config)
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

function setHeaders(
  request: XMLHttpRequest,
  { data = null, headers, withCredentials, url, xsrfCookieName, xsrfHeaderName }: AxiosRequestConfig
): void {
  // handle xsrf relative
  if ((withCredentials || isURLSameOrigin(url!)) && xsrfCookieName) {
    const xsrfValue = cookie.read(xsrfCookieName)

    if (xsrfValue && xsrfHeaderName) {
      headers[xsrfHeaderName] = xsrfValue
    }
  }

  Object.keys(headers).forEach(name => {
    // if data === null, no need to set Content-Type
    if (data === null && name.toLowerCase() === 'content-type') {
      delete headers[name]
    } else {
      request.setRequestHeader(name, headers[name])
    }
  })
}

function setWithCredentials(
  request: XMLHttpRequest,
  { withCredentials }: AxiosRequestConfig
): void {
  if (withCredentials) {
    request.withCredentials = withCredentials
  }
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

function addProgressHandler(
  request: XMLHttpRequest,
  { onDownloadProgress, onUploadProgress, data, headers }: AxiosRequestConfig
) {
  if (onDownloadProgress) {
    request.onprogress = onDownloadProgress
  }

  if (onUploadProgress) {
    request.upload.onprogress = onUploadProgress
  }

  if (isFormData(data)) {
    delete headers['Content-Type'] // let browers set default content-type
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

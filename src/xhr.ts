import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from './types'
import { parseHeaders } from './helpers/headers'

export default function request(config: AxiosRequestConfig): AxiosPromise {
  return new Promise(resolve => {
    const { data = null, method = 'GET', url, responseType } = config
    const request = new XMLHttpRequest()
    if (responseType) {
      request.responseType = responseType
    }
    request.open(method, url, true)

    setHeaders(request, config)

    request.send(data)

    request.onreadystatechange = () => {
      if (request.readyState !== 4) {
        return
      }

      const headers = parseHeaders(request.getAllResponseHeaders())
      const { status, statusText, response, responseText } = request
      const data = responseType !== 'text' ? response : responseText

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
  })
}

function setHeaders(request: XMLHttpRequest, config: AxiosRequestConfig) {
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

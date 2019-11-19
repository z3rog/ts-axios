import { XHRRequestConfig } from './types'

export default function xhr(config: XHRRequestConfig) {
  const { data = null, method, url } = config
  const xhr = new XMLHttpRequest()
  xhr.open(method, url, true)
  setHeaders(xhr, config)
  xhr.send(data)
}

function setHeaders(xhr: XMLHttpRequest, config: XHRRequestConfig) {
  const { data = null, headers } = config

  Object.keys(headers).forEach((name) => {
    // if data === null, no need to set Content-Type
    if (data === null && name.toLowerCase() === 'content-type') {
      delete headers[name]
    } else {
      xhr.setRequestHeader(name, headers[name])
    }
  })
}

import { isNullOrUndefined, isDate, isObject } from './util'

function encode(val: string): string {
  return encodeURIComponent(val)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5B/gi, ']')
}

export function buildURL(url: string, params?: object): string {
  if (!params) {
    return url
  }

  const parts: Array<string> = []

  Object.entries(params).forEach(([key, value]) => {
    if (isNullOrUndefined(value)) {
      return
    }
    let values = []
    if (!Array.isArray(value)) {
      values.push(value)
    } else {
      values = value
      key += '[]'
    }

    values.forEach(value => {
      if (isDate(value)) {
        value = value.toISOString()
      } else if (isObject(value)) {
        value = JSON.stringify(value)
      }
      parts.push(`${encode(key)}=${encode(value)}}`)
    })
  })

  let serializedParams = parts.join('&')
  if (serializedParams) {
    const markIndex = url.indexOf('#')
    if (markIndex !== -1) {
      url = url.slice(0, markIndex)
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams
  }

  return url
}

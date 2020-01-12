import { isNullOrUndefined, isDate, isPlainObject, isURLSearchParams } from './util'

interface URLOrigin {
  protocol: string
  host: string
}

interface ParamsSerializer {
  (params: any): string
}

function encode(val: string): string {
  return encodeURIComponent(val)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}

function resolveURL(url: string): URLOrigin {
  urlParsingNode.setAttribute('href', url)
  const { protocol, host } = urlParsingNode

  return { protocol, host }
}

const urlParsingNode = document.createElement('a')
const currentOrigin = resolveURL(window.location.href)

export function isURLSameOrigin(requestURL: string): boolean {
  const parsedOrigin = resolveURL(requestURL)

  return (
    parsedOrigin.protocol === currentOrigin.protocol && parsedOrigin.host === currentOrigin.host
  )
}

export function buildURL(
  url: string,
  params?: object,
  paramsSerializer?: ParamsSerializer
): string {
  if (!params) {
    return url
  }

  let serializedParams

  if (paramsSerializer) {
    serializedParams = paramsSerializer(params)
  } else if (isURLSearchParams(params)) {
    serializedParams = params.toString()
  } else {
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
        } else if (isPlainObject(value)) {
          value = JSON.stringify(value)
        }
        parts.push(`${encode(key)}=${encode(value)}`)
      })
    })
  }

  if (serializedParams) {
    const markIndex = url.indexOf('#')
    if (markIndex !== -1) {
      url = url.slice(0, markIndex)
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams
  }

  return url
}

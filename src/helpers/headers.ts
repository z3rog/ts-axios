import { isPlainObject, deepMerge} from './util'
import { Method } from '../types'

function normalizeHeadersName(headers: any, normalizedName: string): void {
  if (!headers) {
    return
  }
  Object.entries(headers).forEach(([name, value]) => {
    if (
      name !== normalizedName &&
      name.toUpperCase() === normalizedName.toUpperCase()
    ) {
      delete headers[name]
      headers[normalizedName] = value
    }
  })
}

export function transformHeadersData(headers: any, data: any): any {
  normalizeHeadersName(headers, 'Content-Type')

  if (isPlainObject(data)) {
    if (headers && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json;chartset=utf-8'
    }
  }

  return headers
}

export function parseHeaders(headers: string): object {
  const headerMap = Object.create(null)
  headers.trim().split(/[\r\n]+/).forEach(line => {
    const [key, value] = line.split(': ')
    headerMap[key] = value
  })

  return headerMap
}


export function flatternHeaders(headers: any, method: Method) {
  if (!headers) {
    return headers
  }

  headers = deepMerge(headers.common, headers[method], headers)
  const keysToDelete: (Method | string)[] = ['get', 'delete', 'head', 'options', 'patch', 'post', 'put', 'delete', 'common']

  keysToDelete.forEach(key => {
    delete headers[key]
  })

  return headers
}

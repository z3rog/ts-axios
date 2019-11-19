import { isPlainObject} from './util'

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

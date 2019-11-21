import { isPlainObject, isNullOrUndefined } from './util'

export function transformRequestData(data: any): any {
  if (isPlainObject(data)) {
    return JSON.stringify(data)
  }
  return data
}

export function transformResponseData(data: any): any {
  if (isNullOrUndefined(data)) {
    return
  }
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data)
    } catch {
      // do nothing
    }
  }

  return data
}

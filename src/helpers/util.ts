export function isNullOrUndefined(val: any): boolean {
  return val === null || val === undefined
}

const toString = Object.prototype.toString

export function isDate(val: any): val is Date {
  return toString.call(val) === '[object Date]'
}

export function isObject(val: any): val is Object {
  return val !== null && typeof val === 'object'
}

export function isPlainObject(val: any): val is Object {
  return toString.call(val) === '[object Object]'
}

export function isFormData(val: any): val is FormData {
  return typeof val !== 'undefined' && val instanceof FormData
}

export function extend<T, U>(to: T, from: U): T & U {
  for (const key in from) {
    ;(to as T & U)[key] = from[key] as any
  }

  return to as T & U
}

export function deepMerge(...objs: any[]): any {
  const result = Object.create(null)

  objs.forEach(obj => {
    if (obj) {
      Object.entries(obj).forEach(([key, value]) => {
        if (isPlainObject(value)) {
          if (isPlainObject(result[key])) {
            // if result[key] already exist and it's an object
            result[key] = deepMerge(result[key], value)
          } else {
            result[key] = deepMerge(value)
          }
        } else {
          result[key] = value
        }
      })
    }
  })

  return result
}

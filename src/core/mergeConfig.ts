import { AxiosRequestConfig, AxiosRequestConfigKey } from '../types'
import { isPlainObject, deepMerge } from '../helpers/util'

function defaultStrategy(val1: any, val2: any): any {
  return typeof val2 !== 'undefined' ? val2 : val1
}

function fromVal2Strategy(_: any, val2: any): any {
  if (typeof val2 !== 'undefined') {
    return val2
  }
}

function deepMergeStrategy(val1: any, val2: any): any {
  if (isPlainObject(val2)) {
    return deepMerge(val1, val2)
  } else if (val2 !== undefined) {
    return val2
  } else if (isPlainObject(val1)) {
    return deepMerge(val1)
  } else if (val1 !== undefined) {
    return val1
  }
}

const strategyMap = Object.create(null)
const defaultStrategyKeys: AxiosRequestConfigKey[] = [
  'method',
  'params',
  'responseType',
  'timeout',
  'transformRequest',
  'transformResponse',
  'CancelToken',
  'withCredentials',
  'onUploadProgress',
  'onDownloadProgress'
]
const fromVal2StrategyKeys: AxiosRequestConfigKey[] = ['url', 'params', 'data']
const deepMergeStrategyKeys: AxiosRequestConfigKey[] = ['headers', 'auth']

defaultStrategyKeys.forEach(key => (strategyMap[key] = defaultStrategy))
fromVal2StrategyKeys.forEach(key => (strategyMap[key] = fromVal2Strategy))
deepMergeStrategyKeys.forEach(key => (strategyMap[key] = deepMergeStrategy))

export function mergeConfig(
  config1: AxiosRequestConfig,
  config2?: AxiosRequestConfig
): AxiosRequestConfig {
  if (!config2) {
    config2 = {}
  }

  const config: AxiosRequestConfig = Object.create(null)

  for (const key in config2) {
    mergeField(key)
  }

  for (const key in config1) {
    if (!(key in config2)) {
      mergeField(key)
    }
  }

  function mergeField(key: string): void {
    const strategy = strategyMap[key] || defaultStrategy // in case of some defaultStrategyKeys missing
    config[key] = strategy(config1[key], config2![key])
  }

  return config
}

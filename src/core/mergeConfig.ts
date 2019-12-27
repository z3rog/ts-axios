import { AxiosRequestConfig, AxiosRequestConfigKey } from '../types'

function defaultStrategy(val1: any, val2: any): any {
  return typeof val2 !== undefined ? val2 : val1
}

function fromVal2Strategy(_: any, val2: any): any {
  if (typeof val2 !== undefined) {
    return val2
  }
}
const strategyMap = Object.create(null)
const defaultStrategyKeys: AxiosRequestConfigKey[] = ['method', 'params', 'responseType', 'timeout']
const fromVal2StrategyKeys: AxiosRequestConfigKey[] = ['url', 'params', 'data']

defaultStrategyKeys.forEach(key => (strategyMap[key] = defaultStrategy))
fromVal2StrategyKeys.forEach(key => (strategyMap[key] = fromVal2Strategy))

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
    const strategy = strategyMap[key]
    config[key] = strategy(config1[key], config2![key])
  }

  return config
}

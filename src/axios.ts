import { AxiosStaticInstance, AxiosRequestConfig } from './types'
import Axios from './core/Axios'
import { extend } from './helpers/util'
import defaults from './defaults'
import { mergeConfig } from './core/mergeConfig'

function createInstance(config: AxiosRequestConfig): AxiosStaticInstance {
  const context = new Axios(config)
  const instance = Axios.prototype.request.bind(context)

  extend(instance, context)

  return instance as AxiosStaticInstance
}

const axios = createInstance(defaults)

axios.create = config => createInstance(mergeConfig(defaults, config))

export default axios

import axios, { AxiosTransformer } from '../../src/index'
import qs from 'qs'

axios({
  transformRequest: [
    data => {
      return qs.stringify(data)
    },
    ...(axios.defaults.transformRequest as AxiosTransformer[])
  ],
  transformResponse: [
    ...(axios.defaults.transformResponse as AxiosTransformer[]),
    data => {
      if (typeof data === 'object') {
        data.b = 2
      }
      return data
    }
  ],

  url: '/config/post',
  method: 'post',
  data: {
    a: 1
  }
})
  .then(res => console.log(res))
  .catch(e => console.error(e))

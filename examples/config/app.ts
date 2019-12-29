import axios from '../../src/index'
import qs from 'qs'

axios.defaults.headers.common['test-header2'] = 123132

axios({
  url: '/config/post',
  method: 'post',
  data: qs.stringify({
    a: 1
  }),
  headers: {
    'test-header1': '321321'
  },
  data: qs.stringify({
    a: 1
  })
})

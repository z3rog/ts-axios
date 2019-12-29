import axios from '../../src/index'

axios.defaults.headers.common['test-header2'] = 123132

axios({
  url: '/config/post',
  method: 'post',
  headers: {
    'test-header1': '321321'
  }
})

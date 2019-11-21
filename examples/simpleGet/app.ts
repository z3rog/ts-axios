import axios from '../../src/index'
const date = new Date()
// array, date
axios({
  method: 'get',
  url: '/simpleGet/get',
  params: {
    a: [1, 2],
    b: date
  }
}).then(res => console.log(res))
// special characters
axios({
  method: 'get',
  url: '/simpleGet/get',
  responseType: 'json',
  timeout: 1000,
  params: {
    a: '@:$,[] '
  }
}).then(res => console.log(res))
// hash
axios({
  method: 'get',
  url: '/simpleGet/get#afafa',
  params: {
    a: 1
  }
}).then(res => console.log(res))

// null
axios({
  method: 'get',
  url: '/simpleGet/get#afafa',
  params: {
    a: 1,
    b: null
  }
}).then(res => console.log(res))

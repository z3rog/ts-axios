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
})
// special characters
axios({
  method: 'get',
  url: '/simpleGet/get',
  params: {
    a: '@:$,[] '
  }
})
// hash
axios({
  method: 'get',
  url: '/simpleGet/get#afafa',
  params: {
    a: 1
  }
})

// null
axios({
  method: 'get',
  url: '/simpleGet/get#afafa',
  params: {
    a: 1,
    b: null
  }
})

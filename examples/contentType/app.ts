import axios from '../../src/index'

// data is not null, add content-type
axios({
  method: 'post',
  url: '/contentType/post',
  data: {
    a: 1,
    b: 2
  }
})

// data is null, no content-type
axios({
  method: 'post',
  url: '/contentType/post',
  data: null
})

// manually set headers, cover default value
axios({
  method: 'post',
  url: '/contentType/post',
  headers: {
    'content-type': 'application/json',
    'Accept': 'application/json, text/plain. */*'
  },
  data: {
    a: 1,
    b: 2
  }
})

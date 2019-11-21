import axios from '../../src/index'

axios({
  method: 'post',
  url: '/buffer/post',
  data: new Int32Array([1, 2, 4])
}).then(res => {
  console.log(res)
})

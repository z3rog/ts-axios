import axios from '../../src/index'


axios({
  url: '/auth/post',
  method: 'post',
  data: {
    test: 1
  },
  auth: {
    username: 'Leung',
    password: '123456'
  }
}).then(data => console.log(data))
  .catch(e => console.error(e))

axios({
  url: '/auth/post',
  method: 'post',
  data: {
    test: 1
  },
  auth: {
    username: 'Leung',
    password: '1234567'
  }
}).then(data => console.log(data))
  .catch(e => console.error(e))




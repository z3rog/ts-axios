import axios from '../../src/index'

axios({
  url: '/extend/post',
  method: 'post',
  data: {
    msg: 'test'
  }
})

axios.request({
  url: '/extend/post',
  method: 'post',
  data: {
    msg: 'hello world'
  }
})

interface User {
  name: string,
  age: number
}

interface ResponseData<T = any> {
  code: number,
  data: T,
  message: string
}


async function getUser<T>() {
  return axios<ResponseData<T>>('/extend/user')
    .then(res => res.data)
    .catch(e => console.error(e))
}

async function test() {
  const user = await getUser<User>()
  if (user) {
    const { code, message, data } = user
    console.log({ data })
  }
}

test()

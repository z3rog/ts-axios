import axios, { Canceler } from '../../src/index'
import Cancel from '../../src/cancel/Cancel'

const CancelToken = axios.CancelToken
const source = CancelToken.source()

axios.get('/cancel/get', {
  cancelToken: source.token
}).catch(e => {
  if (axios.isCancel(e)) {
    console.error('request canceled', e.message)
  }
})
// expect response in 1 second, cancel it in 100ms to log the error in console
setTimeout(() => {
  source.cancel('Canceled by the user')

  axios.post('/cancel/post', { a: 1 }, {
    cancelToken: source.token // token has been used, try a post request which uses same token
  }).catch(e => {
    if (axios.isCancel(e)) {
      console.error(e.message)
    }
  })
}, 100)

let cancel: Canceler

axios.get('/cancel/get', {
  cancelToken: new CancelToken(c => cancel = c)
}).catch(e => {
  if (axios.isCancel(e)) {
    console.error('requesst canceled', e.message)
  }
})

setTimeout(() => cancel(), 200)

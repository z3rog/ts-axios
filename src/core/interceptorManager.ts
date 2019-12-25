import { ResolvedFn, RejectedFn } from '../types'

interface Interceptor<T> {
  resolve: ResolvedFn<T>
  reject?: RejectedFn
}

export default class InterceptorManager<T> {
  private interceptors: Array<Interceptor<T> | null>

  constructor() {
    this.interceptors = []
  }

  use(resolve: ResolvedFn<T>, reject?: RejectedFn): number {
    this.interceptors.push({
      resolve,
      reject
    })

    return this.interceptors.length - 1
  }

  eject(id: number): void {
    if (this.interceptors[id]) {
      this.interceptors[id] = null
    }
  }

  forEach(fn: (interceptor: Interceptor<T>) => void):void {
    this.interceptors.forEach(interceptor =>
      interceptor !== null && fn(interceptor)
    )
  }
}

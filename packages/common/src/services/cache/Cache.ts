import { NestedDict } from './NestedDict'

export interface CacheBackend {
  read(): NestedDict
  write(data: NestedDict): void
}

type WithAsyncMethod<K extends string> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [X in K]: (...args: any[]) => Promise<any>
}

export class Cache {
  private cache = new NestedDict({})
  private promises = new NestedDict<Promise<unknown>>({})
  private initialized = false

  constructor(private backend: CacheBackend) {}

  init() {
    if (this.initialized) {
      return
    }
    this.initialized = true
    this.cache = this.backend.read()
  }

  get(module: string, key: string) {
    this.init()
    return this.cache.get(module, key)
  }

  has(module: string, key: string) {
    this.init()
    return this.cache.has(module, key)
  }

  set(module: string, key: string, value: unknown) {
    this.init()
    this.cache.set(module, key, value)
    this.flush()
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  wrapSync<A extends any[], R>(module: string, fn: (...args: A) => R) {
    return (...args: A): R => {
      const key = JSON.stringify(args)
      if (this.has(module, key)) {
        return this.get(module, key) as R
      }
      const value = fn(...args)
      this.set(module, key, value)
      return value
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  wrap<A extends any[], R>(module: string, fn: (...args: A) => Promise<R>) {
    return async (...args: A): Promise<R> => {
      const key = JSON.stringify(args)
      if (this.has(module, key)) {
        return this.get(module, key) as R
      }
      let promise = this.promises.get(module, key) as Promise<R> | undefined
      if (promise) {
        return promise
      }
      promise = fn(...args)
      this.promises.set(module, key, promise)
      promise.then((value) => this.set(module, key, value))
      return promise
    }
  }

  wrapMethod<K extends string>(
    object: WithAsyncMethod<K>,
    method: K,
    module?: string,
  ) {
    if (!module) {
      module = `${object.constructor.name}.${method}`
    }
    object[method] = this.wrap(module, object[method].bind(object))
  }

  private flush = debounce(this.save.bind(this))

  private save() {
    this.backend.write(this.cache)
  }
}

function debounce(func: () => void, timeout = 300) {
  let timer: ReturnType<typeof setTimeout>
  return () => {
    clearTimeout(timer)
    timer = setTimeout(() => func(), timeout)
  }
}

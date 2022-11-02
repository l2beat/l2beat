import { CacheBackend } from './Cache'
import { NestedDict } from './NestedDict'

export class InMemoryCacheBackend implements CacheBackend {
  dict: NestedDict

  constructor(data: NestedDict['data'] = {}) {
    this.dict = new NestedDict(data)
  }

  read() {
    return this.dict
  }

  write(data: NestedDict) {
    this.dict = data
  }
}

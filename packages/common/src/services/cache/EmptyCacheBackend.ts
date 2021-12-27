import { CacheBackend } from './Cache'
import { NestedDict } from './NestedDict'

export class EmptyCacheBackend implements CacheBackend {
  read(): NestedDict {
    return new NestedDict({})
  }

  write() {}
}

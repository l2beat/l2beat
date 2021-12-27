import fs from 'fs'
import mkdirp from 'mkdirp'
import path from 'path'

import { CacheBackend } from './Cache'
import { NestedDict } from './NestedDict'

export class FileCacheBackend implements CacheBackend {
  private filename = `.cache/cache.json`

  constructor(filename?: string) {
    if (filename) {
      this.filename = filename
    }
  }

  read(): NestedDict {
    if (!fs.existsSync(this.filename)) {
      return new NestedDict({})
    }
    const data = JSON.parse(fs.readFileSync(this.filename, 'utf8'))
    return new NestedDict(data)
  }

  write(data: NestedDict) {
    const absolute = path.resolve(this.filename)
    mkdirp.sync(path.dirname(absolute))
    fs.writeFileSync(absolute, JSON.stringify(data.data, null, 2))
  }
}

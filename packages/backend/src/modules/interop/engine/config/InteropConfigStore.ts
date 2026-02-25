import type { Database } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'

type InteropConfig<T> = { key: string; __type: T }

export function defineConfig<T>(key: string): InteropConfig<T> {
  return { key } as InteropConfig<T>
}

export interface InteropConfigPlugin {
  provides: InteropConfig<unknown>[]
  intervalMs?: number
  start: () => void
  run: () => Promise<void>
}

export class InteropConfigStore {
  private configs = new Map<string, unknown>()

  constructor(private db: Database | undefined) {}

  async start() {
    if (!this.db) return
    const configs = await this.db?.interopConfig.getAllLatest()
    for (const config of configs) {
      this.configs.set(config.key, config.value)
    }
  }

  async set<D extends InteropConfig<unknown>>(
    def: D,
    value: D['__type'],
  ): Promise<void> {
    await this.db?.interopConfig.insert({
      key: def.key,
      value,
      timestamp: UnixTime.now(),
    })
    this.configs.set(def.key, value)
  }

  get<T>(def: InteropConfig<T>): T | undefined {
    return this.configs.get(def.key) as T | undefined
  }

  getAll() {
    return Object.fromEntries(this.configs.entries())
  }

  writeAll(configs: Record<string, unknown>) {
    for (const [key, value] of Object.entries(configs)) {
      this.configs.set(key, value)
    }
  }
}

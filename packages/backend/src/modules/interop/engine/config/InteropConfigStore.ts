import type { Database } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'

type InteropConfig<T> = { key: string; __type: T }

export function defineConfig<T>(key: string): InteropConfig<T> {
  return { key } as InteropConfig<T>
}

export interface InteropConfigPlugin {
  provides: InteropConfig<unknown>
  intervalMs?: number
  run: () => Promise<void>
}

export class InteropConfigStore {
  private networks = new Map<string, unknown>()

  constructor(private db: Database | undefined) {}

  async start() {
    if (!this.db) return
    const networks = await this.db?.interopConfig.getAllLatest()
    for (const network of networks) {
      this.networks.set(network.key, network.value)
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
    this.networks.set(def.key, value)
  }

  get<T>(def: InteropConfig<T>): T | undefined {
    return this.networks.get(def.key) as T | undefined
  }
}

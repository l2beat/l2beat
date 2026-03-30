import { type InteropConfig, InteropConfigStore } from './InteropConfigStore'

/**
 * A base proxy that sits between config plugins and the underlying store.
 * Subclasses can intercept selected methods (most importantly set).
 */
export abstract class AbstractInteropConfigStoreProxy extends InteropConfigStore {
  constructor(private readonly target: InteropConfigStore) {
    // We delegate all behavior to the wrapped store.
    super(undefined)
  }

  override async start(): Promise<void> {
    await this.target.start()
  }

  override async set<D extends InteropConfig<unknown>>(
    def: D,
    value: D['__type'],
  ): Promise<void> {
    await this.target.set(def, value)
  }

  override get<T>(def: InteropConfig<T>): T | undefined {
    return this.target.get(def)
  }

  override getAll() {
    return this.target.getAll()
  }

  override writeAll(configs: Record<string, unknown>) {
    this.target.writeAll(configs)
  }
}

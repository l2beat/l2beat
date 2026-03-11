import type { InteropNotifier } from '../notifications/InteropNotifier'
import { AbstractInteropConfigStoreProxy } from './AbstractInteropConfigStoreProxy'
import type { InteropConfig, InteropConfigStore } from './InteropConfigStore'

export class InteropMonitoringConfigStoreProxy extends AbstractInteropConfigStoreProxy {
  constructor(
    target: InteropConfigStore,
    private readonly notifier: InteropNotifier,
  ) {
    super(target)
  }

  override async set<D extends InteropConfig<unknown>>(
    def: D,
    value: D['__type'],
  ): Promise<void> {
    const previous = this.get(def)

    await super.set(def, value)

    this.notifier.handleConfigChange(def.key, previous, value)
  }
}

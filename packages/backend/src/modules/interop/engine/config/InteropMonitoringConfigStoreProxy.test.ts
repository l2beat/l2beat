import { expect, mockObject } from 'earl'
import type { InteropNotifier } from '../notifications/InteropNotifier'
import { defineConfig, InteropConfigStore } from './InteropConfigStore'
import { InteropMonitoringConfigStoreProxy } from './InteropMonitoringConfigStoreProxy'

const ExampleConfig = defineConfig<{ foo: number }>('example')

describe(InteropMonitoringConfigStoreProxy.name, () => {
  it('stores value and forwards previous/current values to notifier', async () => {
    const notifier = mockObject<InteropNotifier>({
      handleConfigChange: () => {},
    })
    const proxy = new InteropMonitoringConfigStoreProxy(
      new InteropConfigStore(undefined),
      notifier,
    )

    await proxy.set(ExampleConfig, { foo: 1 })

    expect(proxy.get(ExampleConfig)).toEqual({ foo: 1 })
    expect(notifier.handleConfigChange).toHaveBeenCalledTimes(1)
    expect(notifier.handleConfigChange).toHaveBeenCalledWith(
      ExampleConfig.key,
      undefined,
      { foo: 1 },
    )
  })

  it('passes the old value when updating an existing entry', async () => {
    const notifier = mockObject<InteropNotifier>({
      handleConfigChange: () => {},
    })
    const proxy = new InteropMonitoringConfigStoreProxy(
      new InteropConfigStore(undefined),
      notifier,
    )

    proxy.writeAll({ [ExampleConfig.key]: { foo: 1 } })

    await proxy.set(ExampleConfig, { foo: 2 })

    expect(notifier.handleConfigChange).toHaveBeenCalledWith(
      ExampleConfig.key,
      { foo: 1 },
      { foo: 2 },
    )
  })
})

import { getRpcMetricsContext } from '@l2beat/shared'
import { expect } from 'earl'
import {
  instrumentInteropRpcMetricsRun,
  withInteropRpcMetricsContext,
} from './interopRpcMetrics'

describe(withInteropRpcMetricsContext.name, () => {
  it('sets the interop module and merges extra tags', async () => {
    let context: ReturnType<typeof getRpcMetricsContext> | undefined

    await withInteropRpcMetricsContext(
      {
        service: 'sync',
        chain: 'ethereum',
      },
      async () => {
        context = getRpcMetricsContext()
      },
    )

    expect(context).toEqual({
      module: 'interop',
      service: 'sync',
      chain: 'ethereum',
    })
  })
})

describe(instrumentInteropRpcMetricsRun.name, () => {
  it('wraps run() with interop rpc metrics context', async () => {
    let context: ReturnType<typeof getRpcMetricsContext> | undefined
    const target = {
      async run() {
        context = getRpcMetricsContext()
      },
    }

    instrumentInteropRpcMetricsRun(target, {
      service: 'config',
      plugin: 'across',
    })

    await target.run()

    expect(context).toEqual({
      module: 'interop',
      service: 'config',
      plugin: 'across',
    })
  })
})

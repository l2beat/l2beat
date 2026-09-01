import { getRpcMetricsContext } from '@l2beat/shared'
import { expect } from 'earl'
import {
  instrumentCoreFeatureRpcMetricsRun,
  withCoreFeatureRpcMetricsContext,
} from './coreFeatureRpcMetrics'

describe(withCoreFeatureRpcMetricsContext.name, () => {
  it('sets coreFeature and merges extra tags', async () => {
    let context: ReturnType<typeof getRpcMetricsContext> | undefined

    await withCoreFeatureRpcMetricsContext(
      'interop.sync',
      {
        chain: 'ethereum',
        pluginCluster: 'across',
      },
      async () => {
        context = getRpcMetricsContext()
      },
    )

    expect(context).toEqual({
      coreFeature: 'interop.sync',
      chain: 'ethereum',
      pluginCluster: 'across',
    })
  })
})

describe(instrumentCoreFeatureRpcMetricsRun.name, () => {
  it('wraps run() with coreFeature rpc metrics context', async () => {
    let context: ReturnType<typeof getRpcMetricsContext> | undefined
    const target = {
      async run() {
        context = getRpcMetricsContext()
      },
    }

    instrumentCoreFeatureRpcMetricsRun(target, 'interop.config', {
      plugin: 'across',
    })

    await target.run()

    expect(context).toEqual({
      coreFeature: 'interop.config',
      plugin: 'across',
    })
  })
})

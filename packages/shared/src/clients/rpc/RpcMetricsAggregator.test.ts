import { Logger, type LoggerTransport } from '@l2beat/backend-tools'
import { describe, expect, it, vi } from 'vitest'
import { RpcMetricsAggregator } from './RpcMetricsAggregator'
import { withRpcMetricsContext } from './RpcMetricsContext'

class TestTransport implements LoggerTransport {
  log = vi.fn<LoggerTransport['log']>().mockReturnValue()
  flush = vi.fn<LoggerTransport['flush']>().mockReturnValue()
}

describe(RpcMetricsAggregator.name, () => {
  it('aggregates records by rpc and async-local context', async () => {
    const transport = new TestTransport()
    const aggregator = new RpcMetricsAggregator({
      flushIntervalMs: 1_000,
      logger: new Logger({
        getTime: () => new Date(0),
        transports: [transport],
      }),
    })
    const recorder = aggregator.createRecorder({
      rpcChain: 'ethereum',
      rpcClient: 'EthRpcClient',
    })

    await withRpcMetricsContext(
      {
        coreFeature: 'interop.sync',
        pluginCluster: 'across',
        chain: 'ethereum',
        syncerState: 'catchingUp',
      },
      async () => {
        recorder.record({
          method: 'eth_getLogs',
        })
        await Promise.resolve()
        recorder.record({
          method: 'eth_getLogs',
        })
      },
    )

    aggregator.flush()

    expect(transport.log).toHaveBeenCalledExactlyOnceWith({
      level: 'INFO',
      message: 'Rpc metrics',
      parameters: {
        coreFeature: 'interop.sync',
        chain: 'ethereum',
        count: 2,
        intervalMs: 1_000,
        pluginCluster: 'across',
        rpcChain: 'ethereum',
        rpcClient: 'EthRpcClient',
        rpcMethod: 'eth_getLogs',
        syncerState: 'catchingUp',
      },
      time: new Date(0),
    })
  })

  it('aggregates batch call count', () => {
    const transport = new TestTransport()
    const aggregator = new RpcMetricsAggregator({
      logger: new Logger({
        getTime: () => new Date(0),
        transports: [transport],
      }),
    })
    const recorder = aggregator.createRecorder({
      rpcChain: 'ethereum',
      rpcClient: 'RpcClient',
    })

    recorder.record({
      count: 3,
      method: 'eth_call',
    })

    aggregator.flush()

    expect(transport.log.mock.calls[0][0]?.parameters.count).toEqual(3)
  })
})

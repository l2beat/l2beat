import { Logger, type LoggerTransport } from '@l2beat/backend-tools'
import { expect, mockFn } from 'earl'
import { RpcMetricsAggregator } from './RpcMetricsAggregator'
import { withRpcMetricsContext } from './RpcMetricsContext'

class TestTransport implements LoggerTransport {
  log = mockFn<LoggerTransport['log']>().returns()
  flush = mockFn<LoggerTransport['flush']>().returns()
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

    expect(transport.log).toHaveBeenOnlyCalledWith({
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

    expect(transport.log.calls[0]?.args[0]?.parameters.count).toEqual(3)
  })
})

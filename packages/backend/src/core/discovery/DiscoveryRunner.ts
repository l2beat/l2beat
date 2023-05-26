import {
  ConfigReader,
  DiscoveryConfig,
  DiscoveryEngine,
  toDiscoveryOutput,
} from '@l2beat/discovery'
import { DiscoveryOutput } from '@l2beat/shared'
import { Gauge, Histogram } from 'prom-client'

export class DiscoveryRunner {
  constructor(private readonly discoveryEngine: DiscoveryEngine) {}

  async run(
    config: DiscoveryConfig,
    blockNumber: number,
  ): Promise<DiscoveryOutput> {
    const histogramDone = syncHistogram.startTimer()

    await updateInitialAddresses(config)

    const result = await this.discoveryEngine.discover(config, blockNumber)

    histogramDone({ project: config.name })
    latestBlock.set({ project: config.name }, blockNumber)

    return toDiscoveryOutput(config.name, config.hash, blockNumber, result)
  }
}

const latestBlock = new Gauge({
  name: 'discovery_last_synced',
  help: 'Value showing latest block number with which UpdateMonitor was run',
  labelNames: ['project'],
})

const syncHistogram = new Histogram({
  name: 'discovery_sync_duration_histogram',
  help: 'Histogram showing discovery duration',
  labelNames: ['project'],
  buckets: [2, 4, 6, 8, 10, 15, 20, 30, 60, 120],
})

// There was a case connected with Amarok (better described in L2B-1521)
// the problem was with stack too deep in the discovery caused by misconfigured new contract
// that had a lot of relatives (e.g. Uniswap, DAI)
// unfortunately, it resulted in not discovering important contracts because they cannot be put on the stack
// this function ensures that initial addresses are taken from discovered.json if it exists
// so this way we will always discover "known" contracts
async function updateInitialAddresses(config: DiscoveryConfig) {
  const configReader = new ConfigReader()

  try {
    const discovery = await configReader.readDiscovery(config.name)
    const initialAddresses = discovery.contracts.map((c) => c.address)
    config.initialAddresses = initialAddresses
  } catch (e) {
    console.log(
      'discovered.json does not exist, using initial addresses from config.jsonc',
    )
  }
}

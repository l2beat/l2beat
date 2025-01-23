import { layer2ToBackendProject } from '@l2beat/backend-shared'
import { Logger } from '@l2beat/backend-tools'
import { layer2s } from '@l2beat/config'
import {
  CoingeckoClient,
  CoingeckoQueryService,
  HttpClient,
} from '@l2beat/shared'
import { assert, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { LocalExecutor } from './LocalExecutor'
import { mapConfig } from './mapConfig'
import { CirculatingSupplyProvider } from './providers/CirculatingSupplyProvider'
import { PriceProvider } from './providers/PriceProvider'

main().catch(() => {
  process.exit(1)
})

async function main() {
  const arbitrum = layer2s.find((l) => l.id === ProjectId('arbitrum'))
  assert(arbitrum, 'Arbitrum not found')
  assert(arbitrum.chainConfig, 'Arbitrum chain config not defined')

  const backendProject = layer2ToBackendProject(arbitrum)

  const config = mapConfig(backendProject, arbitrum.chainConfig)

  const http = new HttpClient()
  const coingeckoApiKey = undefined

  const coingeckoClient = new CoingeckoClient({
    apiKey: coingeckoApiKey,
    retryStrategy: 'RELIABLE',
    logger: Logger.SILENT,
    callsPerMinute: coingeckoApiKey ? 400 : 10,
    http,
    sourceName: 'coingecko',
  })
  const coingeckoQueryService = new CoingeckoQueryService(coingeckoClient)
  const priceProvider = new PriceProvider(coingeckoQueryService)
  const circulatingSupplyProvider = new CirculatingSupplyProvider(
    coingeckoQueryService,
  )
  const localExecutor = new LocalExecutor(
    priceProvider,
    circulatingSupplyProvider,
  )
  const tvs = await localExecutor.run(config, [UnixTime.now()])

  console.log(tvs)
  // TODO: breakdown & sum
}

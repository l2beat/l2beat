import { getEnv } from '@l2beat/backend-tools'
import {
  CoingeckoClient,
  CoingeckoQueryService,
  HttpClient,
} from '@l2beat/shared'
import { CoingeckoId, UnixTime } from '@l2beat/shared-pure'
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

import { getBlockByTimestamp } from './getBlockByTimestamp'

async function main() {
  const env = getEnv()

  const apiKey = env.string('COINGECKO_API_KEY')
  const coingecko = new CoingeckoQueryService(
    new CoingeckoClient(new HttpClient(), apiKey),
  )

  const from = UnixTime.fromDate(new Date('2024-04-16T13:00:00Z'))
  const to = UnixTime.fromDate(new Date('2024-04-16T17:00:00Z'))

  const ethPrice = await coingecko.getUsdPriceHistoryHourly(
    CoingeckoId('ethereum'),
    from,
    to,
  )

  const client = createPublicClient({
    chain: mainnet,
    transport: http(),
  })

  const timestamp = UnixTime.fromDate(new Date('2023-04-01T21:37:42Z'))
  const blockNumber = await getBlockByTimestamp(client, timestamp)
  console.log(timestamp.toDate().toISOString(), blockNumber)

  // add logic here
}

main().catch((e: unknown) => {
  console.error(e)
})

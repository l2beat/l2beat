import { getEnv } from '@l2beat/backend-tools'
import {
  CoingeckoClient,
  CoingeckoQueryService,
  HttpClient,
} from '@l2beat/shared'
import { CoingeckoId, UnixTime } from '@l2beat/shared-pure'
import { mean } from 'lodash'
import { createPublicClient, http, PublicClient } from 'viem'
import { mainnet } from 'viem/chains'

import { EVMFeeAnalyzer } from './EVMFeenalyzer'
import { getBlockByTimestamp } from './getBlockByTimestamp'
import { Fee } from './types'

interface Config {
  name: string
  rpc: PublicClient
}

async function main() {
  const env = getEnv()

  const apiKey = env.string('COINGECKO_API_KEY')
  const coingecko = new CoingeckoQueryService(
    new CoingeckoClient(new HttpClient(), apiKey),
  )
  const from = UnixTime.fromDate(new Date('2024-04-13T20:00:00Z'))
  const to = UnixTime.fromDate(new Date('2024-04-13T21:00:00Z'))

  const ethPrice = await coingecko.getUsdPriceHistoryHourly(
    CoingeckoId('ethereum'),
    from,
    to,
  )

  const config: Config[] = [
    {
      name: 'ethereum',
      rpc: createPublicClient({
        chain: mainnet,
        transport: http(),
      }),
    },
  ]

  for (const c of config) {
    console.log(c.name)
    let timestamp = from
    while (timestamp.lte(to)) {
      const d = await getGasPriceForTimestamp(c.rpc, timestamp)
      console.log('\nTimestamp', timestamp.toDate().toISOString())
      console.log('Aggregate:', d)
      timestamp = timestamp.add(1, 'hours')
    }
  }
}

main().catch((e: unknown) => {
  console.error(e)
})

async function getGasPriceForTimestamp(rpc: PublicClient, timestamp: UnixTime) {
  console.log('Getting first block number (this may take a while)...')
  const fromBlock = await getBlockByTimestamp(rpc, timestamp)
  console.log('Getting last block number (this may take a while)...')
  const toBlock = await getBlockByTimestamp(rpc, timestamp.add(1, 'hours'))

  const blockDiff = toBlock - fromBlock
  const granularity = 6

  const d: Fee[] = []

  const feeAnalyzer = new EVMFeeAnalyzer(rpc)

  for (
    let i = fromBlock;
    i < toBlock;
    i += Math.floor(blockDiff / granularity)
  ) {
    console.log('Getting gas price for block', i)
    const dd = await feeAnalyzer.getData(i)
    d.push(dd)
  }

  return mean(d.map((x) => x.avgFeePerGas))
}

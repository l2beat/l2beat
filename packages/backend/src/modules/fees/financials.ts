import { assert, getEnv } from '@l2beat/backend-tools'
import {
  CoingeckoClient,
  CoingeckoQueryService,
  HttpClient,
} from '@l2beat/shared'
import { CoingeckoId, UnixTime } from '@l2beat/shared-pure'
import { writeFileSync } from 'fs'
import { mean } from 'lodash'
import { createPublicClient, http, PublicClient } from 'viem'
import { mainnet } from 'viem/chains'

import { EVMFeeAnalyzer } from './EVMFeeAnalyzer'
import { getBlockByTimestamp } from './getBlockByTimestamp'
import { Fee } from './types'
import { gweiToEth } from './utils/gasToGwei'

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
  const from = UnixTime.fromDate(new Date('2024-04-16T09:00:00Z'))
  const to = UnixTime.fromDate(new Date('2024-04-16T10:00:00Z'))

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

  type E = {
    gasPriceUsd: number
    timestamp: UnixTime
  }

  for (const c of config) {
    const points: E[] = []

    console.log(c.name)
    // ??? xd
    let timestamp = from.toStartOf('hour')

    while (timestamp.lte(to)) {
      const gasPriceInGwei = await getGasPriceForTimestamp(c.rpc, timestamp)
      console.log('\nTimestamp', timestamp.toDate().toISOString())
      console.log('Aggregate:', gasPriceInGwei)

      const gasPriceInEth = gweiToEth(gasPriceInGwei)

      const price = ethPrice.find((x) => x.timestamp.equals(timestamp))

      assert(price, 'lol where price')

      const gasPriceUsd = gasPriceInEth * price.value

      points.push({
        gasPriceUsd,
        timestamp,
      })

      timestamp = timestamp.add(1, 'hours')
    }

    const delimiter = ','
    const headers = ['price', 'timestamp'].join(delimiter)
    const body = points
      .map((point) => [point.gasPriceUsd, +point.timestamp].join(delimiter))
      .join('\n')

    writeFileSync(`./${c.name}.csv`, [headers, body].join('\n'))
  }

  main().catch((e: unknown) => {
    console.error(e)
  })

  async function getGasPriceForTimestamp(
    rpc: PublicClient,
    timestamp: UnixTime,
  ) {
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
}

void main()

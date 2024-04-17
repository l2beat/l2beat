import { assert, getEnv } from '@l2beat/backend-tools'
import {
  BlockscoutClient,
  CoingeckoClient,
  CoingeckoQueryService,
  EtherscanClient,
  HttpClient,
} from '@l2beat/shared'
import { ChainId, CoingeckoId, UnixTime } from '@l2beat/shared-pure'
import { mean } from 'lodash'
import { createPublicClient, http, PublicClient } from 'viem'
import { mainnet } from 'viem/chains'

import { EVMFeeAnalyzer } from './EVMFeeAnalyzer'
import { outputCsv } from './output/outputCsv'
import { Fee, FeeDataPoint } from './types'
import { gweiToEth } from './utils/gasToGwei'

interface Config {
  name: string
  rpc: PublicClient
  blockTimestampClient: EtherscanClient | BlockscoutClient
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
      blockTimestampClient: new EtherscanClient(
        new HttpClient(),
        'https://api.etherscan.io/api',
        'UYB2JK8Q8ZVGVXRZS22DKH8TKQ3ZF1XN94',
        UnixTime.ZERO,
        ChainId(1),
      ),
    },
  ]

  for (const c of config) {
    const points: FeeDataPoint[] = []

    console.log(c.name)
    let timestamp = from.toStartOf('hour')

    while (timestamp.lte(to)) {
      const gasPriceInGwei = await getGasPriceForTimestamp(
        c.rpc,
        c.blockTimestampClient,
        timestamp,
      )
      console.log('\nTimestamp', timestamp.toDate().toISOString())
      console.log('Aggregate:', gasPriceInGwei)

      const gasPriceInEth = gweiToEth(gasPriceInGwei)

      const price = ethPrice.find((x) => x.timestamp.equals(timestamp))

      assert(price, 'lol where price')

      const gasPriceUsd = gasPriceInEth * price.value

      points.push({
        gasPriceGwei: gasPriceInGwei,
        gasPriceUsd,
        timestamp,
      })

      timestamp = timestamp.add(1, 'hours')
    }

    await outputCsv(points, c.name)
  }

  main().catch((e: unknown) => {
    console.error(e)
  })

  async function getGasPriceForTimestamp(
    rpc: PublicClient,
    blockTimestampClient: EtherscanClient | BlockscoutClient,
    timestamp: UnixTime,
  ) {
    const fromBlock = await blockTimestampClient.getBlockNumberAtOrBefore(
      timestamp,
    )
    const toBlock = await blockTimestampClient.getBlockNumberAtOrBefore(
      timestamp.add(1, 'hours'),
    )

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

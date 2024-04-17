import { assert, getEnv } from '@l2beat/backend-tools'
import {
  BlockscoutClient,
  CoingeckoClient,
  CoingeckoQueryService,
  EtherscanClient,
  HttpClient,
} from '@l2beat/shared'
import {
  assertUnreachable,
  ChainId,
  CoingeckoId,
  UnixTime,
} from '@l2beat/shared-pure'
import { mean } from 'lodash'
import { createPublicClient, http, PublicClient } from 'viem'
import { arbitrum, mainnet } from 'viem/chains'

import { ArbitrumFeeAnalyzer } from './ArbitrumFeeAnalyzer'
import { EVMFeeAnalyzer } from './EVMFeeAnalyzer'
import { outputCsv } from './output/outputCsv'
import { Fee, FeeAnalyzer, FeeDataPoint } from './types'
import { gweiToEth } from './utils/gasToGwei'

type AnalyzerType = 'evm' | 'arbitrum'

interface Config {
  name: string
  rpc: PublicClient
  blockTimestampClient: EtherscanClient | BlockscoutClient
  type: AnalyzerType
}

async function main() {
  const env = getEnv()

  const apiKey = env.string('COINGECKO_API_KEY')
  const coingecko = new CoingeckoQueryService(
    new CoingeckoClient(new HttpClient(), apiKey),
  )
  const from = UnixTime.fromDate(new Date('2024-04-13T00:00:00Z'))
  const to = UnixTime.fromDate(new Date('2024-04-14T00:00:00Z'))

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
      type: 'evm',
    },
    {
      name: 'arbitrum',
      rpc: createPublicClient({
        chain: arbitrum,
        transport: http(),
      }),
      blockTimestampClient: new EtherscanClient(
        new HttpClient(),
        'https://api.arbiscan.io/api',
        'TFUJ31KSJ68DJKDFQ1ZHRPNTS1XKCFADHW',
        UnixTime.ZERO,
        ChainId.ARBITRUM,
      ),
      type: 'arbitrum',
    },
  ]

  for (const c of config) {
    const points: FeeDataPoint[] = []
    const analyzer = getAnalyzerForConfig(c)
    const getGasPriceForTimestamp = getGasPriceProvider(
      analyzer,
      c.blockTimestampClient,
    )

    console.log(`Fetching gas prices for ${c.name}`)
    let timestamp = from.toStartOf('hour')

    while (timestamp.lte(to)) {
      const gasPriceInGwei = await getGasPriceForTimestamp(timestamp)
      console.dir({
        timestamp: timestamp.toDate().toISOString(),
        meanAggregate: gasPriceInGwei,
      })

      const gasPriceInEth = gweiToEth(gasPriceInGwei)

      const price = ethPrice.find((x) => x.timestamp.equals(timestamp))

      assert(price, 'no price found')

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
}

function getGasPriceProvider(
  analyzer: FeeAnalyzer,
  blockTimestampClient: EtherscanClient | BlockscoutClient,
) {
  return async function (timestamp: UnixTime) {
    const fromBlock = await blockTimestampClient.getBlockNumberAtOrBefore(
      timestamp,
    )
    const toBlock = await blockTimestampClient.getBlockNumberAtOrBefore(
      timestamp.add(1, 'hours'),
    )

    const blockDiff = toBlock - fromBlock
    const granularity = 6

    const d: Fee[] = []

    for (
      let i = fromBlock;
      i < toBlock;
      i += Math.floor(blockDiff / granularity)
    ) {
      console.log('Getting gas price for block', i)
      const dd = await analyzer.getData(i)
      d.push(dd)
    }

    return mean(d.map((x) => x.avgFeePerGas))
  }
}

main().catch((e: unknown) => {
  console.error(e)
})

function getAnalyzerForConfig(config: Config) {
  switch (config.type) {
    case 'evm':
      return new EVMFeeAnalyzer(config.rpc)
    case 'arbitrum':
      return new ArbitrumFeeAnalyzer(config.rpc)
    default:
      assertUnreachable(config.type)
  }
}

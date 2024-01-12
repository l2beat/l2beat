import { getEnv } from '@l2beat/backend-tools'
import { CoingeckoClient, HttpClient } from '@l2beat/shared'
import { assert, CoingeckoId } from '@l2beat/shared-pure'
import { BigNumber, Contract, providers } from 'ethers'
import { writeFileSync } from 'fs'
import fetch from 'node-fetch'
import { z } from 'zod'

import { EtherscanClient } from './EtherscanClient'
import { getAddresses } from './getAddresses'

main().catch((e) => {
  console.error(e)
})

const ERC20_ABI = [
  'function balanceOf(address) view returns (uint256)',
  'function decimals() view returns (uint8)',
] as const

const pricesSchema = z.record(z.string(), z.object({ usd: z.number() }))

async function main() {
  const env = getEnv()
  const etherscanApiKey = env.string('ETHERSCAN_API_KEY')
  const coingeckoApiKey = env.string('COINGECKO_API_KEY')
  const provider = new providers.AlchemyProvider('homestead')
  const blockNumber = await provider.getBlockNumber()

  const httpClient = new HttpClient()
  const coingeckoClient = new CoingeckoClient(httpClient, coingeckoApiKey)
  const etherscanClient = new EtherscanClient(etherscanApiKey, 100)

  const addresses = await getAddresses(blockNumber, etherscanClient)

  console.log('Fetching coin list...')
  const coinList = await coingeckoClient.getCoinList({
    includePlatform: true,
  })
  const { tokenIds, tokenData } = getRelevantTokenData(coinList, addresses)
  console.log('Fetching prices...')
  const prices = await getCoingeckoPrices(coingeckoClient, tokenIds)

  console.log('Calculating bridged values...')
  const bridgedValues = (
    await Promise.all(
      tokenData.map(async (token) => {
        return await calculateBridgedValue(token, provider, prices)
      }),
    )
  ).filter(notUndefined)

  const totalBridgedValueUsd = bridgedValues.reduce(
    (acc, token) => acc + token.bridgedValueUsd,
    0n,
  )

  console.log('Total bridged value: ', totalBridgedValueUsd)
  console.log('Comparing to live value...')
  await compareWithLive(bridgedValues, totalBridgedValueUsd)
}

interface BridgedValue {
  address: string
  name: string
  symbol: string
  coingeckoId: CoingeckoId
  balance: bigint
  price: number
  decimals: bigint
  bridgedValueUsd: bigint
}

async function compareWithLive(
  bridgedValues: BridgedValue[],
  totalBridgedValueUsd: bigint,
) {
  // TODO: agEUR is not included in the total value as the token that is bridged is a wrapped version of it
  // so coingecko doesn't have the price for it. This
  const THRESHOLD_USD = 10_000_000n

  const response = await fetch(
    'https://api.l2beat.com/api/tvl/aggregate?projectSlugs=omnichain',
  )
  const apiResponse = (await response.json()) as {
    hourly: { data: [number, number][] }
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const liveValueUsd = BigInt(Math.floor(apiResponse.hourly.data.at(-1)![1]))
  assert(
    totalBridgedValueUsd > liveValueUsd,
    'Total value is less than live value. Something is wrong.',
  )

  const diff = totalBridgedValueUsd - liveValueUsd

  if (diff > THRESHOLD_USD) {
    console.log(
      `Total value is ${diff} different from live value. Probably a new token appeared. Check the new tokens that appeared in tokens.json`,
    )

    const dataToSave = {
      totalBridgedValueUsd: totalBridgedValueUsd,
      tokens: bridgedValues.sort((a, b) => a.address.localeCompare(b.address)),
    }

    writeFileSync(
      './scripts/omnichain-value/tokens.json',
      JSON.stringify(
        dataToSave,
        (_, value) =>
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          typeof value === 'bigint' ? value.toString() : value,
        2,
      ),
    )
  } else {
    console.log(
      `Total value is ${diff} different from live value. This is within the ${THRESHOLD_USD} threshold. No action required.`,
    )
  }
}

async function calculateBridgedValue(
  token: {
    address: string
    name: string
    symbol: string
    coingeckoId: CoingeckoId
  },
  provider: providers.AlchemyProvider,
  prices: Record<string, { usd: number }>,
): Promise<BridgedValue | undefined> {
  const contract = new Contract(token.address, ERC20_ABI, provider)

  const [balance, decimals] = await Promise.all([
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    ((await contract.balanceOf(token.address)) as BigNumber).toBigInt(),
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    BigInt((await contract.decimals()) as number),
  ])

  if (balance === 0n) {
    return
  }

  const price = prices[token.coingeckoId.toString()].usd
  const priceBn = BigInt(Math.floor(price * 10 ** 18))
  return {
    ...token,
    balance,
    price,
    decimals,
    bridgedValueUsd: (balance * priceBn) / (BigInt(10 ** 18) * 10n ** decimals),
  }
}

function getRelevantTokenData(
  coinList: {
    symbol: string
    name: string
    platforms: Record<string, string | null>
    id?: CoingeckoId
  }[],
  addresses: string[],
) {
  const tokenData = coinList
    .filter(
      (coin) =>
        coin.platforms.ethereum &&
        addresses.includes(coin.platforms.ethereum.toLowerCase()),
    )
    .map((coin) => ({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      address: coin.platforms.ethereum!,
      name: coin.name,
      symbol: coin.symbol,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      coingeckoId: coin.id!,
    }))
  const tokenIds = tokenData.map((token) => token.coingeckoId)
  return { tokenIds, tokenData }
}

async function getCoingeckoPrices(
  coingeckoClient: CoingeckoClient,
  tokenIds: CoingeckoId[],
) {
  const pricesRaw = await coingeckoClient.query('/simple/price', {
    ids: tokenIds.join(','),
    vs_currencies: 'usd',
  })
  const prices = pricesSchema.parse(pricesRaw)
  return prices
}

function notUndefined<T>(x: T | undefined): x is T {
  return x !== undefined
}

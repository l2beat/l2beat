import type { Logger } from '@l2beat/backend-tools'
import type { IProvider } from '@l2beat/discovery'
import { assert, ChainSpecificAddress, CoingeckoId } from '@l2beat/shared-pure'
import { type BigNumber, utils } from 'ethers'

export interface TokenValue {
  symbol: string
  value: bigint
}

interface Token {
  symbol: string
  coingeckoId: CoingeckoId
  decimals: number
  /** undefined for the native token of the chain */
  address: ChainSpecificAddress | undefined
}

interface TokenBalance extends Token {
  balance: bigint
}

export async function estimateTVL(
  logger: Logger,
  provider: IProvider,
  holder: ChainSpecificAddress,
): Promise<TokenValue[] | undefined> {
  const chain = ChainSpecificAddress.longChain(holder)
  assert(
    provider.chain === chain,
    `Provider is on ${provider.chain} but the address is on ${chain}`,
  )

  const tokens = await getTokensOnChain(logger, chain)
  logger.info(`Searching for balances of ${tokens.length} tokens on ${chain}`)

  const nonZeroBalances = await getBalances(provider, holder, tokens)
  if (nonZeroBalances.length === 0) {
    logger.info('No tokens with non-zero balances found')
    return
  }
  logger.info(`Found ${nonZeroBalances.length} tokens with non-zero balances`)

  const marketData = await getCoinsMarket(
    provider,
    nonZeroBalances.map((entry) => entry.coingeckoId),
  )

  return nonZeroBalances.map((entry) => {
    const price = marketData.find(
      (data) => data.id === entry.coingeckoId.toString(),
    )?.current_price
    return {
      symbol: entry.symbol,
      value: price ? calculateValue(entry.balance, price, entry.decimals) : 0n,
    }
  })
}

const ETHER: Token = {
  symbol: 'ETH',
  coingeckoId: CoingeckoId('ethereum'),
  decimals: 18,
  address: undefined,
}

async function getTokensOnChain(
  logger: Logger,
  chain: string,
): Promise<Token[]> {
  const { ProjectService } = await import('@l2beat/config')
  const tokens: Token[] = (await new ProjectService().getTokens())
    .filter((token) => token.chainName === chain)
    .map((token) => ({
      symbol: token.symbol,
      coingeckoId: token.coingeckoId,
      decimals: token.decimals,
      address:
        token.address === undefined
          ? undefined
          : ChainSpecificAddress.fromLong(chain, token.address),
    }))

  if (tokens.every((token) => token.address !== undefined)) {
    logger.info(`No native token configured for ${chain}, assuming ether`)
    tokens.push(ETHER)
  }

  return tokens
}

async function getBalances(
  provider: IProvider,
  holder: ChainSpecificAddress,
  tokens: Token[],
): Promise<TokenBalance[]> {
  const balances = await Promise.all(
    tokens.map(async (token) => ({
      ...token,
      balance:
        token.address === undefined
          ? await getNativeBalance(provider, holder)
          : await getTokenBalance(provider, holder, token.address),
    })),
  )

  return balances.filter((entry) => entry.balance > 0n)
}

async function getTokenBalance(
  provider: IProvider,
  holder: ChainSpecificAddress,
  token: ChainSpecificAddress,
): Promise<bigint> {
  const balance = await provider.callMethod<BigNumber>(
    token,
    'function balanceOf(address account) view returns (uint256)',
    [ChainSpecificAddress.address(holder).toString()],
  )
  return balance?.toBigInt() ?? 0n
}

async function getNativeBalance(
  provider: IProvider,
  holder: ChainSpecificAddress,
): Promise<bigint> {
  const rawHolder = ChainSpecificAddress.address(holder).toString()
  const balance = await provider.raw(
    `native-balance-${provider.chain}-${rawHolder}-${provider.blockNumber}`,
    async ({ baseProvider }) =>
      (
        await baseProvider.getBalance(rawHolder, provider.blockNumber)
      ).toHexString(),
  )
  return BigInt(balance)
}

// Keyed by block so that re-running the same snapshot is free, while a fresh
// run (which pins a newer block) always fetches fresh prices.
function getCoinsMarket(provider: IProvider, coingeckoIds: CoingeckoId[]) {
  const idsHash = utils.id(coingeckoIds.join(','))
  return provider.raw(
    `coins-market-${provider.chain}-${provider.blockNumber}-${idsHash}`,
    ({ coingeckoClient }) =>
      coingeckoClient.getCoinsMarket(coingeckoIds, 'usd'),
  )
}

const PRICE_PRECISION = 18
const USD_DECIMALS = 2n
function calculateValue(amount: bigint, priceUsd: number, decimals: number) {
  const bigintPriceUsd = getBigIntPrice(priceUsd, PRICE_PRECISION)
  const usdBalance = (amount * bigintPriceUsd) / 10n ** BigInt(decimals)
  const usdValue = usdBalance / 10n ** (18n - USD_DECIMALS)
  return usdValue
}

function getBigIntPrice(price: number, decimals: number): bigint {
  const priceString = price.toFixed(decimals)
  const [integerPart, fractionalPart = ''] = priceString.split('.')
  const priceWithoutDecimal = integerPart + fractionalPart.padEnd(decimals, '0')
  return BigInt(priceWithoutDecimal)
}

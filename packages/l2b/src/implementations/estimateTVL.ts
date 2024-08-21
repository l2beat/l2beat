import { tokenList } from '@l2beat/config'
import { CoingeckoClient, HttpClient } from '@l2beat/shared'
import {
  assert,
  Bytes,
  CoingeckoId,
  EthereumAddress,
  Token,
} from '@l2beat/shared-pure'
import { BigNumber, providers, utils } from 'ethers'

export async function estimateTVL(rpcUrl: string, address: EthereumAddress) {
  const provider = new providers.JsonRpcBatchProvider(rpcUrl)
  console.log('Fetching network...')
  const network = await provider.getNetwork()
  console.log(`ChainId: ${network.chainId}`)

  const tokensOnThisChain = tokenList.filter(
    (token) =>
      +token.chainId === network.chainId && token.address !== undefined,
  )
  console.log(`Searching for balances of ${tokensOnThisChain.length} tokens...`)

  const blockNumber = await provider.getBlockNumber()
  const nonZeroBalances = await getBalances(
    provider,
    address,
    blockNumber,
    tokensOnThisChain,
  )

  if (nonZeroBalances.length === 0) {
    console.log('No tokens with non-zero balances found')
    return
  }
  console.log(`Found ${nonZeroBalances.length} tokens with non-zero balances`)

  const httpClient = new HttpClient()
  const coingeckoClient = new CoingeckoClient(httpClient, undefined)
  const tokenIds = nonZeroBalances.map((entry) => entry.coingeckoId)
  const tokenMarketDatas = await coingeckoClient.getCoinsMarket(tokenIds, 'usd')

  const usdValue = nonZeroBalances.map((entry) => {
    const marketData = tokenMarketDatas.find(
      (marketData) => marketData.id === entry.coingeckoId.toString(),
    )
    let value = 0n
    if (marketData) {
      value = calculateValue(
        entry.balance,
        marketData.current_price,
        entry.decimals,
      )
    }

    return { symbol: entry.symbol, value }
  })

  return usdValue
}

async function getBalances(
  provider: providers.JsonRpcBatchProvider,
  address: EthereumAddress,
  blockNumber: number,
  tokens: Token[],
): Promise<
  {
    symbol: string
    coingeckoId: CoingeckoId
    decimals: number
    balance: bigint
  }[]
> {
  const balances = await Promise.all(
    tokens.map(async (token) => {
      const tokenAddress = token.address
      assert(tokenAddress, 'Token address is missing')
      const balance = await queryTokenBalance(
        provider,
        address,
        tokenAddress,
        blockNumber,
      )
      return {
        symbol: token.symbol,
        balance: balance.toBigInt(),
        decimals: token.decimals,
        coingeckoId: token.coingeckoId,
      }
    }),
  )

  balances.push({
    symbol: 'ETH',
    balance: (
      await provider.getBalance(address.toString(), blockNumber)
    ).toBigInt(),
    decimals: 18,
    coingeckoId: CoingeckoId('ethereum'),
  })

  return balances.filter((e) => e.balance > 0n)
}

async function queryTokenBalance(
  provider: providers.JsonRpcBatchProvider,
  holderAddress: EthereumAddress,
  tokenAddress: EthereumAddress,
  blockNumber: number,
): Promise<BigNumber> {
  const abi = 'function balanceOf(address account) returns (uint256)'
  const coder = new utils.Interface([abi])
  const fragment =
    typeof abi === 'string' ? Object.values(coder.functions)[0] : abi
  assert(fragment, `Unknown fragment for method: ${abi}`)
  const callData = Bytes.fromHex(
    coder.encodeFunctionData(fragment, [holderAddress.toString()]),
  )

  let decodedResult: utils.Result
  try {
    const result = await provider.call(
      {
        to: tokenAddress.toString(),
        data: callData.toString(),
      },
      blockNumber,
    )
    decodedResult = coder.decodeFunctionResult(fragment, result.toString())
  } catch (e) {
    console.log(e)
    return BigNumber.from(0)
  }
  return decodedResult.length === 1 ? decodedResult[0] : decodedResult
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

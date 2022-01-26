import {
  DAI,
  UNISWAP_V2_RELEASE_BLOCK,
  UNISWAP_V3_RELEASE_BLOCK,
  USDC,
  USDT,
  WETH,
} from '../../../constants'
import { ExchangeInfo } from '../../ExchangeAddresses'
import {
  EthBalanceCall,
  MulticallRequest,
  TokenBalanceCall,
  UniV2ReservesCall,
  UniV3PriceCall,
} from '../../multicall'

export function getMulticallCalls(
  tokens: string[],
  exchanges: Record<string, ExchangeInfo>,
  blockNumber: number
): Record<string, MulticallRequest> {
  const requests: Record<string, MulticallRequest> = {}
  addDaiExchanges(requests, exchanges[DAI], blockNumber)
  addTokenExchanges(requests, tokens, exchanges, blockNumber)
  return requests
}

function addDaiExchanges(
  requests: Record<string, MulticallRequest>,
  exchange: ExchangeInfo | undefined,
  blockNumber: number
) {
  if (!exchange || !exchange.uniV1) {
    throw new Error('Missing DAI exchange information')
  }
  requests[`uniV1-token-${DAI}`] = TokenBalanceCall.encode(DAI, exchange.uniV1)
  requests[`uniV1-eth-${DAI}`] = EthBalanceCall.encode(exchange.uniV1)
  if (blockNumber >= UNISWAP_V2_RELEASE_BLOCK) {
    requests[`uniV2Weth-${DAI}`] = UniV2ReservesCall.encode(exchange.uniV2Weth)
  }
}

const IGNORED_TOKENS = [DAI, WETH, USDC, USDT]
const V3_EXCHANGES = ['uniV3Weth', 'uniV3Usdc', 'uniV3Usdt'] as const
const V3_FEES = ['500', '3000', '10000'] as const

export function addTokenExchanges(
  requests: Record<string, MulticallRequest>,
  tokens: string[],
  exchanges: Record<string, ExchangeInfo>,
  blockNumber: number
) {
  for (const token of tokens) {
    if (!IGNORED_TOKENS.includes(token)) {
      const exchange = exchanges[token]
      if (exchange.uniV1) {
        requests[`uniV1-token-${token}`] = TokenBalanceCall.encode(
          token,
          exchange.uniV1
        )
        requests[`uniV1-eth-${token}`] = EthBalanceCall.encode(exchange.uniV1)
      }

      if (blockNumber >= UNISWAP_V2_RELEASE_BLOCK) {
        requests[`uniV2Weth-${token}`] = UniV2ReservesCall.encode(
          exchange.uniV2Weth
        )
        requests[`uniV2Usdc-${token}`] = UniV2ReservesCall.encode(
          exchange.uniV2Usdc
        )
        requests[`uniV2Usdt-${token}`] = UniV2ReservesCall.encode(
          exchange.uniV2Usdt
        )
      }

      if (blockNumber >= UNISWAP_V3_RELEASE_BLOCK) {
        for (const type of V3_EXCHANGES) {
          for (const fee of V3_FEES) {
            const key = `${type}${fee}` as const
            requests[`${key}-token-${token}`] = TokenBalanceCall.encode(
              token,
              exchange[key]
            )
            requests[`${key}-price-${token}`] = UniV3PriceCall.encode(
              exchange[key]
            )
          }
        }
      }
    }
  }
}

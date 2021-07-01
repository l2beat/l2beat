import { DAI, MULTICALL, USDC, USDT, WETH } from '../../../constants'
import { MulticallRequest } from '../../api/MulticallApi'
import { ExchangeInfo } from '../../ExchangeAddresses'
import { coder } from './coder'

export function getMulticallCalls(
  tokenHolders: Record<string, string[]>,
  ethHolders: string[],
  exchanges: Record<string, ExchangeInfo>
): Record<string, MulticallRequest> {
  const requests: Record<string, MulticallRequest> = {}
  addTokenHolders(requests, tokenHolders)
  addEthHolders(requests, ethHolders)
  addDaiExchanges(requests, exchanges[DAI])
  addTokenExchanges(requests, Object.keys(tokenHolders), exchanges)
  return requests
}

function addTokenHolders(
  requests: Record<string, MulticallRequest>,
  tokenHolders: Record<string, string[]>
) {
  for (const [token, holders] of Object.entries(tokenHolders)) {
    for (const holder of holders) {
      requests[`token-${token}-${holder}`] = balanceOf(token, holder)
    }
  }
}

function addEthHolders(
  requests: Record<string, MulticallRequest>,
  ethHolders: string[]
) {
  for (const holder of ethHolders) {
    requests[`eth-${holder}`] = ethBalanceOf(holder)
  }
}

function addDaiExchanges(
  requests: Record<string, MulticallRequest>,
  exchange: ExchangeInfo | undefined
) {
  if (!exchange || !exchange.uniV1) {
    throw new Error('Missing DAI exchange information')
  }
  requests[`uniV1-token-${DAI}`] = balanceOf(DAI, exchange.uniV1)
  requests[`uniV1-eth-${DAI}`] = ethBalanceOf(exchange.uniV1)
  requests[`uniV2Weth-${DAI}`] = reservesOf(exchange.uniV2Weth)
}

const IGNORED_TOKENS = [DAI, WETH, USDC, USDT]
const V3_EXCHANGES = ['uniV3Weth', 'uniV3Usdc', 'uniV3Usdt'] as const
const V3_FEES = ['500', '3000', '10000'] as const

export function addTokenExchanges(
  requests: Record<string, MulticallRequest>,
  tokens: string[],
  exchanges: Record<string, ExchangeInfo>
) {
  for (const token of tokens) {
    if (!IGNORED_TOKENS.includes(token)) {
      const exchange = exchanges[token]
      if (exchange.uniV1) {
        requests[`uniV1-token-${token}`] = balanceOf(token, exchange.uniV1)
        requests[`uniV1-eth-${token}`] = ethBalanceOf(exchange.uniV1)
      }
      requests[`uniV2Weth-${token}`] = reservesOf(exchange.uniV2Weth)
      requests[`uniV2Usdc-${token}`] = reservesOf(exchange.uniV2Usdc)
      requests[`uniV2Usdt-${token}`] = reservesOf(exchange.uniV2Usdt)

      for (const type of V3_EXCHANGES) {
        for (const fee of V3_FEES) {
          const key = `${type}${fee}` as const
          requests[`${key}-token-${token}`] = balanceOf(token, exchange[key])
          requests[`${key}-slot0-${token}`] = slot0Of(exchange[key])
        }
      }
    }
  }
}

export function balanceOf(token: string, holder: string): MulticallRequest {
  return {
    address: token,
    data: coder.encodeFunctionData('balanceOf', [holder]),
  }
}

export function ethBalanceOf(holder: string): MulticallRequest {
  return {
    address: MULTICALL,
    data: coder.encodeFunctionData('getEthBalance', [holder]),
  }
}

export function reservesOf(pair: string): MulticallRequest {
  return {
    address: pair,
    data: coder.encodeFunctionData('getReserves', []),
  }
}

export function slot0Of(pool: string): MulticallRequest {
  return {
    address: pool,
    data: coder.encodeFunctionData('slot0', []),
  }
}

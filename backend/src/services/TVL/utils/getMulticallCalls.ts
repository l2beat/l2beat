import { MULTICALL } from '../../../constants'
import { MulticallRequest } from '../../api/MulticallApi'
import { coder } from './coder'

export function getMulticallCalls(
  tokenHolders: Record<string, string[]>,
  ethHolders: string[]
): Record<string, MulticallRequest> {
  const result: Record<string, MulticallRequest> = {}
  for (const [token, holders] of Object.entries(tokenHolders)) {
    for (const holder of holders) {
      result[`token-${token}-${holder}`] = balanceOf(token, holder)
    }
  }
  for (const holder of ethHolders) {
    result[`eth-${holder}`] = ethBalanceOf(holder)
  }
  return result
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

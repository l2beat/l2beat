import {
  EthBalanceCall,
  MulticallRequest,
  TokenBalanceCall,
} from '../../multicall'

export function getMulticallCalls(
  tokenHolders: Record<string, string[]>,
  ethHolders: string[],
): Record<string, MulticallRequest> {
  const requests: Record<string, MulticallRequest> = {}
  addTokenHolders(requests, tokenHolders)
  addEthHolders(requests, ethHolders)
  return requests
}

function addTokenHolders(
  requests: Record<string, MulticallRequest>,
  tokenHolders: Record<string, string[]>,
) {
  for (const [token, holders] of Object.entries(tokenHolders)) {
    for (const holder of holders) {
      requests[`token-${token}-${holder}`] = TokenBalanceCall.encode(
        token,
        holder,
      )
    }
  }
}

function addEthHolders(
  requests: Record<string, MulticallRequest>,
  ethHolders: string[],
) {
  for (const holder of ethHolders) {
    requests[`eth-${holder}`] = EthBalanceCall.encode(holder)
  }
}

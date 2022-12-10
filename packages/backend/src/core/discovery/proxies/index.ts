import { EthereumAddress } from '@l2beat/types'

import { DiscoveryProvider } from '../provider/DiscoveryProvider'
import { detectArbitrumProxy } from './ArbitrumProxy'
import { detectEip897Proxy } from './Eip897Proxy'
import { detectEip1967Proxy } from './Eip1967Proxy'
import { detectGnosisSafe } from './GnosisSafe'
import { detectLoopringProxy } from './LoopringProxy'
import { detectResolvedDelegateProxy } from './ResolvedDelegateProxy'
import { detectStarkWareProxy } from './StarkWareProxy'
import { ProxyDetection } from './types'

export async function detectProxy(
  provider: DiscoveryProvider,
  address: EthereumAddress,
): Promise<ProxyDetection | undefined> {
  const code = await provider.getCode(address)
  if (code.length === 0) {
    return
  }
  const checks = await Promise.all([
    // the order is important, because some proxies are extensions of others
    detectResolvedDelegateProxy(provider, address),
    detectArbitrumProxy(provider, address),
    detectEip1967Proxy(provider, address),
    detectStarkWareProxy(provider, address),
    detectGnosisSafe(provider, address),
    detectEip897Proxy(provider, address),
    detectLoopringProxy(provider, address),
  ])
  return checks.find((x) => x !== undefined)
}

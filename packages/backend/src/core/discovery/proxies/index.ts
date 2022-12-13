import { EthereumAddress } from '@l2beat/types'

import { DiscoveryProvider } from '../provider/DiscoveryProvider'
import { detectArbitrumProxy } from './auto/ArbitrumProxy'
import { detectEip897Proxy } from './auto/Eip897Proxy'
import { detectEip1967Proxy } from './auto/Eip1967Proxy'
import { detectGnosisSafe } from './auto/GnosisSafe'
import { detectResolvedDelegateProxy } from './auto/ResolvedDelegateProxy'
import { detectStarkWareProxy } from './auto/StarkWareProxy'
import { detectZeppelinOSProxy } from './auto/ZeppelinOSProxy'
import { getCallImplementationProxy } from './manual/CallImplementationProxy'
import { getNewArbitrumProxy } from './manual/NewArbitrumProxy'
import { ManualProxyType, ProxyDetection } from './types'

export async function detectProxy(
  provider: DiscoveryProvider,
  address: EthereumAddress,
  manualProxyType: ManualProxyType | undefined,
): Promise<ProxyDetection | undefined> {
  const code = await provider.getCode(address)
  if (code.length === 0) {
    return
  }
  if (manualProxyType) {
    return getManualProxy(provider, address, manualProxyType)
  }
  const checks = await Promise.all([
    // the order is important, because some proxies are extensions of others
    detectResolvedDelegateProxy(provider, address),
    detectArbitrumProxy(provider, address),
    detectEip1967Proxy(provider, address),
    detectStarkWareProxy(provider, address),
    detectGnosisSafe(provider, address),
    detectEip897Proxy(provider, address),
    detectZeppelinOSProxy(provider, address),
  ])
  return checks.find((x) => x !== undefined)
}

function getManualProxy(
  provider: DiscoveryProvider,
  address: EthereumAddress,
  manualProxyType: ManualProxyType,
) {
  switch (manualProxyType) {
    case 'new Arbitrum proxy':
      return getNewArbitrumProxy(provider, address)
    case 'call implementation proxy':
      return getCallImplementationProxy(provider, address)
  }
}

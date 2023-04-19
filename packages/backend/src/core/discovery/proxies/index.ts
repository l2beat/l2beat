import {
  EthereumAddress,
  ManualProxyType,
  ProxyDetection,
} from '@l2beat/shared'

import { DiscoveryProvider } from '../provider/DiscoveryProvider'
import { detectArbitrumProxy } from './auto/ArbitrumProxy'
import { detectEip897Proxy } from './auto/Eip897Proxy'
import { detectEip1967Proxy } from './auto/Eip1967Proxy'
import { detectEip2535proxy } from './auto/Eip2535Proxy'
import { detectGnosisSafe } from './auto/GnosisSafe'
import { detectResolvedDelegateProxy } from './auto/ResolvedDelegateProxy'
import { detectStarkWareProxy } from './auto/StarkWareProxy'
import { detectZeppelinOSProxy } from './auto/ZeppelinOSProxy'
import { getCallImplementationProxy } from './manual/CallImplementationProxy'
import { getNewArbitrumProxy } from './manual/NewArbitrumProxy'

export async function detectProxy(
  provider: DiscoveryProvider,
  address: EthereumAddress,
  manualProxyType: ManualProxyType | undefined,
): Promise<ProxyDetection | undefined> {
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
    detectEip2535proxy(provider, address),
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

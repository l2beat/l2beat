import { providers } from 'ethers'

import { DiscoveryOptions } from './DiscoveryOptions'
import { ArbitrumProxy } from './proxies/ArbitrumProxy'
import { Eip897Proxy } from './proxies/Eip897Proxy'
import { Eip1967Proxy } from './proxies/Eip1967Proxy'
import { GnosisSafe } from './proxies/GnosisSafe'
import { StarkWareProxy } from './proxies/StarkWareProxy'
import { ProxyDetection } from './proxies/types'

export async function detectProxy(
  provider: providers.Provider,
  address: string,
  options: DiscoveryOptions,
): Promise<ProxyDetection | undefined> {
  const code = await provider.getCode(address)
  if (!code || code === '0x') {
    return
  }
  const checks = await Promise.all([
    // the order is important, because some proxies are extensions of others
    ArbitrumProxy.detect(provider, address, options.blockNumber),
    Eip1967Proxy.detect(provider, address, options.blockNumber),
    StarkWareProxy.detect(provider, address, options.blockNumber),
    GnosisSafe.detect(provider, address, options.blockNumber),
    Eip897Proxy.detect(provider, address, options.blockNumber),
  ])
  return checks.find((x) => x !== undefined)
}

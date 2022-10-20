import { providers } from 'ethers'

import { ArbitrumProxy } from '../common/proxies/ArbitrumProxy'
import { Eip897Proxy } from '../common/proxies/Eip897Proxy'
import { Eip1967Proxy } from '../common/proxies/Eip1967Proxy'
import { GnosisSafe } from '../common/proxies/GnosisSafe'
import { StarkWareProxy } from '../common/proxies/StarkWareProxy'
import { ProxyDetection } from '../common/proxies/types'

export async function detectProxy(
  provider: providers.Provider,
  address: string,
): Promise<ProxyDetection | undefined> {
  const code = await provider.getCode(address)
  if (!code || code === '0x') {
    return
  }
  const checks = await Promise.all([
    // the order is important, because some proxies are extensions of others
    ArbitrumProxy.detect(provider, address),
    Eip1967Proxy.detect(provider, address),
    StarkWareProxy.detect(provider, address),
    GnosisSafe.detect(provider, address),
    Eip897Proxy.detect(provider, address),
  ])
  return checks.find((x) => x !== undefined)
}

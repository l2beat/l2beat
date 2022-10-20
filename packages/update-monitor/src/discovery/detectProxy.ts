import { providers } from 'ethers'

import { Eip1967Proxy } from '../common/proxies/Eip1967Proxy'
import { GnosisSafe } from '../common/proxies/GnosisSafe'
import { StarkWareProxy } from '../common/proxies/StarkWareProxy'
import { ProxyDetection } from '../common/proxies/types'

export async function detectProxy(
  provider: providers.Provider,
  address: string,
): Promise<ProxyDetection | undefined> {
  const checks = await Promise.all([
    Eip1967Proxy.detect(provider, address),
    StarkWareProxy.detect(provider, address),
    GnosisSafe.detect(provider, address),
  ])
  return checks.find((x) => x !== undefined)
}

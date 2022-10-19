import { providers } from 'ethers'

import { Eip1967Proxy } from '../common/proxies/Eip1967Proxy'
import { StarkWare2019Proxy } from '../common/proxies/StarkWare2019Proxy'
import { ProxyDetection } from '../types'

export async function detectProxy(
  provider: providers.Provider,
  address: string,
): Promise<ProxyDetection | undefined> {
  const checks = await Promise.all([
    Eip1967Proxy.detect(provider, address),
    StarkWare2019Proxy.detect(provider, address),
  ])
  return checks.find((x) => x !== undefined)
}

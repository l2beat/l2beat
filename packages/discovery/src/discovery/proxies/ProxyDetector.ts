import { ManualProxyType, ProxyDetails } from '@l2beat/discovery-types'

import { EthereumAddress } from '../../utils/EthereumAddress'
import { DiscoveryLogger } from '../DiscoveryLogger'
import { DiscoveryProvider } from '../provider/DiscoveryProvider'
import { detectArbitrumProxy } from './auto/ArbitrumProxy'
import { detectAxelarProxy as getAxelarProxy } from './auto/AxelarProxy'
import { detectEip897Proxy } from './auto/Eip897Proxy'
import { detectEip1967Proxy } from './auto/Eip1967Proxy'
import { detectEip2535proxy } from './auto/Eip2535Proxy'
import { detectGnosisSafe } from './auto/GnosisSafe'
import { detectGnosisSafeZodiacModule } from './auto/GnosisSafeModule'
import { detectPolygonProxy } from './auto/PolygonProxy'
import { detectResolvedDelegateProxy } from './auto/ResolvedDelegateProxy'
import { detectStarkWareProxy } from './auto/StarkWareProxy'
import { detectZeppelinOSProxy } from './auto/ZeppelinOSProxy'
import { getCallImplementationProxy } from './manual/CallImplementationProxy'
import { getEternalStorageProxy } from './manual/EthernalStorageProxy'
import { getImmutableProxy } from './manual/immutableProxy'
import { getNewArbitrumProxy } from './manual/NewArbitrumProxy'
import { getOpticsBeaconProxy } from './manual/OpticsBeaconProxy'
import { getPolygonExtensionProxy } from './manual/PolygonExtensionProxy'
import { getZkSpaceProxy } from './manual/ZkSpaceProxy'
import { getZkSyncLiteProxy } from './manual/ZkSyncLiteProxy'

export type Detector = (
  provider: DiscoveryProvider,
  address: EthereumAddress,
  blockNumber: number,
) => Promise<ProxyDetails | undefined>

const DEFAULT_AUTO_DETECTORS: Detector[] = [
  // the order is important, because some proxies are extensions of others
  detectResolvedDelegateProxy,
  detectArbitrumProxy,
  detectEip1967Proxy,
  detectPolygonProxy,
  detectStarkWareProxy,
  detectGnosisSafe,
  detectGnosisSafeZodiacModule,
  detectEip897Proxy,
  detectZeppelinOSProxy,
  detectEip2535proxy,
]

const MANUAL_DETECTORS: Record<ManualProxyType, Detector> = {
  'new Arbitrum proxy': getNewArbitrumProxy,
  'call implementation proxy': getCallImplementationProxy,
  'zkSync Lite proxy': getZkSyncLiteProxy,
  'zkSpace proxy': getZkSpaceProxy,
  'Eternal Storage proxy': getEternalStorageProxy,
  'Polygon Extension proxy': getPolygonExtensionProxy,
  'Optics Beacon proxy': getOpticsBeaconProxy,
  'Axelar proxy': getAxelarProxy,
  immutable: getImmutableProxy,
}

export class ProxyDetector {
  constructor(
    private readonly provider: DiscoveryProvider,
    private readonly logger: DiscoveryLogger,
    private readonly autoDetectors = DEFAULT_AUTO_DETECTORS,
    private readonly manualDetectors = MANUAL_DETECTORS,
  ) {}

  async detectProxy(
    address: EthereumAddress,
    blockNumber: number,
    logger: DiscoveryLogger,
    manualProxyType?: ManualProxyType,
  ): Promise<ProxyDetails | undefined> {
    const proxy = manualProxyType
      ? await this.getManualProxy(address, manualProxyType, blockNumber)
      : await this.getAutoProxy(address, blockNumber)

    if (proxy) {
      logger.logProxyDetected(proxy.upgradeability.type)
    } else if (manualProxyType) {
      logger.logProxyDetectionFailed(manualProxyType)
    }

    return proxy
  }

  async getAutoProxy(
    address: EthereumAddress,
    blockNumber: number,
  ): Promise<ProxyDetails | undefined> {
    const checks = await Promise.all(
      this.autoDetectors.map((detect) =>
        detect(this.provider, address, blockNumber),
      ),
    )
    return checks.find((x) => x !== undefined)
  }

  async getManualProxy(
    address: EthereumAddress,
    manualProxyType: ManualProxyType,
    blockNumber: number,
  ): Promise<ProxyDetails | undefined> {
    const detector = this.manualDetectors[manualProxyType]
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (detector) {
      return detector(this.provider, address, blockNumber)
    }
  }
}

import type {
  ContractValue,
  ManualProxyType,
  ProxyDetails,
} from '@l2beat/discovery-types'
import type { EthereumAddress } from '@l2beat/shared-pure'

import type { IProvider } from '../provider/IProvider'
import { detectArbitrumProxy } from './auto/ArbitrumProxy'
import { detectAxelarProxy as getAxelarProxy } from './auto/AxelarProxy'
import { detectBeaconProxy } from './auto/BeaconProxy'
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
import { getLightLinkProxy } from './manual/LightLinkProxy'
import { getNewArbitrumProxy } from './manual/NewArbitrumProxy'
import { getOpticsBeaconProxy } from './manual/OpticsBeaconProxy'
import { getPolygonExtensionProxy } from './manual/PolygonExtensionProxy'
import { getZkSpaceProxy } from './manual/ZkSpaceProxy'
import { getZkSyncLiteProxy } from './manual/ZkSyncLiteProxy'
import { getImmutableProxy } from './manual/immutableProxy'

type Detector = (
  provider: IProvider,
  address: EthereumAddress,
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
  detectBeaconProxy,
]

export const MANUAL_DETECTORS: Record<ManualProxyType, Detector> = {
  'new Arbitrum proxy': getNewArbitrumProxy,
  'call implementation proxy': getCallImplementationProxy,
  'zkSync Lite proxy': getZkSyncLiteProxy,
  'zkSpace proxy': getZkSpaceProxy,
  'Eternal Storage proxy': getEternalStorageProxy,
  'Polygon Extension proxy': getPolygonExtensionProxy,
  'Optics Beacon proxy': getOpticsBeaconProxy,
  'Axelar proxy': getAxelarProxy,
  'LightLink proxy': getLightLinkProxy,
  immutable: getImmutableProxy,
}

export class ProxyDetector {
  constructor(
    private readonly autoDetectors = DEFAULT_AUTO_DETECTORS,
    private readonly manualDetectors = MANUAL_DETECTORS,
  ) {}

  async detectProxy(
    provider: IProvider,
    address: EthereumAddress,
    manualProxyType?: ManualProxyType,
  ): Promise<ProxyDetails | undefined> {
    const proxy = manualProxyType
      ? await this.getManualProxy(provider, address, manualProxyType)
      : await this.getAutoProxy(provider, address)

    if (proxy) {
      adjust$Arrays(proxy.values)
    } else if (manualProxyType) {
      throw new Error(`Manual proxy detection failed: ${manualProxyType}`)
    }

    return proxy
  }

  async getAutoProxy(
    provider: IProvider,
    address: EthereumAddress,
  ): Promise<ProxyDetails | undefined> {
    const checks = await Promise.all(
      this.autoDetectors.map((detect) => detect(provider, address)),
    )
    return checks.find((x) => x !== undefined)
  }

  async getManualProxy(
    provider: IProvider,
    address: EthereumAddress,
    manualProxyType: ManualProxyType,
  ): Promise<ProxyDetails | undefined> {
    const detector = this.manualDetectors[manualProxyType]
    if (detector) {
      return await detector(provider, address)
    }
  }
}

function adjust$Arrays(values: Record<string, ContractValue | undefined>) {
  if (Array.isArray(values.$admin) && values.$admin.length === 1) {
    values.$admin = values.$admin[0]
  }

  if (
    Array.isArray(values.$implementation) &&
    values.$implementation.length === 1
  ) {
    values.$implementation = values.$implementation[0]
  }
}

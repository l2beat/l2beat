import { assert, ChainSpecificAddress } from '@l2beat/shared-pure'
import { codeIsEIP7702, codeIsEOA } from '../analysis/codeIsEOA.js'
import type { ManualProxyType } from '../config/StructureConfig.js'
import type { ContractValue } from '../output/types.js'
import type { ContractDeployment, IProvider } from '../provider/IProvider.js'
import { get$Implementations } from '../utils/extractors.js'
import { detectArbitrumProxy } from './auto/ArbitrumProxy.js'
import { detectAxelarProxy as getAxelarProxy } from './auto/AxelarProxy.js'
import { detectBeaconProxy } from './auto/BeaconProxy.js'
import { detectEip897Proxy } from './auto/Eip897Proxy.js'
import { detectEip1167Proxy } from './auto/Eip1167Proxy.js'
import { detectEip1967Proxy } from './auto/Eip1967Proxy.js'
import { detectEip2535proxy } from './auto/Eip2535Proxy.js'
import { detectGnosisSafe } from './auto/GnosisSafe.js'
import { detectGnosisSafeZodiacModule } from './auto/GnosisSafeModule.js'
import { detectPolygonProxy } from './auto/PolygonProxy.js'
import { detectResolvedDelegateProxy } from './auto/ResolvedDelegateProxy.js'
import { detectStarkWareProxy } from './auto/StarkWareProxy.js'
import { detectZeppelinOSProxy } from './auto/ZeppelinOSProxy.js'
import { getCallImplementationProxy } from './manual/CallImplementationProxy.js'
import { getEternalStorageProxy } from './manual/EthernalStorageProxy.js'
import { getEverclearProxy } from './manual/EverclearProxy.js'
import { getImmutableProxy } from './manual/immutableProxy.js'
import { getLightLinkProxy } from './manual/LightLinkProxy.js'
import { getNewArbitrumProxy } from './manual/NewArbitrumProxy.js'
import { getOpticsBeaconProxy } from './manual/OpticsBeaconProxy.js'
import { getPolygonExtensionProxy } from './manual/PolygonExtensionProxy.js'
import { gatTaikoForkProxy } from './manual/TaikoForkProxy.js'
import { getZkLighterProxy } from './manual/ZkLighterProxy.js'
import { getZkSpaceProxy } from './manual/ZkSpaceProxy.js'
import { getZkSyncLiteProxy } from './manual/ZkSyncLiteProxy.js'
import type { ProxyDetails, ProxyResult } from './types.js'

type Detector = (
  provider: IProvider,
  address: ChainSpecificAddress,
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
  detectEip1167Proxy,
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
  'Everclear proxy': getEverclearProxy,
  'TaikoFork proxy': gatTaikoForkProxy,
  'zkLighter proxy': getZkLighterProxy,
  immutable: getImmutableProxy,
}

export class ProxyDetector {
  constructor(
    private readonly autoDetectors = DEFAULT_AUTO_DETECTORS,
    private readonly manualDetectors = MANUAL_DETECTORS,
  ) {}

  async detectProxy(
    provider: IProvider,
    address: ChainSpecificAddress,
    manualProxyType?: ManualProxyType,
  ): Promise<ProxyResult> {
    const eoaProxy = await this.getEOAProxy(provider, address)

    const proxy = manualProxyType
      ? await this.getManualProxy(provider, address, manualProxyType)
      : (eoaProxy ?? (await this.getAutoProxy(provider, address)))

    return this.processProxyDetails(
      provider,
      address,
      proxy,
      eoaProxy !== undefined,
    )
  }

  async getEOAProxy(
    provider: IProvider,
    address: ChainSpecificAddress,
  ): Promise<ProxyDetails | undefined> {
    const code = await provider.getBytecode(address)
    const isEOA = codeIsEOA(code)
    if (isEOA) {
      if (codeIsEIP7702(code)) {
        const implementation = ChainSpecificAddress.fromLong(
          provider.chain,
          code.slice(3, 23).toString(),
        )

        return {
          type: 'EIP7702 EOA',
          values: {
            $implementation: implementation.toString(),
          },
        }
      }
      return { type: 'EOA', values: {} }
    }
  }

  async getAutoProxy(
    provider: IProvider,
    address: ChainSpecificAddress,
  ): Promise<ProxyDetails | undefined> {
    const checks = await Promise.all(
      this.autoDetectors.map((detect) => detect(provider, address)),
    )

    const result = checks.find((x) => x !== undefined)
    return result
  }

  async getManualProxy(
    provider: IProvider,
    address: ChainSpecificAddress,
    manualProxyType: ManualProxyType,
  ): Promise<ProxyDetails> {
    const detector = this.manualDetectors[manualProxyType]

    const result = await detector(provider, address)
    assert(result !== undefined, 'Manual proxy detection failed')

    return result
  }

  private async processProxyDetails(
    provider: IProvider,
    address: ChainSpecificAddress,
    proxy: ProxyDetails | undefined,
    isEOA: boolean,
  ): Promise<ProxyResult> {
    const workingProxy =
      proxy ?? (await this.getManualProxy(provider, address, 'immutable'))

    const addresses = []
    let deployment: ContractDeployment | undefined
    if (!isEOA) {
      addresses.push(address)
      deployment = await provider.getDeployment(address)
    }
    addresses.push(...get$Implementations(workingProxy.values))

    const result = {
      ...workingProxy,
      addresses,
      deployment,
    }
    adjust$Arrays(result.values)
    return result
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

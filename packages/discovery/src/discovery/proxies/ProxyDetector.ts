import { assert, type Bytes, ChainSpecificAddress } from '@l2beat/shared-pure'
import { codeIsEIP7702, codeIsEOA } from '../analysis/bytecode'
import type { ManualProxyType } from '../config/StructureConfig'
import type { ContractValue } from '../output/types'
import type { ContractDeployment, IProvider } from '../provider/IProvider'
import { get$Implementations } from '../utils/extractors'
import { detectArbitrumProxy } from './auto/ArbitrumProxy'
import { detectAxelarProxy as getAxelarProxy } from './auto/AxelarProxy'
import { detectBeaconProxy } from './auto/BeaconProxy'
import { detectEip897Proxy } from './auto/Eip897Proxy'
import { detectEip1167Proxy } from './auto/Eip1167Proxy'
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
import { getEverclearProxy } from './manual/EverclearProxy'
import { getImmutableProxy } from './manual/immutableProxy'
import { getLightLinkProxy } from './manual/LightLinkProxy'
import { getNewArbitrumProxy } from './manual/NewArbitrumProxy'
import { getOpticsBeaconProxy } from './manual/OpticsBeaconProxy'
import { getPolygonExtensionProxy } from './manual/PolygonExtensionProxy'
import { gatTaikoForkProxy } from './manual/TaikoForkProxy'
import { getZkLighterProxy } from './manual/ZkLighterProxy'
import { getZkSpaceProxy } from './manual/ZkSpaceProxy'
import { getZkSyncLiteProxy } from './manual/ZkSyncLiteProxy'
import type { ProxyDetails, ProxyResult } from './types'

type Detector = (
  provider: IProvider,
  address: ChainSpecificAddress,
) => Promise<ProxyDetails | undefined>

// NOTE(radomski): 95% of all detected proxies are attributed to these five
// detectors. Splitting this into "common" and "rare" we get two things. In 95%
// of cases it's faster because we don't have to wait for others. And also it
// reduces the amount of RPC calls made by around 1.5-2x
//
// Command uses to generate these statistics:
//
// jq '.entries | map(.proxyType) | .[]' src/projects/**/discovered.json | \
// sort | uniq -c | \
// grep -E 'EIP1167|Arbitrum|Beacon|Axelar|Polygon|resolved delegate|gnosis safe|EIP897|EIP2535|ZeppelinOS|EIP1967|StarkWare' | \
// sort -rn | \
// awk '{r[NR]=$0; t+=$1} END{for(i=1;i<=NR;i++){split(r[i],f); c+=f[1]; printf "%6.2f%%  %s\n", 100*c/t, r[i]}}'
//
const COMMON_AUTO_DETECTORS: Detector[] = [
  detectResolvedDelegateProxy,
  detectArbitrumProxy,
  detectEip1967Proxy,
  detectGnosisSafe,
  detectBeaconProxy,
]

const RARE_AUTO_DETECTORS: Detector[] = [
  detectPolygonProxy,
  detectStarkWareProxy,
  detectGnosisSafeZodiacModule,
  detectEip897Proxy,
  detectZeppelinOSProxy,
  detectEip2535proxy,
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
    private readonly commonAutoDetectors = COMMON_AUTO_DETECTORS,
    private readonly rareAutoDetectors = RARE_AUTO_DETECTORS,
    private readonly manualDetectors = MANUAL_DETECTORS,
  ) {}

  async detectProxy(
    provider: IProvider,
    address: ChainSpecificAddress,
    manualProxyType?: ManualProxyType,
  ): Promise<ProxyResult> {
    const code = await provider.getBytecode(address)
    const eoaProxy = this.getEOAProxy(provider, code)

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

  getEOAProxy(provider: IProvider, code: Bytes): ProxyDetails | undefined {
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
    const autos = this.commonAutoDetectors.map((fn) => fn(provider, address))
    const hit = (await Promise.all(autos)).find((x) => x !== undefined)
    if (hit !== undefined) return hit

    const rares = this.rareAutoDetectors.map((fn) => fn(provider, address))
    return (await Promise.all(rares)).find((x) => x !== undefined)
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

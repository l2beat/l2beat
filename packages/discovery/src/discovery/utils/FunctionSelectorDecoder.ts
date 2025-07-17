import { assert, type ChainSpecificAddress } from '@l2beat/shared-pure'
import { utils } from 'ethers'

import type { ContractSource } from '../../utils/IEtherscanClient'
import type { IProvider } from '../provider/IProvider'
import { ProxyDetector } from '../proxies/ProxyDetector'
import { get$Implementations } from './extractors'

export class FunctionSelectorDecoder {
  readonly proxyDetector: ProxyDetector
  readonly knownTargets: Set<ChainSpecificAddress> =
    new Set<ChainSpecificAddress>()
  readonly implementations: Record<string, ChainSpecificAddress[]> = {}
  readonly targetSources: Record<string, ContractSource> = {}

  constructor(readonly provider: IProvider) {
    this.proxyDetector = new ProxyDetector()
  }

  async fetchTargets(targets: ChainSpecificAddress[]): Promise<void> {
    const filtered = targets.filter((t) => !this.knownTargets.has(t))

    const implementations: ChainSpecificAddress[] = []
    await Promise.all(
      [...filtered].map(async (address) => {
        const proxy = await this.proxyDetector.detectProxy(
          this.provider,
          address,
        )

        if (proxy) {
          implementations.push(...get$Implementations(proxy.values))
        }
        this.implementations[address.toString()] = implementations
      }),
    )

    const implementationContracts = new Set<ChainSpecificAddress>(
      implementations,
    )

    const toFetch: ChainSpecificAddress[] = [
      ...filtered,
      ...implementationContracts,
    ]
    await Promise.all(
      toFetch.map(async (address) => {
        this.targetSources[address.toString()] =
          await this.provider.getSource(address)
      }),
    )

    toFetch.forEach((addr) => this.knownTargets.add(addr))
  }

  async decodeSelector(
    target: ChainSpecificAddress,
    selector: string,
  ): Promise<string> {
    if (!this.knownTargets.has(target)) {
      await this.fetchTargets([target])
    }
    assert(this.knownTargets.has(target))

    const metadatas = [
      target,
      ...(this.implementations[target.toString()] ?? []),
    ]
      .map((addr) => this.targetSources[addr.toString()])
      .filter(notUndefined)

    const ifaces = metadatas.map(
      (metadata) => new utils.Interface(metadata.abi),
    )
    const abiSelectors = ifaces.flatMap((iface) =>
      Object.entries(iface.functions).map(([functionName, fragment]) => [
        functionName,
        iface.getSighash(fragment),
      ]),
    )

    const decoded = abiSelectors.find(
      ([_, abiSelector]) => abiSelector === selector,
    )
    if (decoded) {
      assert(decoded[0])
      return decoded[0]
    }

    return selector
  }
}

function notUndefined<T>(value: T | undefined): value is T {
  return value !== undefined
}

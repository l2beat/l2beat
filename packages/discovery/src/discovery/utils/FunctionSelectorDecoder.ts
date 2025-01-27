import { assert, type EthereumAddress } from '@l2beat/shared-pure'
import { utils } from 'ethers'

import { get$Implementations } from '@l2beat/discovery-types'
import type { ContractSource } from '../../utils/IEtherscanClient'
import type { IProvider } from '../provider/IProvider'
import { ProxyDetector } from '../proxies/ProxyDetector'

export class FunctionSelectorDecoder {
  readonly proxyDetector: ProxyDetector
  readonly knownTargets: Set<EthereumAddress> = new Set<EthereumAddress>()
  readonly implementations: Record<string, EthereumAddress[]> = {}
  readonly targetSources: Record<string, ContractSource> = {}

  constructor(readonly provider: IProvider) {
    this.proxyDetector = new ProxyDetector()
  }

  async fetchTargets(targets: EthereumAddress[]): Promise<void> {
    const filtered = targets.filter((t) => !this.knownTargets.has(t))

    const implementations: EthereumAddress[] = []
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

    const implementationContracts = new Set<EthereumAddress>(implementations)

    const toFetch: EthereumAddress[] = [...filtered, ...implementationContracts]
    await Promise.all(
      toFetch.map(async (address) => {
        this.targetSources[address.toString()] =
          await this.provider.getSource(address)
      }),
    )

    toFetch.forEach((addr) => this.knownTargets.add(addr))
  }

  async decodeSelector(
    target: EthereumAddress,
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

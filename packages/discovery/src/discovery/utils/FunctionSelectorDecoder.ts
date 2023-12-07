import { assert } from '@l2beat/backend-tools'
import { utils } from 'ethers'

import { EthereumAddress } from '../../utils/EthereumAddress'
import { DiscoveryLogger } from '../DiscoveryLogger'
import {
  ContractMetadata,
  DiscoveryProvider,
} from '../provider/DiscoveryProvider'
import { ProxyDetector } from '../proxies/ProxyDetector'

export class FunctionSelectorDecoder {
  readonly proxyDetector: ProxyDetector
  readonly knownTargets: Set<EthereumAddress> = new Set<EthereumAddress>()
  readonly implementations: Record<string, EthereumAddress[]> = {}
  readonly targetMetadatas: Record<string, ContractMetadata> = {}

  constructor(
    readonly provider: DiscoveryProvider,
    readonly blockNumber: number,
  ) {
    this.proxyDetector = new ProxyDetector(provider, DiscoveryLogger.SILENT)
  }

  async fetchTargets(targets: EthereumAddress[]): Promise<void> {
    const filtered = targets.filter((t) => !this.knownTargets.has(t))

    const implementations: EthereumAddress[] = []
    await Promise.all(
      [...filtered].map(async (address) => {
        const proxy = await this.proxyDetector.detectProxy(
          address,
          this.blockNumber,
          DiscoveryLogger.SILENT,
        )

        if (proxy) {
          implementations.push(...proxy.implementations)
        }
        this.implementations[address.toString()] = implementations
      }),
    )

    const implementationContracts = new Set<EthereumAddress>(implementations)

    const toFetch: EthereumAddress[] = [...filtered, ...implementationContracts]
    await Promise.all(
      toFetch.map(async (address) => {
        this.targetMetadatas[address.toString()] =
          await this.provider.getMetadata(address)
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
      .map((addr) => this.targetMetadatas[addr.toString()])
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

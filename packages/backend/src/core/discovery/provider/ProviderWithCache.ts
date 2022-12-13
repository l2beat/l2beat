import { EtherscanClient } from '@l2beat/common'
import { Bytes, EthereumAddress, Hash256 } from '@l2beat/types'
import { providers } from 'ethers'

import { isRevert } from '../utils/isRevert'
import { ProviderCache } from './Cache'
import { ContractMetadata, DiscoveryProvider } from './DiscoveryProvider'

const identity = <T>(x: T) => x

export class ProviderWithCache extends DiscoveryProvider {
  private readonly cache: ProviderCache

  constructor(
    provider: providers.Provider,
    etherscanClient: EtherscanClient,
    blockNumber: number,
  ) {
    super(provider, etherscanClient, blockNumber)
    this.cache = new ProviderCache(blockNumber)
  }

  private async cacheOrFetch<R, S>(
    key: string,
    fetch: () => Promise<R>,
    toCache: (value: R) => S,
    fromCache: (value: S) => R,
  ) {
    const known = this.cache.get(key)
    if (known !== undefined) {
      return fromCache(known as S)
    }

    const result = await fetch()
    this.cache.set(key, toCache(result))

    return result
  }

  override async call(address: EthereumAddress, data: Bytes): Promise<Bytes> {
    const result = await this.cacheOrFetch(
      `call.${address.toString()}.${data.toString()}`,
      async () => {
        try {
          return { value: (await super.call(address, data)).toString() }
        } catch (e) {
          if (isRevert(e)) {
            return { error: 'revert' }
          } else {
            throw e
          }
        }
      },
      identity,
      identity,
    )
    if (result.value !== undefined) {
      return Bytes.fromHex(result.value)
    } else {
      throw new Error(result.error)
    }
  }

  override async getStorage(
    address: EthereumAddress,
    slot: number | Bytes,
  ): Promise<Bytes> {
    return this.cacheOrFetch(
      `getStorage.${address.toString()}.${slot.toString()}`,
      () => super.getStorage(address, slot),
      (result) => result.toString(),
      (cached) => Bytes.fromHex(cached),
    )
  }

  override async getLogs(
    address: EthereumAddress,
    topics: string[][],
    fromBlock = 0,
  ): Promise<providers.Log[]> {
    return this.cacheOrFetch(
      `getLogs.${address.toString()}.${JSON.stringify(topics)}.${fromBlock}`,
      () => super.getLogs(address, topics, fromBlock),
      identity,
      identity,
    )
  }

  override async getCode(address: EthereumAddress): Promise<Bytes> {
    return this.cacheOrFetch(
      `getCode.${address.toString()}`,
      () => super.getCode(address),
      (result) => result.toString(),
      (cached) => Bytes.fromHex(cached),
    )
  }

  override async getTransaction(
    hash: Hash256,
  ): Promise<providers.TransactionResponse> {
    return this.cacheOrFetch(
      `getTransaction.${hash.toString()}`,
      () => super.getTransaction(hash),
      identity,
      identity,
    )
  }

  override async getMetadata(
    address: EthereumAddress,
  ): Promise<ContractMetadata> {
    return this.cacheOrFetch(
      `getMetadata.${address.toString()}`,
      () => super.getMetadata(address),
      identity,
      identity,
    )
  }
}

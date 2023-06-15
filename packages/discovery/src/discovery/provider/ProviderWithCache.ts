import { EtherscanClient } from '@l2beat/shared'
import { Bytes, EthereumAddress, Hash256 } from '@l2beat/shared-pure'
import { providers } from 'ethers'

import { isRevert } from '../utils/isRevert'
import { ContractMetadata, DiscoveryProvider } from './DiscoveryProvider'
import { ProviderCache } from './ProviderCache'

const identity = <T>(x: T) => x

export class ProviderWithCache extends DiscoveryProvider {
  private readonly cache: ProviderCache

  constructor(provider: providers.Provider, etherscanClient: EtherscanClient) {
    super(provider, etherscanClient)
    this.cache = new ProviderCache()
  }

  private async cacheOrFetch<R, S>(
    filename: string,
    key: string,
    fetch: () => Promise<R>,
    toCache: (value: R) => S,
    fromCache: (value: S) => R,
  ) {
    const known = this.cache.get(filename, key)
    if (known !== undefined) {
      return fromCache(known as S)
    }

    const result = await fetch()
    this.cache.set(filename, key, toCache(result))

    return result
  }

  override async call(
    address: EthereumAddress,
    data: Bytes,
    blockNumber: number,
  ): Promise<Bytes> {
    const result = await this.cacheOrFetch(
      `blocks/${blockNumber}`,
      `call.${address.toString()}.${data.toString()}`,
      async () => {
        try {
          return {
            value: (await super.call(address, data, blockNumber)).toString(),
          }
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
    blockNumber: number,
  ): Promise<Bytes> {
    return this.cacheOrFetch(
      `blocks/${blockNumber}`,
      `getStorage.${address.toString()}.${slot.toString()}`,
      () => super.getStorage(address, slot, blockNumber),
      (result) => result.toString(),
      (cached) => Bytes.fromHex(cached),
    )
  }

  override async getLogs(
    address: EthereumAddress,
    topics: string[][],
    fromBlock: number,
    blockNumber: number,
  ): Promise<providers.Log[]> {
    return this.cacheOrFetch(
      `blocks/${blockNumber}`,
      `getLogs.${address.toString()}.${JSON.stringify(topics)}.${fromBlock}`,
      () => super.getLogs(address, topics, fromBlock, blockNumber),
      identity,
      identity,
    )
  }

  override async getCode(
    address: EthereumAddress,
    blockNumber: number,
  ): Promise<Bytes> {
    return this.cacheOrFetch(
      `blocks/${blockNumber}`,
      `getCode.${address.toString()}`,
      () => super.getCode(address, blockNumber),
      (result) => result.toString(),
      (cached) => Bytes.fromHex(cached),
    )
  }

  override async getTransaction(
    hash: Hash256,
  ): Promise<providers.TransactionResponse> {
    return this.cacheOrFetch(
      `transactions/${hash.toString()}}`,
      `getTransaction`,
      () => super.getTransaction(hash),
      identity,
      identity,
    )
  }

  override async getMetadata(
    address: EthereumAddress,
  ): Promise<ContractMetadata> {
    return this.cacheOrFetch(
      `addresses/${address.toString()}}`,
      `getMetadata`,
      () => super.getMetadata(address),
      identity,
      identity,
    )
  }
}

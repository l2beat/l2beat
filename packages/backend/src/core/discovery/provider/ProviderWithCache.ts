import {
  Bytes,
  EthereumAddress,
  EtherscanClient,
  Hash256,
} from '@l2beat/shared'
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
    // TODO: remove reliance on this!
    private readonly blockNumber: number,
  ) {
    super(provider, etherscanClient)
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

  override async call(
    address: EthereumAddress,
    data: Bytes,
    blockNumber: number,
  ): Promise<Bytes> {
    if (blockNumber !== this.blockNumber) {
      throw new Error('Unsupported historical block number!')
    }
    const result = await this.cacheOrFetch(
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
    if (blockNumber !== this.blockNumber) {
      throw new Error('Unsupported historical block number!')
    }
    return this.cacheOrFetch(
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
    if (blockNumber !== this.blockNumber) {
      throw new Error('Unsupported historical block number!')
    }
    return this.cacheOrFetch(
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
    if (blockNumber !== this.blockNumber) {
      throw new Error('Unsupported historical block number!')
    }
    return this.cacheOrFetch(
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

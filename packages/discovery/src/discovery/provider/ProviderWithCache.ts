import { createHash } from 'crypto'
import { providers } from 'ethers'

import { Bytes } from '../../utils/Bytes'
import { ChainId } from '../../utils/ChainId'
import { EthereumAddress } from '../../utils/EthereumAddress'
import { EtherscanLikeClient } from '../../utils/EtherscanLikeClient'
import { Hash256 } from '../../utils/Hash256'
import { DiscoveryLogger } from '../DiscoveryLogger'
import { isRevert } from '../utils/isRevert'
import { ContractMetadata, DiscoveryProvider } from './DiscoveryProvider'
import { RateLimitedProvider } from './RateLimitedProvider'

const toJSON = <T>(x: T): string => JSON.stringify(x)
const fromJSON = <T>(x: string): T => JSON.parse(x) as T

export interface DiscoveryCache {
  set(key: string, value: string): Promise<void>
  get(key: string): Promise<string | undefined>
}

export class ProviderWithCache extends DiscoveryProvider {
  constructor(
    provider: providers.Provider | RateLimitedProvider,
    etherscanLikeClient: EtherscanLikeClient,
    logger: DiscoveryLogger,
    private readonly chainId: ChainId,
    private readonly cache: DiscoveryCache,
    getLogsMaxRange?: number,
  ) {
    super(provider, etherscanLikeClient, logger, getLogsMaxRange)
  }

  private async cacheOrFetch<R>(
    key: string,
    fetch: () => Promise<R>,
    toCache: (value: R) => string,
    fromCache: (value: string) => R,
  ): Promise<R> {
    const known = await this.cache.get(key)
    if (known !== undefined) {
      return fromCache(known)
    }

    const result = await fetch()
    await this.cache.set(key, toCache(result))

    return result
  }

  buildKey(invocation: string, params: { toString: () => string }[]): string {
    const result = [
      this.chainId.toString(),
      invocation,
      ...params.map((p) => p.toString()),
    ]
    return result.join('.')
  }

  override async call(
    address: EthereumAddress,
    data: Bytes,
    blockNumber: number,
  ): Promise<Bytes> {
    const key = this.buildKey('call', [blockNumber, address, data])
    const result = await this.cacheOrFetch(
      key,
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
      toJSON,
      fromJSON,
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
    const key = this.buildKey('getStorage', [blockNumber, address, slot])
    return this.cacheOrFetch(
      key,
      () => super.getStorage(address, slot, blockNumber),
      (result) => result.toString(),
      (cached) => Bytes.fromHex(cached),
    )
  }

  override async getLogsBatch(
    address: EthereumAddress,
    topics: string[][],
    fromBlock: number,
    toBlock: number,
  ): Promise<providers.Log[]> {
    const topicsHash: string = createHash('sha256')
      .update(JSON.stringify(topics))
      .digest('hex')

    const key = this.buildKey('getLogsBatch', [
      address,
      fromBlock,
      toBlock,
      topicsHash,
    ])
    return this.cacheOrFetch(
      key,
      () => super.getLogsBatch(address, topics, fromBlock, toBlock),
      toJSON,
      fromJSON,
    )
  }

  override async getCode(
    address: EthereumAddress,
    blockNumber: number,
  ): Promise<Bytes> {
    // Ignoring blockNumber here, assuming that code will not change
    const key = this.buildKey('getCode', [address])
    return this.cacheOrFetch(
      key,
      () => super.getCode(address, blockNumber),
      (result) => result.toString(),
      (cached) => Bytes.fromHex(cached),
    )
  }

  override async getTransaction(
    hash: Hash256,
  ): Promise<providers.TransactionResponse> {
    const key = this.buildKey('getTransaction', [hash])
    return this.cacheOrFetch(
      key,
      () => super.getTransaction(hash),
      toJSON,
      fromJSON,
    )
  }

  override async getBlock(blockNumber: number): Promise<providers.Block> {
    const key = this.buildKey('getBlock', [blockNumber])
    return this.cacheOrFetch(
      key,
      () => super.getBlock(blockNumber),
      toJSON,
      fromJSON,
    )
  }

  override async getMetadata(
    address: EthereumAddress,
  ): Promise<ContractMetadata> {
    const key = this.buildKey('getMetadata', [address])
    return this.cacheOrFetch(
      key,
      () => super.getMetadata(address),
      toJSON,
      fromJSON,
    )
  }

  override async getContractDeploymentTx(
    address: EthereumAddress,
  ): Promise<Hash256 | undefined> {
    const key = this.buildKey('getContractDeploymentTx', [address])

    // Special cache handling is necessary because
    // we support cases where getContractDeploymentTx API
    // is not available.
    const cached = await this.cache.get(key)
    if (cached !== undefined) {
      return fromJSON(cached)
    }

    const result = await super.getContractDeploymentTx(address)
    // Don't cache "undefined"
    if (result !== undefined) {
      await this.cache.set(key, toJSON(result))
    }
    return result
  }
}

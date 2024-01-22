import { assert } from '@l2beat/backend-tools'
import { createHash } from 'crypto'
import { providers } from 'ethers'

import { Bytes } from '../../utils/Bytes'
import { EthereumAddress } from '../../utils/EthereumAddress'
import { EtherscanLikeClient } from '../../utils/EtherscanLikeClient'
import { Hash256 } from '../../utils/Hash256'
import { DiscoveryLogger } from '../DiscoveryLogger'
import { isRevert } from '../utils/isRevert'
import { ContractMetadata, DiscoveryProvider } from './DiscoveryProvider'
import { RateLimitedProvider } from './RateLimitedProvider'
import { TraceTransactionResponse } from './TransactionTrace'

const toJSON = <T>(x: T): string => JSON.stringify(x)
const fromJSON = <T>(x: string): T => JSON.parse(x) as T

export interface DiscoveryCache {
  set(
    key: string,
    value: string,
    chain: string,
    blockNumber: number,
  ): Promise<void>
  get(key: string): Promise<string | undefined>
}

// If reorgSafeDepth is provided, we need to refresh
// current block number from time to time to calculate
// which block numbers are safe to cache.
const CUR_BLOCK_CHECK_INTERVAL_SECONDS = 60

export class ProviderWithCache extends DiscoveryProvider {
  private curBlockNumber?: number
  private lastCurBlockCheckTime?: number

  constructor(
    provider: providers.JsonRpcProvider | RateLimitedProvider,
    etherscanLikeClient: EtherscanLikeClient,
    logger: DiscoveryLogger,
    private readonly chain: string,
    private readonly cache: DiscoveryCache,
    getLogsMaxRange?: number,
    readonly reorgSafeDepth?: number,
  ) {
    super(provider, etherscanLikeClient, logger, getLogsMaxRange)
  }

  public async cacheOrFetch<R>(
    key: string,
    blockNumber: number,
    fetch: () => Promise<R>,
    toCache: (value: R) => string,
    fromCache: (value: string) => R,
  ): Promise<R> {
    const known = await this.cache.get(key)
    if (known !== undefined) {
      return fromCache(known)
    }

    const result = await fetch()

    const isReorgSafe = await this.isBlockNumberReorgSafe(blockNumber)

    if (isReorgSafe) {
      await this.cache.set(key, toCache(result), this.chain, blockNumber)
    }

    return result
  }

  public async isBlockNumberReorgSafe(
    blockNumber: number | undefined,
    curTimeMsOverride?: number, // for testing
  ): Promise<boolean> {
    if (blockNumber === undefined) {
      return true
    }

    if (this.reorgSafeDepth === undefined) {
      return true
    }

    const curTime = curTimeMsOverride ?? Date.now()
    const timeSinceLastCurBlockCheck =
      curTime - (this.lastCurBlockCheckTime ?? 0)

    if (
      this.curBlockNumber === undefined ||
      timeSinceLastCurBlockCheck >= CUR_BLOCK_CHECK_INTERVAL_SECONDS * 1000
    ) {
      this.curBlockNumber = await super.getBlockNumber()
      this.lastCurBlockCheckTime = curTime
    }

    const reorgSafeBlockNumber = this.curBlockNumber - this.reorgSafeDepth
    return blockNumber <= reorgSafeBlockNumber
  }

  buildKey(invocation: string, params: { toString: () => string }[]): string {
    const result = [this.chain, invocation, ...params.map((p) => p.toString())]
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
      blockNumber,
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
      blockNumber,
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

    /**
     * Passing `toBlock` as a point-in-time reference, so that whenever you are up to the invalidation
     * you will include whole range of blocks.
     *
     * @example
     *
     * ```ts
     * const invalidateAfterBlock = 1000
     *
     * const fromBlock = 500
     * const toBlock = 1500
     *
     * await invalidateAfter(invalidateAfterBlock) // catches 1500 and thus whole range
     * ```
     */
    return this.cacheOrFetch(
      key,
      toBlock,
      () => super.getLogsBatch(address, topics, fromBlock, toBlock),
      toJSON,
      fromJSON,
    )
  }

  override async getCode(
    address: EthereumAddress,
    blockNumber: number,
  ): Promise<Bytes> {
    // Contract code can change at any moment, so we cache *with blockNumber*
    // see: https://medium.com/coinmonks/dark-side-of-create2-opcode-6b6838a42d71
    // Another problem is running discovery on a very old block number
    // when some contract has not been deployed yet:
    // getCode() would return previously cached value instead of empty code.

    const key = this.buildKey('getCode', [blockNumber, address])

    return this.cacheOrFetch(
      key,
      blockNumber,
      () => super.getCode(address, blockNumber),
      (result) => result.toString(),
      (cached) => Bytes.fromHex(cached),
    )
  }

  override async getTransaction(
    hash: Hash256,
  ): Promise<providers.TransactionResponse> {
    const key = this.buildKey('getTransaction', [hash])

    const cachedResult = await this.cache.get(key)

    if (cachedResult !== undefined) {
      return fromJSON(cachedResult)
    }

    const result = await super.getTransaction(hash)

    // We don't want to cache nor return non-mined transactions
    assert(result.blockNumber, 'Transaction not mined')

    await this.cache.set(key, toJSON(result), this.chain, result.blockNumber)

    return result
  }

  override async getBlock(blockNumber: number): Promise<providers.Block> {
    const key = this.buildKey('getBlock', [blockNumber])

    return this.cacheOrFetch(
      key,
      blockNumber,
      () => super.getBlock(blockNumber),
      toJSON,
      fromJSON,
    )
  }

  override async getMetadata(
    address: EthereumAddress,
  ): Promise<ContractMetadata> {
    const key = this.buildKey('getMetadata', [address])

    const cachedResult = await this.cache.get(key)

    if (cachedResult !== undefined) {
      return fromJSON(cachedResult)
    }

    const result = await super.getMetadata(address)

    // Cache only present & verified contracts to prevent cache poisoning
    if (result.isVerified && result.source.length > 0) {
      const currentBlock = await super.getBlockNumber()

      await this.cache.set(key, toJSON(result), this.chain, currentBlock)
    }

    return result
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
      const currentBlock = await super.getBlockNumber()

      await this.cache.set(key, toJSON(result), this.chain, currentBlock)
    }
    return result
  }

  override async getTransactionTrace(
    transactionHash: Hash256,
  ): Promise<TraceTransactionResponse> {
    const key = this.buildKey('getTransactionTrace', [transactionHash])

    const cachedResult = await this.cache.get(key)

    if (cachedResult !== undefined) {
      return TraceTransactionResponse.parse(JSON.parse(cachedResult))
    }

    const result = await super.getTransactionTrace(transactionHash)

    const blockNumber = result[0]?.blockNumber

    if (blockNumber !== undefined) {
      await this.cache.set(key, toJSON(result), this.chain, blockNumber)
    }

    return result
  }
}

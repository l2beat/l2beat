import type { CacheEntry, DiscoveryCache } from './DiscoveryCache'

export interface BlockNumberProvider {
  getBlockNumber(): Promise<number>
}

// If reorgSafeDepth is provided, we need to refresh
// current block number from time to time to calculate
// which block numbers are safe to cache.
const CHECK_INTERVAL_MS = 60_000

export class ReorgAwareCache {
  private latestBlockNumber?: number
  private lastCheckTime?: number

  constructor(
    private cache: DiscoveryCache,
    private provider: BlockNumberProvider,
    private chain: string,
    private reorgSafeDepth?: number,
  ) {}

  private buildKey(
    invocation: string,
    params: { toString: () => string }[],
  ): string {
    const result = [this.chain, invocation, ...params.map((p) => p.toString())]
    return result.join('.')
  }

  async entry(
    invocation: string,
    params: { toString: () => string }[],
    blockNumber: number | undefined,
  ): Promise<CacheEntry> {
    const key = this.buildKey(invocation, params)
    const value = await this.cache.get(key)

    return {
      read: () => value,
      write: (value: string) =>
        void this.writeEntry(key, value, blockNumber ?? -1),
    }
  }

  write(
    invocation: string,
    params: { toString: () => string }[],
    blockNumber: number | undefined,
    value: string,
  ) {
    const key = this.buildKey(invocation, params)
    void this.writeEntry(key, value, blockNumber ?? -1)
  }

  private async writeEntry(key: string, value: string, blockNumber: number) {
    const isReorgSafe = await this.isBlockNumberReorgSafe(blockNumber)
    if (isReorgSafe) {
      await this.cache.set(key, value)
    }
  }

  private async isBlockNumberReorgSafe(
    blockNumber: number | undefined,
    currentTime?: number, // for testing
  ): Promise<boolean> {
    if (
      blockNumber === undefined ||
      this.reorgSafeDepth === undefined ||
      (this.latestBlockNumber !== undefined &&
        blockNumber <= this.latestBlockNumber - this.reorgSafeDepth)
    ) {
      return true
    }

    const now = currentTime ?? Date.now()
    const timeElapsed = now - (this.lastCheckTime ?? 0)

    if (
      this.latestBlockNumber === undefined ||
      timeElapsed >= CHECK_INTERVAL_MS
    ) {
      this.latestBlockNumber = await this.provider.getBlockNumber()
      this.lastCheckTime = now
    }

    return blockNumber <= this.latestBlockNumber - this.reorgSafeDepth
  }
}

export interface DiscoveryCache {
  set(
    key: string,
    value: string,
    chain: string,
    blockNumber: number,
  ): Promise<void>
  get(key: string): Promise<string | undefined>
}

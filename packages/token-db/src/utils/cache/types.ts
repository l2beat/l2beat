export interface Cache {
  set(
    key: string,
    value: string,
    chain: number,
    blockNumber?: number,
  ): Promise<void>
  get(key: string): Promise<string | undefined>
}

type SliceHeights = Map<string, number>
type SliceData = Map<number, number>

export class ABC_Repository {
  private readonly sliceHeights = new Map<string, number>()
  private readonly slicesData = new Map<string, Map<number, number>>()
  private safeHeight = 0

  getSliceHeights(): Promise<SliceHeights> {
    return Promise.resolve(this.sliceHeights)
  }
  getSliceData(hash: string): Promise<SliceData> {
    const sliceData = this.slicesData.get(hash) ?? new Map<number, number>()
    return Promise.resolve(sliceData)
  }
  async removeSlices(hashes: string[]): Promise<void> {
    await Promise.resolve()
    for (const hash of hashes) {
      this.sliceHeights.delete(hash)
      this.slicesData.delete(hash)
    }
  }
  async setSliceHeight(hash: string, height: number): Promise<void> {
    await Promise.resolve()
    this.sliceHeights.set(hash, height)
  }
  async setSliceData(hash: string, data: Map<number, number>): Promise<void> {
    await Promise.resolve()
    this.slicesData.set(hash, data)
  }
  getSafeHeight(): Promise<number> {
    return Promise.resolve(this.safeHeight)
  }
  async setSafeHeight(height: number): Promise<void> {
    await Promise.resolve()
    this.safeHeight = height
  }

  getTokenBalance(token: string, blockNumber: number): Promise<number> {
    const balance = this.slicesData.get(token)?.get(blockNumber)
    if (balance === undefined) {
      throw new Error(`No balance of ${token} for ${blockNumber}`)
    }
    return Promise.resolve(balance)
  }
}

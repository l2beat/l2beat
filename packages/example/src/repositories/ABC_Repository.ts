export class ABC_Repository {
  private sliceHeights = new Map<string, number>()
  private sliceData = new Map<string, Map<number, number>>()
  private safeHeight = 0

  async getSliceHeights() {
    return Promise.resolve(this.sliceHeights)
  }
  async getSliceData(hash: string) {
    const sliceData = this.sliceData.get(hash) ?? new Map<number, number>()
    return Promise.resolve(sliceData)
  }
  async removeSlices(hashes: string[]) {
    Promise.resolve()
    for (const hash of hashes) {
      this.sliceHeights.delete(hash)
      this.sliceData.delete(hash)
    }
  }
  async setSliceHeight(hash: string, height: number) {
    Promise.resolve()
    this.sliceHeights.set(hash, height)
  }
  async setSliceData(hash: string, data: Map<number, number>) {
    Promise.resolve()
    this.sliceData.set(hash, data)
  }
  async getSafeHeight() {
    return Promise.resolve(this.safeHeight)
  }
  async setSafeHeight(height: number) {
    Promise.resolve()
    this.safeHeight = height
  }

  async getTokenBalance(token: string, blockNumber: number) {
    const balance = this.sliceData.get(token)?.get(blockNumber)
    if (balance === undefined) {
      throw new Error(`No balance of ${token} for ${blockNumber}`)
    }
    return Promise.resolve(balance)
  }
}

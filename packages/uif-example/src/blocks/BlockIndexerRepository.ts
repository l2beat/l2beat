export class BlockIndexerRepository {
  private height: number | undefined

  async loadHeight(): Promise<number | undefined> {
    return await Promise.resolve(this.height)
  }

  async saveHeight(height: number): Promise<void> {
    this.height = height
    return await Promise.resolve()
  }
}

export class BlockIndexerRepository {
  private height: number | undefined

  async loadHeight(): Promise<number | undefined> {
    return Promise.resolve(this.height)
  }

  async saveHeight(height: number): Promise<void> {
    this.height = height
    return Promise.resolve()
  }
}

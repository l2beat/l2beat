export class BlockIndexerRepository {
  private height: number | undefined

  async loadHeight(): Promise<number | undefined> {
    return await Promise.resolve(this.height)
  }

  async saveHeight(height: number): Promise<void> {
    this.height = height
    return await Promise.resolve()
  }

  async upsert(record: {
    indexerId: string
    height: number
    configHash?: string
  }): Promise<void> {
    this.height = record.height
    return await Promise.resolve()
  }
}

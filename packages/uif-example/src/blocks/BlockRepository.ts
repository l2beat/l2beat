export class BlockRepository {
  private readonly blocks = new Map<number, number>()

  async save(block: { number: number; timestamp: number }): Promise<void> {
    this.blocks.set(block.timestamp, block.number)
    return Promise.resolve()
  }
}

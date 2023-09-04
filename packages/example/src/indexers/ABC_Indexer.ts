import { Logger } from '@l2beat/backend-tools'
import { SliceIndexer, SliceState, SliceUpdate } from '@l2beat/uif'
import { ABC_Repository } from '../repositories/ABC_Repository'
import { BlockNumberIndexer } from './BlockNumberIndexer'

export class ABC_Indexer extends SliceIndexer {
  constructor(
    logger: Logger,
    blockNumberIndexer: BlockNumberIndexer,
    private abc_repository: ABC_Repository,
    private tokens = ['A', 'B', 'C'],
  ) {
    super(logger, [blockNumberIndexer])
  }

  override getExpectedSlices(): string[] {
    return this.tokens
  }

  override async getSliceStates(): Promise<SliceState[]> {
    const tokenHeights = await this.abc_repository.getSliceHeights()
    const states = [...tokenHeights.entries()].map(
      ([token, height]): SliceState => ({
        sliceHash: token,
        height,
      }),
    )
    return states
  }

  override async removeSlices(hashes: string[]): Promise<void> {
    return await this.abc_repository.removeSlices(hashes)
  }

  override async updateSlices(updates: SliceUpdate[]): Promise<number> {
    let minHeight = Infinity
    for (const update of updates) {
      const balances = await this.abc_repository.getSliceData(update.sliceHash)

      for (let i = update.from; i <= update.to; i++) {
        balances.set(i, i * 2)
      }
      if (update.to < minHeight) {
        minHeight = update.to
      }

      await this.abc_repository.setSliceData(update.sliceHash, balances)
      await this.abc_repository.setSliceHeight(update.sliceHash, update.to)
    }
    return minHeight
  }

  override async getMainSafeHeight(): Promise<number> {
    return await this.abc_repository.getSafeHeight()
  }

  override async setMainSafeHeight(height: number): Promise<void> {
    await this.abc_repository.setSafeHeight(height)
  }

  override invalidate(targetHeight: number): Promise<number> {
    return Promise.resolve(targetHeight)
  }
}

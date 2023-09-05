import { Logger } from '@l2beat/backend-tools'
import { SliceIndexer, SliceState, SliceUpdate } from '@l2beat/uif'

import { AB_BC_Repository } from '../repositories/AB_BC_Repository'
import { ABC_Repository } from '../repositories/ABC_Repository'
import { ABC_Indexer } from './ABC_Indexer'

export class AB_BC_Indexer extends SliceIndexer {
  private readonly slices = new Map<string, string[]>()

  constructor(
    logger: Logger,
    abc_indexer: ABC_Indexer,
    private readonly ab_bc_repository: AB_BC_Repository,
    private readonly abc_repository: ABC_Repository,
    private readonly sums = [
      ['A', 'B'],
      ['B', 'C'],
    ],
  ) {
    super(logger, [abc_indexer])
    this.slices = new Map<string, string[]>(
      this.sums.map((sum) => [sum.join('+'), sum]),
    )
  }

  override getExpectedSlices(): string[] {
    return [...this.slices.keys()]
  }

  override async getSliceStates(): Promise<SliceState[]> {
    const sliceHeights = await this.ab_bc_repository.getSliceHeights()
    const states = [...sliceHeights.entries()].map(
      ([sliceHash, height]): SliceState => ({ sliceHash, height }),
    )
    return Promise.resolve(states)
  }

  override async removeSlices(hashes: string[]): Promise<void> {
    await this.ab_bc_repository.removeSlices(hashes)
  }

  override async updateSlices(updates: SliceUpdate[]): Promise<number> {
    let minHeight = Infinity
    for (const update of updates) {
      const sumMap = await this.ab_bc_repository.getSliceData(update.sliceHash)

      for (let i = update.from; i <= update.to; i++) {
        const tokens = this.slices.get(update.sliceHash) ?? []
        const values = await Promise.all(
          tokens.map((token) => this.abc_repository.getTokenBalance(token, i)),
        )
        sumMap.set(
          i,
          values.reduce((a, b) => a + b, 0),
        )
      }
      if (update.to < minHeight) {
        minHeight = update.to
      }

      await this.ab_bc_repository.setSliceData(update.sliceHash, sumMap)
      await this.ab_bc_repository.setSliceHeight(update.sliceHash, update.to)
    }
    return Promise.resolve(minHeight)
  }

  override async getMainSafeHeight(): Promise<number> {
    return await this.ab_bc_repository.getSafeHeight()
  }

  override async setMainSafeHeight(height: number): Promise<void> {
    await this.ab_bc_repository.setSafeHeight(height)
  }

  override async invalidate(targetHeight: number): Promise<number> {
    return Promise.resolve(targetHeight)
  }
}

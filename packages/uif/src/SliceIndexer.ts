import { ChildIndexer } from './BaseIndexer'

export type SliceHash = string

export interface SliceState {
  sliceHash: SliceHash
  height: number
}

export interface SliceUpdate {
  sliceHash: SliceHash
  from: number
  to: number
}

export abstract class SliceIndexer extends ChildIndexer {
  override async update(from: number, to: number): Promise<number> {
    const sliceStates = await this.getSliceStates()
    const { toUpdate, toRemove } = diffSlices(
      this.getExpectedSlices(),
      sliceStates,
      from,
      to,
    )

    this.logger.info('Update', {
      amountToUpdate: toUpdate.length,
      amountToRemove: toRemove.length,
    })

    if (toRemove.length > 0) {
      this.logger.debug('Removing slices', { toRemove })
      await this.removeSlices(toRemove)
      this.logger.debug('Removed slices')
    }

    if (toUpdate.length > 0) {
      this.logger.debug('Updating slices', { toUpdate })
      const newHeight = await this.updateSlices(toUpdate)
      this.logger.debug('Updated slices', { newHeight })
      return newHeight
    }

    return to
  }

  override async getSafeHeight(): Promise<number> {
    const sliceStates = await this.getSliceStates()
    const mainSafeHeight = await this.getMainSafeHeight()
    return Math.min(...sliceStates.map((s) => s.height), mainSafeHeight)
  }

  override async setSafeHeight(height: number): Promise<void> {
    await this.setMainSafeHeight(height)
  }

  /**
   * @returns Height of the indexer. Should be saved in persistent storage.
   */
  abstract getMainSafeHeight(): Promise<number>

  /**
   * @param height Height of the indexer. Should be saved in persistent storage.
   */
  abstract setMainSafeHeight(height: number): Promise<void>

  /**
   * @returns Slices derived from config
   */
  abstract getExpectedSlices(): SliceHash[]

  /**
   * @returns State for Slices stored in the database
   */
  abstract getSliceStates(): Promise<SliceState[]>

  /**
   * @param hashes Slices that are no longer part of config
   */
  abstract removeSlices(hashes: SliceHash[]): Promise<void>

  /**
   *
   * @param slices Slices that are part of config and need to be updated
   * @returns Minimum of the heights of updated slices
   */
  abstract updateSlices(slices: SliceUpdate[]): Promise<number>
}

/**
 * slices toRemove are slices that are no longer part of config
 */
export function diffSlices(
  expectedSlices: SliceHash[],
  actualSlices: SliceState[],
  from: number,
  to: number,
): { toUpdate: SliceUpdate[]; toRemove: SliceHash[] } {
  const toUpdate: SliceUpdate[] = []
  const toRemove: SliceHash[] = []

  for (const slice of actualSlices) {
    if (!expectedSlices.includes(slice.sliceHash)) {
      toRemove.push(slice.sliceHash)
    } else if (slice.height < to) {
      toUpdate.push({
        sliceHash: slice.sliceHash,
        from: Math.max(slice.height, from),
        to: to,
      })
    }
  }

  for (const slice of expectedSlices) {
    if (!actualSlices.find((s) => s.sliceHash === slice)) {
      toUpdate.push({ sliceHash: slice, from: from, to: to })
    }
  }

  return { toUpdate, toRemove }
}

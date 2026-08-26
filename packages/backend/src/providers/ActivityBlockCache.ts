import { UnixTime } from '@l2beat/shared-pure'
import type { ActivityBlock } from '../modules/activity/services/txs/types'

const DEFAULT_CAPACITY = 100_000

interface Slots {
  numbers: Float64Array
  timestamps: Float64Array
  txsCounts: Int32Array
  uopsCounts: Int32Array
}

/**
 * Summaries of the newest blocks of a chain, stored in typed arrays so that
 * the default capacity costs ~2.4 MB. A block lives in the slot
 * `number % capacity`; a newer block landing in the same slot evicts it.
 */
export class ActivityBlockCache {
  private slots: Slots | undefined

  constructor(private readonly capacity = DEFAULT_CAPACITY) {}

  set(block: ActivityBlock) {
    this.slots ??= {
      numbers: new Float64Array(this.capacity).fill(-1),
      timestamps: new Float64Array(this.capacity),
      txsCounts: new Int32Array(this.capacity),
      uopsCounts: new Int32Array(this.capacity),
    }

    const slot = block.number % this.capacity
    this.slots.numbers[slot] = block.number
    this.slots.timestamps[slot] = block.timestamp
    this.slots.txsCounts[slot] = block.txsCount
    this.slots.uopsCounts[slot] = block.uopsCount ?? -1
  }

  get(number: number): ActivityBlock | undefined {
    const slot = number % this.capacity
    if (!this.slots || this.slots.numbers[slot] !== number) return undefined

    const uopsCount = this.slots.uopsCounts[slot]
    return {
      number,
      timestamp: UnixTime(this.slots.timestamps[slot]),
      txsCount: this.slots.txsCounts[slot],
      uopsCount: uopsCount === -1 ? null : uopsCount,
    }
  }
}

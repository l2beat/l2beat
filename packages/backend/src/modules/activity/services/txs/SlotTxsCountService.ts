import type { Logger } from '@l2beat/backend-tools'
import type { ActivityRecord } from '@l2beat/database'
import type { SvmBlockProvider } from '@l2beat/shared'
import { type ProjectId, UnixTime } from '@l2beat/shared-pure'
import { range } from 'lodash'
import { aggregatePerDay } from '../../utils/aggregatePerDay'

interface Dependencies {
  provider: SvmBlockProvider
  projectId: ProjectId
  logger: Logger
}

export class SlotTxsCountService {
  constructor(private readonly $: Dependencies) { }

  async getTxsCount(from: number, to: number): Promise<ActivityRecord[]> {
    const queries = range(from, to + 1).map(async (slot) => {
      const block = await this.$.provider.getBlockWithTransactions(slot)

      if (!block) {
        return undefined
      }

      return {
        txsCount: block.transactionsCount,
        uopsCount: block.transactionsCount,
        timestamp: UnixTime(block.timestamp),
        number: block.number,
      }
    })

    const blocksInSlots = await Promise.all(queries)
    const blocks = blocksInSlots.filter((x) => x !== undefined)

    return aggregatePerDay(this.$.projectId, blocks)
  }
}

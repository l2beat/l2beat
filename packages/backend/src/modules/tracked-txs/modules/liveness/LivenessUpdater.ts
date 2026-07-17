import type { Logger } from '@l2beat/backend-tools'
import type { Database, LivenessRecord } from '@l2beat/database'
import type { TrackedTxId } from '@l2beat/shared'
import type { UnixTime } from '@l2beat/shared-pure'
import type { TrackedTxLivenessResult } from '../../types/model'
import type { TxUpdaterInterface } from '../../types/TxUpdaterInterface'

export class LivenessUpdater implements TxUpdaterInterface<'liveness'> {
  type = 'liveness' as const

  constructor(
    private readonly db: Database,
    private readonly logger: Logger,
  ) {
    this.logger = this.logger.for(this)
  }

  async update(transactions: TrackedTxLivenessResult[]) {
    if (transactions.length === 0) {
      this.logger.info('Update skipped - no transactions to process')
      return
    }

    const transformedTransactions = this.transformTransactions(transactions)
    const eventCount = await this.db.liveness.insertMany(
      transformedTransactions,
    )
    this.logger.info('Updated liveness', {
      transactionCount: transactions.length,
      eventCount,
    })
  }

  async deleteFromById(id: TrackedTxId, fromInclusive: UnixTime) {
    await this.db.liveness.deleteFromById(id, fromInclusive)
  }

  transformTransactions(
    transactions: TrackedTxLivenessResult[],
  ): LivenessRecord[] {
    return transactions.map(toLivenessRecord)
  }
}

function toLivenessRecord(
  transaction: TrackedTxLivenessResult,
): LivenessRecord {
  return {
    timestamp: transaction.blockTimestamp,
    blockNumber: transaction.blockNumber,
    configurationId: transaction.id,
    txHash: transaction.hash,
    eventId: transaction.eventId,
  }
}

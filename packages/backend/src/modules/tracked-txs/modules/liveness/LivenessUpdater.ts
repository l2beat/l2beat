import type { Logger } from '@l2beat/backend-tools'
import type { Database, LivenessRecord } from '@l2beat/database'
import type { TrackedTxId } from '@l2beat/shared'
import type { UnixTime } from '@l2beat/shared-pure'
import type { TrackedTxResult } from '../../types/model'
import type { TxUpdaterInterface } from '../../types/TxUpdaterInterface'

export class LivenessUpdater implements TxUpdaterInterface<'liveness'> {
  type = 'liveness' as const

  constructor(
    private readonly db: Database,
    private readonly logger: Logger,
  ) {
    this.logger = this.logger.for(this)
  }

  async update(transactions: TrackedTxResult[]) {
    if (transactions.length === 0) {
      this.logger.info('Update skipped - no transactions to process')
      return
    }

    const transformedTransactions = this.transformTransactions(transactions)
    const deduplicated = transactions.length - transformedTransactions.length
    if (deduplicated > 0) {
      this.logger.info('Deduplicated liveness transactions', {
        count: deduplicated,
      })
    }
    await this.db.liveness.insertMany(transformedTransactions)
    this.logger.info('Updated liveness', {
      count: transformedTransactions.length,
    })
  }

  async deleteFromById(id: TrackedTxId, fromInclusive: UnixTime) {
    await this.db.liveness.deleteFromById(id, fromInclusive)
  }

  transformTransactions(transactions: TrackedTxResult[]): LivenessRecord[] {
    const records = new Map<string, LivenessRecord>()

    for (const transaction of transactions) {
      const record: LivenessRecord = {
        timestamp: transaction.blockTimestamp,
        blockNumber: transaction.blockNumber,
        configurationId: transaction.id,
        txHash: transaction.hash,
      }

      if (
        transaction.formula === 'functionCall' &&
        transaction.type === 'liveness' &&
        transaction.groupingKey !== undefined
      ) {
        record.groupingKey = transaction.groupingKey
      }

      const key = `${record.configurationId}-${record.txHash}-${record.groupingKey ?? ''}`
      if (!records.has(key)) {
        records.set(key, record)
      }
    }

    return [...records.values()]
  }
}

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
    await this.db.liveness.insertMany(transformedTransactions)
    this.logger.info('Updated liveness', {
      transactionCount: transactions.length,
      livenessRecordCount: transformedTransactions.length,
    })
  }

  async deleteFromById(id: TrackedTxId, fromInclusive: UnixTime) {
    await this.db.liveness.deleteFromById(id, fromInclusive)
  }

  transformTransactions(transactions: TrackedTxResult[]): LivenessRecord[] {
    return keepEarliestEvent(transactions.map(toLivenessRecord))
  }
}

function toLivenessRecord(transaction: TrackedTxResult): LivenessRecord {
  return {
    timestamp: transaction.blockTimestamp,
    blockNumber: transaction.blockNumber,
    configurationId: transaction.id,
    txHash: transaction.hash,
    eventId: transaction.eventId,
  }
}

function keepEarliestEvent(records: LivenessRecord[]): LivenessRecord[] {
  const earliest = new Map<string, LivenessRecord>()

  for (const record of records) {
    const key = JSON.stringify([record.configurationId, record.eventId])
    const current = earliest.get(key)

    if (current === undefined || isEarlier(record, current)) {
      earliest.set(key, record)
    }
  }

  return [...earliest.values()]
}

function isEarlier(a: LivenessRecord, b: LivenessRecord): boolean {
  return (
    a.timestamp < b.timestamp ||
    (a.timestamp === b.timestamp && a.blockNumber < b.blockNumber)
  )
}

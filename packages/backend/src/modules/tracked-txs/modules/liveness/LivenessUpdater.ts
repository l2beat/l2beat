import type { Logger } from '@l2beat/backend-tools'
import type { Database, LivenessRecord } from '@l2beat/database'
import type { TrackedTxId } from '@l2beat/shared'
import type { TrackedTxsConfigType, UnixTime } from '@l2beat/shared-pure'
import type { TrackedTxResult } from '../../types/model'
import type { TxUpdaterInterface } from '../../types/TxUpdaterInterface'

export class LivenessUpdater implements TxUpdaterInterface {
  type: TrackedTxsConfigType = 'liveness'

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
    this.logger.info('Updated liveness', { count: transactions.length })
  }

  async deleteFromById(id: TrackedTxId, fromInclusive: UnixTime) {
    await this.db.liveness.deleteFromById(id, fromInclusive)
  }

  transformTransactions(transactions: TrackedTxResult[]): LivenessRecord[] {
    return transactions.map((t) => ({
      timestamp: t.blockTimestamp,
      blockNumber: t.blockNumber,
      configurationId: t.id,
      txHash: t.hash,
    }))
  }
}

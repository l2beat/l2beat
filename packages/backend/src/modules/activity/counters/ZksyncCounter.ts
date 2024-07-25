import { Logger } from '@l2beat/backend-tools'
import { Database } from '@l2beat/database'
import { ProjectId } from '@l2beat/shared-pure'
import { range } from 'lodash'
import { ZksyncLiteClient } from '../../../peripherals/zksynclite/ZksyncLiteClient'
import { promiseAllPlus } from '../../../tools/queue/promiseAllPlus'
import { SequenceProcessor } from '../SequenceProcessor'

export class ZksyncCounter extends SequenceProcessor {
  constructor(
    projectId: ProjectId,
    db: Database,
    private readonly zksyncClient: ZksyncLiteClient,
    logger: Logger,
    batchSize: number,
  ) {
    super(projectId, db, { batchSize, startFrom: 1 }, logger)
    this.logger = this.logger.for(this)
  }

  protected override async getLatest(): Promise<number> {
    return await this.zksyncClient.getLatestBlock()
  }

  protected override async processRange(from: number, to: number) {
    const queries = range(from, to + 1).map((blockNumber) => async () => {
      const transactions =
        await this.zksyncClient.getTransactionsInBlock(blockNumber)

      return transactions.map((t, i) => {
        // Block 427 has a duplicated blockIndex
        const blockIndex =
          blockNumber === 427 && i === 1 ? t.blockIndex + 1 : t.blockIndex
        return {
          blockNumber,
          blockIndex,
          timestamp: t.createdAt,
        }
      })
    })

    const blockTransactions = await promiseAllPlus(queries, this.logger, {
      metricsId: 'ZksyncBlockCounter',
    })
    await this.db.zkSyncTransactionCount.addOrUpdateMany(
      blockTransactions.flat(),
    )
  }
}

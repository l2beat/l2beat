import type { Database, UpdateMessageRecord } from '@l2beat/database'
import { assert, type UnixTime } from '@l2beat/shared-pure'

export class UpdateMessagesService {
  constructor(
    private readonly db: Database,
    private readonly updateMessagesRetentionPeriodDays: number,
  ) {
    assert(
      this.updateMessagesRetentionPeriodDays > 0,
      'updateMessagesRetentionPeriodDays must be greater than 0',
    )
  }

  async storeAndPrune(message: UpdateMessageRecord) {
    await this.db.updateMessage.upsert(message)
    await this.prune(message.timestamp)
  }

  private prune(reference: UnixTime) {
    const cutoff = reference.add(
      -this.updateMessagesRetentionPeriodDays,
      'days',
    )

    return this.db.updateMessage.deleteBefore(cutoff)
  }
}

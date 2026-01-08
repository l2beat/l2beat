import type { Database, InteropEventRecord } from '@l2beat/database'
import type { UnixTime } from '@l2beat/shared-pure'
import type {
  InteropApproximateQuery,
  InteropEvent,
  InteropEventDb,
  InteropEventQuery,
  InteropEventType,
} from '../../plugins/types'
import { InMemoryEventDb } from './InMemoryEventDb'

export class InteropEventStore implements InteropEventDb {
  private eventDb: InMemoryEventDb

  constructor(
    private db: Database,
    inMemoryLimit: number,
  ) {
    this.eventDb = new InMemoryEventDb(inMemoryLimit)
  }

  async start() {
    const records = await this.db.interopEvent.getUnmatched()
    for (const record of records) {
      const event = fromDbRecord(record)
      this.eventDb.addEvent(event)
    }
  }

  async saveNewEvents(events: InteropEvent[]): Promise<void> {
    // Add to DB first, so if it fails, events will not be added to memory
    const records = events.map((e) => toDbRecord(e))
    await this.db.interopEvent.insertMany(records)
    for (const event of events) {
      this.eventDb.addEvent(event)
    }
  }

  async updateMatchedAndUnsupported({
    matched,
    unsupported,
  }: {
    matched: InteropEvent[]
    unsupported: InteropEvent[]
  }): Promise<void> {
    await this.db.transaction(async () => {
      await this.db.interopEvent.updateMatched(matched.map((e) => e.eventId))
      await this.db.interopEvent.updateUnsupported(
        unsupported.map((e) => e.eventId),
      )
    })
    this.eventDb.removeEvents([...matched, ...unsupported])
  }

  getEvents(type: string): InteropEvent[] {
    return this.eventDb.getEvents(type)
  }

  getEventTypes() {
    return this.eventDb.getEventTypes()
  }

  getEventCount() {
    return this.eventDb.getEventCount()
  }

  find<T>(
    type: InteropEventType<T>,
    query: InteropEventQuery<T>,
  ): InteropEvent<T> | undefined {
    return this.eventDb.find(type, query)
  }

  findApproximate<T>(
    type: InteropEventType<T>,
    query: InteropEventQuery<T>,
    approximate: InteropApproximateQuery<T>,
  ): InteropEvent<T> | undefined {
    return this.eventDb.findApproximate(type, query, approximate)
  }

  findAll<T>(
    type: InteropEventType<T>,
    query: InteropEventQuery<T>,
  ): InteropEvent<T>[] {
    return this.eventDb.findAll(type, query)
  }

  async deleteExpired(now: UnixTime) {
    const count = await this.db.interopEvent.deleteExpired(now)
    this.eventDb.removeExpired(now)
    return count
  }
}

function fromDbRecord(record: InteropEventRecord): InteropEvent {
  return {
    plugin: record.plugin,
    eventId: record.eventId,
    type: record.type,
    expiresAt: record.expiresAt,
    args: record.args,
    ctx: {
      chain: record.chain,
      timestamp: record.timestamp,
      logIndex: record.ctx.logIndex,
      txHash: record.ctx.txHash,
    },
  }
}

function toDbRecord(event: InteropEvent): InteropEventRecord {
  return {
    plugin: event.plugin,
    eventId: event.eventId,
    type: event.type,
    direction: event.direction,
    expiresAt: event.expiresAt,
    args: event.args,
    chain: event.ctx.chain,
    timestamp: event.ctx.timestamp,
    matched: false,
    unsupported: false,
    ctx: event.ctx,
    // Deprecated
    blockNumber: 0,
  }
}

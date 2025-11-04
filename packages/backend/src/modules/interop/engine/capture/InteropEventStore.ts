import type { Database, InteropEventRecord } from '@l2beat/database'
import type { UnixTime } from '@l2beat/shared-pure'
import type {
  InteropEvent,
  InteropEventDb,
  InteropEventQuery,
  InteropEventType,
} from '../../plugins/types'
import { InMemoryEventDb } from './InMemoryEventDb'

export class InteropEventStore implements InteropEventDb {
  private eventDb = new InMemoryEventDb()

  constructor(private db: Database) {}

  async start() {
    const records = await this.db.interopEvent.getUnmatched()
    for (const record of records) {
      const event = fromDbRecord(record)
      this.eventDb.addEvent(event)
    }
  }

  async saveNewEvents(events: InteropEvent[]): Promise<void> {
    for (const event of events) {
      this.eventDb.addEvent(event)
    }
    const records = events.map((e) => toDbRecord(e))
    await this.db.interopEvent.insertMany(records)
  }

  async updateMatchedAndUnsupported({
    matched,
    unsupported,
  }: {
    matched: Set<string>
    unsupported: Set<string>
  }): Promise<void> {
    const all = new Set([...matched, ...unsupported])
    this.eventDb.removeEvents(all)
    await this.db.transaction(async () => {
      await this.db.interopEvent.updateMatched(Array.from(matched))
      await this.db.interopEvent.updateUnsupported(Array.from(unsupported))
    })
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

  findAll<T>(
    type: InteropEventType<T>,
    query: InteropEventQuery<T>,
  ): InteropEvent<T>[] {
    return this.eventDb.findAll(type, query)
  }

  async deleteExpired(now: UnixTime) {
    this.eventDb.removeExpired(now)
    return await this.db.interopEvent.deleteExpired(now)
  }
}

function fromDbRecord(record: InteropEventRecord): InteropEvent {
  return {
    plugin: record.plugin,
    eventId: record.eventId,
    type: record.type,
    expiresAt: record.expiresAt,
    args: record.args,
    ctx: record.ctx,
  }
}

function toDbRecord(event: InteropEvent): InteropEventRecord {
  return {
    plugin: event.plugin,
    eventId: event.eventId,
    type: event.type,
    expiresAt: event.expiresAt,
    timestamp: event.ctx.timestamp,
    chain: event.ctx.chain,
    blockNumber: event.ctx.blockNumber,
    args: event.args,
    ctx: event.ctx,
    matched: false,
    unsupported: false,
  }
}

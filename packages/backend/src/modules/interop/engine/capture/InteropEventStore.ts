import type { Database, InteropEventRecord } from '@l2beat/database'
import type { UnixTime } from '@l2beat/shared-pure'
import {
  Address32,
  type InteropEvent,
  type InteropEventDb,
  type InteropEventQuery,
  type InteropEventType,
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
    ctx: {
      chain: record.chain,
      blockHash: record.blockHash,
      blockNumber: record.blockNumber,
      logIndex: record.logIndex,
      timestamp: record.timestamp,
      txHash: record.txHash,
      txValue: record.value,
      txTo: record.txTo ? Address32.from(record.txTo) : undefined,
      txData: record.calldata,
    },
  }
}

function toDbRecord(event: InteropEvent): InteropEventRecord {
  return {
    plugin: event.plugin,
    eventId: event.eventId,
    type: event.type,
    expiresAt: event.expiresAt,
    args: event.args,
    chain: event.ctx.chain,
    blockHash: event.ctx.blockHash,
    blockNumber: event.ctx.blockNumber,
    logIndex: event.ctx.logIndex,
    timestamp: event.ctx.timestamp,
    txHash: event.ctx.txHash,
    value: event.ctx.txValue,
    txTo: event.ctx.txTo,
    calldata: event.ctx.txData,
    matched: false,
    unsupported: false,
  }
}

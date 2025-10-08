import type { BridgeEventRecord, Database } from '@l2beat/database'
import type { UnixTime } from '@l2beat/shared-pure'
import { InMemoryEventDb } from './InMemoryEventDb'
import {
  Address32,
  type BridgeEvent,
  type BridgeEventDb,
  type BridgeEventQuery,
  type BridgeEventType,
} from './plugins/types'

export class BridgeStore implements BridgeEventDb {
  private eventDb = new InMemoryEventDb()

  constructor(private db: Database) {}

  async start() {
    const records = await this.db.bridgeEvent.getUnmatched()
    for (const record of records) {
      const event = fromDbRecord(record)
      this.eventDb.addEvent(event)
    }
  }

  async saveNewEvents(events: BridgeEvent[]): Promise<void> {
    for (const event of events) {
      this.eventDb.addEvent(event)
    }
    const records = events.map((e) => toDbRecord(e))
    await this.db.bridgeEvent.insertMany(records)
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
      await this.db.bridgeEvent.updateMatched(Array.from(matched))
      await this.db.bridgeEvent.updateUnsupported(Array.from(unsupported))
    })
  }

  getEvents(type: string): BridgeEvent[] {
    return this.eventDb.getEvents(type)
  }

  getEventTypes() {
    return this.eventDb.getEventTypes()
  }

  getEventCount() {
    return this.eventDb.getEventCount()
  }

  find<T>(
    type: BridgeEventType<T>,
    query: BridgeEventQuery<T>,
  ): BridgeEvent<T> | undefined {
    return this.eventDb.find(type, query)
  }

  findAll<T>(
    type: BridgeEventType<T>,
    query: BridgeEventQuery<T>,
  ): BridgeEvent<T>[] {
    return this.eventDb.findAll(type, query)
  }

  async deleteExpired(now: UnixTime) {
    this.eventDb.removeExpired(now)
    return await this.db.bridgeEvent.deleteExpired(now)
  }
}

function fromDbRecord(record: BridgeEventRecord): BridgeEvent {
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
      txTo: record.txTo ? Address32.from(record.txTo) : undefined,
    },
  }
}

function toDbRecord(event: BridgeEvent): BridgeEventRecord {
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
    txTo: event.ctx.txTo,
    matched: false,
    unsupported: false,
  }
}

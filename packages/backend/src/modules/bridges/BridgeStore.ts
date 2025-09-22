import type { BridgeEventRecord, Database } from '@l2beat/database'
import type { UnixTime } from '@l2beat/shared-pure'
import { InMemoryEventDb } from './InMemoryEventDb'
import type {
  BridgeEvent,
  BridgeEventDb,
  BridgeEventQuery,
  BridgeEventType,
} from './plugins/types'

export class BridgeStore implements BridgeEventDb {
  private eventDb = new InMemoryEventDb()
  private unmatched: BridgeEvent[] = []

  constructor(private db: Database) {}

  async start() {
    const records = await this.db.bridgeEvent.getUnmatched()
    for (const record of records) {
      const event = fromDbRecord(record)
      this.eventDb.addEvent(event)
      this.unmatched.push(event)
    }
  }

  async saveNewEvents(events: BridgeEvent[]): Promise<void> {
    for (const event of events) {
      this.eventDb.addEvent(event)
      this.unmatched.push(event)
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
    this.unmatched = this.unmatched.filter(
      (x) => !matched.has(x.eventId) || !unsupported.has(x.eventId),
    )

    await this.db.transaction(async () => {
      await this.db.bridgeEvent.updateMatched(Array.from(matched))
      await this.db.bridgeEvent.updateUnsupported(Array.from(unsupported))
    })
  }

  getUnmatched(): BridgeEvent[] {
    return this.unmatched
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
    for (const event of this.unmatched) {
      if (event.expiresAt <= now) {
        this.eventDb.removeEvent(event.eventId)
      }
    }
    this.unmatched = this.unmatched.filter((x) => x.expiresAt > now)
    await this.db.bridgeEvent.deleteExpired(now)
  }
}

function fromDbRecord(record: BridgeEventRecord): BridgeEvent {
  return {
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
      txTo: record.txTo,
    },
  }
}

function toDbRecord(event: BridgeEvent): BridgeEventRecord {
  return {
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

import type {
  BridgeEvent,
  BridgeEventDb,
  BridgeEventQuery,
  BridgeEventType,
} from './plugins/types'

export class InMemoryEventDb implements BridgeEventDb {
  private indices = new Map<string, EventIndex>()
  private allEvents: BridgeEvent[] = []

  addEvent(event: BridgeEvent) {
    this.allEvents.push(event)
    for (const index of this.indices.values()) {
      index.addEvent(event)
    }
  }

  removeEvent(eventId: string) {
    const index = this.allEvents.findIndex((x) => x.eventId === eventId)
    if (index === -1) {
      return
    }
    this.allEvents.splice(index, 1)
    for (const index of this.indices.values()) {
      index.removeEvent(eventId)
    }
  }

  find<T>(
    type: BridgeEventType<T>,
    query: BridgeEventQuery<T>,
  ): BridgeEvent<T> | undefined {
    return this.findAll(type, query)[0]
  }

  findAll<T>(
    type: BridgeEventType<T>,
    query: BridgeEventQuery<T>,
  ): BridgeEvent<T>[] {
    const index = this.getIndex(type, query)
    const events = index.findEvents(query) as BridgeEvent<T>[]
    if (query.sameTxAfter) {
      events.sort((a, b) => a.ctx.logIndex - b.ctx.logIndex)
    } else if (query.sameTxBefore) {
      events.sort((a, b) => b.ctx.logIndex - a.ctx.logIndex)
    }
    return events
  }

  private getIndex<T>(type: BridgeEventType<T>, query: BridgeEventQuery<T>) {
    const fields: string[] = []
    if (query.ctx?.txHash || query.sameTxAfter || query.sameTxBefore) {
      fields.push('ctx.txHash')
    } else {
      for (const key in query) {
        if (key === 'ctx') {
          for (const ctxKey in query[key]) {
            fields.push(`ctx.${ctxKey}`)
          }
        } else {
          fields.push(key)
        }
      }
    }
    const indexKey = JSON.stringify([type, fields])
    let index = this.indices.get(indexKey)
    if (!index) {
      console.log('NEW INDEX CREATED', type.type, fields)
      index = new EventIndex(type.type, fields)
      this.indices.set(indexKey, index)
      for (const event of this.allEvents) {
        index.addEvent(event)
      }
    }
    return index
  }
}

class EventIndex {
  private buckets = new Map<string, BridgeEvent[]>()
  private eventKeys = new Map<string, string>()

  constructor(
    private eventType: string,
    private fields: string[],
  ) {}

  findEvents(query: Record<string, unknown>): BridgeEvent[] {
    const keyParts: unknown[] = []
    for (const field of this.fields) {
      if (field.startsWith('ctx.')) {
        const ctx = (query.ctx ?? {}) as Record<string, unknown>
        keyParts.push(ctx[field.slice(4)])
      } else {
        keyParts.push(query[field])
      }
    }
    const key = JSON.stringify(keyParts)
    const array = this.buckets.get(key) ?? []
    return array.filter((e) => matchesQuery(e, query))
  }

  addEvent(event: BridgeEvent) {
    if (event.type !== this.eventType) {
      return
    }

    const keyParts: unknown[] = []
    for (const field of this.fields) {
      if (field.startsWith('ctx.')) {
        keyParts.push(
          (event.ctx as unknown as Record<string, unknown>)[field.slice(4)],
        )
      } else {
        keyParts.push((event.args as Record<string, unknown>)[field])
      }
    }
    const key = JSON.stringify(keyParts)
    this.eventKeys.set(event.eventId, key)
    const array = this.buckets.get(key) ?? []
    array.push(event)
    this.buckets.set(key, array)
  }

  removeEvent(eventId: string) {
    const key = this.eventKeys.get(eventId)
    if (!key) {
      return
    }
    this.eventKeys.delete(eventId)
    const array = this.buckets.get(key)
    if (!array) {
      return
    }
    const index = array.findIndex((x) => x.eventId === eventId)
    if (index !== -1) {
      array.splice(index, 1)
    }
    if (array.length === 0) {
      this.buckets.delete(key)
    }
  }
}

function matchesQuery<T>(
  event: BridgeEvent<T>,
  query: BridgeEventQuery<T>,
): boolean {
  for (const key in query) {
    if (key === 'ctx') {
      for (const ctxKey in query[key]) {
        // @ts-ignore
        if (event.ctx[ctxKey] !== query.ctx[ctxKey]) {
          return false
        }
      }
    } else if (key !== 'sameTxBefore' && key !== 'sameTxAfter') {
      // @ts-ignore
      if (event.args[key] !== query[key]) {
        return false
      }
    }
  }
  if (query.sameTxAfter) {
    if (
      event.ctx.chain !== query.sameTxAfter.ctx.chain ||
      event.ctx.txHash !== query.sameTxAfter.ctx.txHash ||
      event.ctx.logIndex <= query.sameTxAfter.ctx.logIndex
    ) {
      return false
    }
  }
  if (query.sameTxBefore) {
    if (
      event.ctx.chain !== query.sameTxBefore.ctx.chain ||
      event.ctx.txHash !== query.sameTxBefore.ctx.txHash ||
      event.ctx.logIndex >= query.sameTxBefore.ctx.logIndex
    ) {
      return false
    }
  }
  return true
}

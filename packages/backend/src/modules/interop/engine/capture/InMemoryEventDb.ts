import type { UnixTime } from '@l2beat/shared-pure'
import type {
  InteropEvent,
  InteropEventContext,
  InteropEventDb,
  InteropEventQuery,
  InteropEventType,
} from '../../plugins/types'

export class InMemoryEventDb implements InteropEventDb {
  private indices = new Map<number, EventIndex>()
  private eventsByType = new Map<string, InteropEvent[]>()
  private count = 0

  getEvents(type: string): InteropEvent[] {
    let array = this.eventsByType.get(type)
    if (!array) {
      array = []
      this.eventsByType.set(type, array)
    }
    return array
  }

  getEventTypes() {
    return [...this.eventsByType.keys()]
  }

  getEventCount() {
    return this.count
  }

  addEvent(event: InteropEvent) {
    this.count += 1
    this.getEvents(event.type).push(event)
    for (const index of this.indices.values()) {
      index.addEvent(event)
    }
  }

  removeExpired(now: UnixTime) {
    this.removeWhere((e) => e.expiresAt <= now)
  }

  removeEvents(eventIds: Set<string>) {
    this.removeWhere((e) => eventIds.has(e.eventId))
  }

  private removeWhere(predicate: (event: InteropEvent) => boolean) {
    const removed: InteropEvent[] = []
    for (const array of this.eventsByType.values()) {
      for (let i = 0; i < array.length; i++) {
        if (predicate(array[i])) {
          this.count -= 1
          removed.push(array[i])
          if (i === array.length - 1) {
            array.pop()
          } else {
            // biome-ignore lint/style/noNonNullAssertion: It's there
            array[i] = array.pop()!
            i--
          }
        }
      }
    }
    for (const index of this.indices.values()) {
      for (const event of removed) {
        index.removeEvent(event)
      }
    }
  }

  find<T>(
    type: InteropEventType<T>,
    query: InteropEventQuery<T>,
  ): InteropEvent<T> | undefined {
    return this.findAll(type, query)[0]
  }

  findAll<T>(
    type: InteropEventType<T>,
    query: InteropEventQuery<T>,
  ): InteropEvent<T>[] {
    const index = this.getIndex(type, query)
    const events = index.findEvents(query) as InteropEvent<T>[]
    if (events.length > 1) {
      if (query.sameTxAfter) {
        events.sort((a, b) => a.ctx.logIndex - b.ctx.logIndex)
      } else if (query.sameTxBefore) {
        events.sort((a, b) => b.ctx.logIndex - a.ctx.logIndex)
      }
    }
    return events
  }

  private getIndex<T>(type: InteropEventType<T>, query: InteropEventQuery<T>) {
    const queryHash = hashQuery(type, query)
    let index = this.indices.get(queryHash)
    if (!index) {
      const fields: string[] = []
      const ctxFields: (keyof InteropEventContext)[] = []
      if (query.ctx?.txHash || query.sameTxAfter || query.sameTxBefore) {
        ctxFields.push('txHash')
      } else {
        for (const key in query) {
          if (key === 'ctx') {
            for (const ctxKey in query[key]) {
              ctxFields.push(ctxKey as keyof InteropEventContext)
            }
          } else {
            fields.push(key)
          }
        }
      }
      index = new EventIndex(type.type, fields, ctxFields)
      this.indices.set(queryHash, index)
      for (const event of this.getEvents(type.type)) {
        index.addEvent(event)
      }
    }
    return index
  }
}

function hashQuery(
  type: InteropEventType<unknown>,
  query: InteropEventQuery<unknown>,
): number {
  let hash = FNV_OFFSET_BASIS
  hash = updateHash(hash, type.type)
  hash = updateHash(hash, '#')
  if (query.ctx?.txHash || query.sameTxAfter || query.sameTxBefore) {
    hash = updateHash(hash, '#txHash#')
    return hash
  }
  for (const key in query) {
    if (key !== 'ctx') {
      hash = updateHash(hash, key)
      hash = updateHash(hash, '#')
    }
  }
  hash = updateHash(hash, '#')
  if (query.ctx) {
    for (const key in query.ctx) {
      if (key !== 'ctx') {
        hash = updateHash(hash, key)
        hash = updateHash(hash, '#')
      }
    }
  }
  return hash
}

class EventIndex {
  private buckets = new Map<number, InteropEvent[]>()

  constructor(
    private eventType: string,
    private fields: string[],
    private ctxFields: (keyof InteropEventContext)[],
  ) {}

  findEvents(query: InteropEventQuery<unknown>): InteropEvent[] {
    const hash = this.hashQuery(query)
    const array = this.buckets.get(hash) ?? []
    return array.filter((e) => matchesQuery(e, query))
  }

  addEvent(event: InteropEvent) {
    if (event.type !== this.eventType) {
      return
    }
    const hash = this.hashEvent(event)
    const array = this.buckets.get(hash) ?? []
    array.push(event)
    this.buckets.set(hash, array)
  }

  removeEvent(event: InteropEvent) {
    const hash = this.hashEvent(event)
    const array = this.buckets.get(hash)
    if (!array) {
      return
    }
    const index = array.findIndex((x) => x.eventId === event.eventId)
    if (index !== -1) {
      array.splice(index, 1)
    }
    if (array.length === 0) {
      this.buckets.delete(hash)
    }
  }

  private hashEvent(event: InteropEvent) {
    const args = event.args as Record<string, unknown>
    let hash = FNV_OFFSET_BASIS
    // biome-ignore lint/style/useForOf: speed
    for (let i = 0; i < this.fields.length; i++) {
      hash = updateHash(hash, `${args[this.fields[i]]}`)
      hash = updateHash(hash, '#')
    }
    // biome-ignore lint/style/useForOf: speed
    for (let i = 0; i < this.ctxFields.length; i++) {
      hash = updateHash(hash, `${event.ctx[this.ctxFields[i]]}`)
      hash = updateHash(hash, '#')
    }
    return hash
  }

  private hashQuery(query: InteropEventQuery<unknown>) {
    const args = query as Record<string, unknown>
    let hash = FNV_OFFSET_BASIS
    // biome-ignore lint/style/useForOf: speed
    for (let i = 0; i < this.fields.length; i++) {
      hash = updateHash(hash, `${args[this.fields[i]]}`)
      hash = updateHash(hash, '#')
    }
    if (this.ctxFields.length > 0) {
      const ctx = query.ctx ?? {}
      // biome-ignore lint/style/useForOf: speed
      for (let i = 0; i < this.ctxFields.length; i++) {
        const key = this.ctxFields[i]
        let value = ctx[key]
        if (key === 'txHash' && value === undefined) {
          value =
            query.sameTxBefore?.ctx.txHash ?? query.sameTxAfter?.ctx.txHash
        }
        hash = updateHash(hash, `${value}`)
        hash = updateHash(hash, '#')
      }
    }
    return hash
  }
}

function matchesQuery<T>(
  event: InteropEvent<T>,
  query: InteropEventQuery<T>,
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

const FNV_OFFSET_BASIS = 0x811c9dc5
const FNV_PRIME = 0x01000193
function updateHash(hash: number, value: string) {
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i)
    hash = Math.imul(hash, FNV_PRIME)
  }
  return hash >>> 0
}

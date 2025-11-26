import type { InteropEventContext } from '@l2beat/database'
import type { UnixTime } from '@l2beat/shared-pure'
import type {
  InteropEvent,
  InteropEventDb,
  InteropEventQuery,
  InteropEventType,
} from '../../plugins/types'

export class InMemoryEventDb implements InteropEventDb {
  private stores: EventTypeStore<unknown>[] = []
  private storeIndices = new Map<string, number>()
  private count = 0

  constructor(private eventCap = 500_000) {}

  getEvents(type: string): InteropEvent[] {
    return this.getStore(type).getAll()
  }

  private getStore<T = unknown>(type: string): EventTypeStore<T> {
    let storeIndex = this.storeIndices.get(type)
    if (storeIndex === undefined) {
      const store = new EventTypeStore()
      storeIndex = this.stores.length
      this.storeIndices.set(type, storeIndex)
      this.stores.push(store)
    }
    return this.stores[storeIndex] as EventTypeStore<T>
  }

  getEventTypes() {
    return [...this.storeIndices.keys()]
  }

  getEventCount() {
    return this.count
  }

  addEvent(event: InteropEvent) {
    if (this.count >= this.eventCap) {
      let minStore: EventTypeStore<unknown> | undefined
      let minExpiresAt = Number.POSITIVE_INFINITY
      // This shouldn't be a bottleneck but if it is we can always create
      // a top-level heap for the stores too.
      for (const store of this.stores) {
        const next = store.peekNextToExpire()
        if (next && next.expiresAt < minExpiresAt) {
          minExpiresAt = next.expiresAt
          minStore = store
        }
      }
      if (minStore?.removeNextToExpire()) {
        this.count -= 1
      }
    }
    this.getStore(event.type).add(event)
    this.count += 1
  }

  removeExpired(now: UnixTime) {
    for (const store of this.stores) {
      while (true) {
        const next = store.peekNextToExpire()
        if (!next || next.expiresAt >= now) break
        store.removeNextToExpire()
        this.count -= 1
      }
    }
  }

  removeEvents(events: InteropEvent[]) {
    for (const event of events) {
      if (this.getStore(event.type).remove(event)) {
        this.count -= 1
      }
    }
  }

  find<T>(
    type: InteropEventType<T>,
    query: InteropEventQuery<T>,
  ): InteropEvent<T> | undefined {
    return this.getStore<T>(type.type).findAll(query)[0]
  }

  findAll<T>(
    type: InteropEventType<T>,
    query: InteropEventQuery<T>,
  ): InteropEvent<T>[] {
    return this.getStore<T>(type.type).findAll(query)
  }
}

// Implements a min-heap on the `expiresAt` property and keeps lookups for
// a specific event type.
class EventTypeStore<T> {
  private all: InteropEvent<T>[] = []
  private indices = new Map<InteropEvent<T>, number>()
  // There is most likely 0-2 lookups so array is faster than a map
  private lookups: Lookup<T>[] = []

  getAll(): InteropEvent<T>[] {
    return this.all
  }

  peekNextToExpire(): InteropEvent<T> | undefined {
    return this.all[0]
  }

  removeNextToExpire(): boolean {
    if (this.all.length === 0) {
      return false
    }

    const element = this.all[0]
    this.indices.delete(element)
    for (const lookup of this.lookups) {
      lookup.removeEvent(element)
    }

    const last = this.all.pop()
    if (!last || last === element) return true

    this.all[0] = last
    this.indices.set(last, 0)
    this.siftDown(0)
    return true
  }

  add(event: InteropEvent<T>) {
    this.all.push(event)
    this.indices.set(event, this.all.length - 1)
    this.siftUp(this.all.length - 1)
  }

  remove(event: InteropEvent<T>): boolean {
    const index = this.indices.get(event)
    if (index === undefined) return false

    this.indices.delete(event)
    for (const lookup of this.lookups) {
      lookup.removeEvent(event)
    }

    const last = this.all.pop()
    if (last === event || !last) return true

    this.all[index] = last
    this.indices.set(last, index)
    if (index !== 0) {
      const parentIndex = Math.floor((index - 1) / 2)
      if (this.all[parentIndex].expiresAt > last.expiresAt) {
        this.siftUp(index)
        return true
      }
    }
    this.siftDown(index)
    return true
  }

  private siftUp(index: number) {
    while (index !== 0) {
      const element = this.all[index]
      const parentIndex = Math.floor((index - 1) / 2)
      const parent = this.all[parentIndex]
      if (parent.expiresAt <= element.expiresAt) {
        break
      }
      this.all[parentIndex] = element
      this.indices.set(element, parentIndex)
      this.all[index] = parent
      this.indices.set(parent, index)
      index = parentIndex
    }
  }

  private siftDown(index: number) {
    while (true) {
      const element = this.all[index]
      const childLIndex = index * 2 + 1
      const childRIndex = index * 2 + 2

      let smallerIndex = childLIndex
      if (childRIndex < this.all.length) {
        const childL = this.all[childLIndex]
        const childR = this.all[childRIndex]
        if (childR.expiresAt < childL.expiresAt) {
          smallerIndex = childRIndex
        }
      }

      if (smallerIndex >= this.all.length) {
        break
      }
      const smallerChild = this.all[smallerIndex]
      if (smallerChild.expiresAt >= element.expiresAt) {
        break
      }
      this.all[smallerIndex] = element
      this.indices.set(element, smallerIndex)
      this.all[index] = smallerChild
      this.indices.set(smallerChild, index)
      index = smallerIndex
    }
  }

  findAll(query: InteropEventQuery<T>): InteropEvent<T>[] {
    const lookup = this.getLookup(query)
    const events = lookup.findEvents(query)
    if (events.length > 1) {
      if (query.sameTxAfter) {
        events.sort((a, b) => a.ctx.logIndex - b.ctx.logIndex)
      } else if (query.sameTxBefore) {
        events.sort((a, b) => b.ctx.logIndex - a.ctx.logIndex)
      }
    }
    return events
  }

  private getLookup(query: InteropEventQuery<T>): Lookup<T> {
    const lookupHash = this.hashLookup(query)
    let lookup = this.lookups.find((l) => l.hash === lookupHash)
    if (!lookup) {
      const fields: (keyof T)[] = []
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
            fields.push(key as keyof T)
          }
        }
      }
      lookup = new Lookup<T>(lookupHash, fields, ctxFields)
      this.lookups.push(lookup)
      for (const event of this.all) {
        lookup.addEvent(event)
      }
    }
    return lookup
  }

  private hashLookup(query: InteropEventQuery<unknown>): number {
    if (query.ctx?.txHash || query.sameTxAfter || query.sameTxBefore) {
      return 42 // The specific number doesn't matter. Any magic constant is fine
    }
    let hash = FNV_OFFSET_BASIS
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
}

// This is effectively an in-memory index that allows for efficient querying
// by specific event fields. Calling `db.find(MyEvent, { a: 1, b: 2 })` results
// in the creation of a Lookup for fields a and b. Events with different
// a and b values land in different buckets making them easy to find.
class Lookup<T> {
  private buckets = new Map<number, InteropEvent<T>[]>()

  constructor(
    readonly hash: number,
    private fields: (keyof T)[],
    private ctxFields: (keyof InteropEventContext)[],
  ) {}

  findEvents(query: InteropEventQuery<T>): InteropEvent<T>[] {
    const hash = this.hashQuery(query)
    const array = this.buckets.get(hash) ?? []
    return array.filter((e) => matchesQuery(e, query))
  }

  addEvent(event: InteropEvent<T>) {
    const hash = this.hashEvent(event)
    const array = this.buckets.get(hash) ?? []
    array.push(event)
    this.buckets.set(hash, array)
  }

  removeEvent(event: InteropEvent<T>) {
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

  private hashEvent(event: InteropEvent<T>) {
    let hash = FNV_OFFSET_BASIS
    // biome-ignore lint/style/useForOf: speed
    for (let i = 0; i < this.fields.length; i++) {
      hash = updateHash(hash, `${event.args[this.fields[i]]}`)
      hash = updateHash(hash, '#')
    }
    // biome-ignore lint/style/useForOf: speed
    for (let i = 0; i < this.ctxFields.length; i++) {
      hash = updateHash(hash, `${event.ctx[this.ctxFields[i]]}`)
      hash = updateHash(hash, '#')
    }
    return hash
  }

  private hashQuery(query: InteropEventQuery<T>) {
    let hash = FNV_OFFSET_BASIS
    // biome-ignore lint/style/useForOf: speed
    for (let i = 0; i < this.fields.length; i++) {
      hash = updateHash(hash, `${query[this.fields[i]]}`)
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

// We use FNV-1 for speed and low memory overhead
// Previously we used string keys and those remained in memory
// Also calling updateHash does not allocate intermediate values
const FNV_OFFSET_BASIS = 0x811c9dc5
const FNV_PRIME = 0x01000193
function updateHash(hash: number, value: string) {
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i)
    hash = Math.imul(hash, FNV_PRIME)
  }
  return hash >>> 0
}

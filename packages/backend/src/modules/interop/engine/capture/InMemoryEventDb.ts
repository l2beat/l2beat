import type { UnixTime } from '@l2beat/shared-pure'
import type {
  InteropEvent,
  InteropEventDb,
  InteropEventQuery,
  InteropEventType,
} from '../../plugins/types'

export class InMemoryEventDb implements InteropEventDb {
  private indices = new Map<string, EventIndex>()
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
    const removedIds: string[] = []
    for (const array of this.eventsByType.values()) {
      for (let i = 0; i < array.length; i++) {
        if (predicate(array[i])) {
          this.count -= 1
          removedIds.push(array[i].eventId)
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
      for (const eventId of removedIds) {
        index.removeEvent(eventId)
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
    const indexKey = getIndexKey(type, query)
    let index = this.indices.get(indexKey)
    if (!index) {
      const fields: string[] = []
      const ctxFields: string[] = []
      let approximateValueKey: string | undefined

      if (query.approximateValue) {
        approximateValueKey =
          query.approximateValue.key +
          query.approximateValue.value.toString() +
          query.approximateValue.tolerance +
          '#'
      } else if (query.ctx?.txHash || query.sameTxAfter || query.sameTxBefore) {
        ctxFields.push('txHash')
      } else {
        for (const key in query) {
          if (key === 'ctx') {
            for (const ctxKey in query[key]) {
              ctxFields.push(ctxKey)
            }
          } else {
            fields.push(key)
          }
        }
      }
      index = new EventIndex(type.type, fields, ctxFields, approximateValueKey)
      this.indices.set(indexKey, index)
      for (const event of this.getEvents(type.type)) {
        index.addEvent(event)
      }
    }
    return index
  }
}

function getIndexKey(
  type: InteropEventType<unknown>,
  query: InteropEventQuery<unknown>,
) {
  let indexKey = type.type + '#'
  if (query.approximateValue) {
    indexKey +=
      query.approximateValue.key +
      query.approximateValue.value.toString() +
      query.approximateValue.tolerance +
      '#'
  }
  if (query.ctx?.txHash || query.sameTxAfter || query.sameTxBefore) {
    return indexKey + '#txHash#' // shouldn't it be += ?
  }
  for (const key in query) {
    if (key !== 'ctx') {
      indexKey += key + '#'
    }
  }
  indexKey += '#'
  if (query.ctx) {
    for (const key in query.ctx) {
      if (key !== 'ctx') {
        indexKey += key + '#'
      }
    }
  }
  return indexKey
}

class EventIndex {
  private buckets = new Map<string, InteropEvent[]>()
  private eventKeys = new Map<string, string>()

  constructor(
    private eventType: string,
    private fields: string[],
    private ctxFields: string[],
    private approximateValueKey?: string,
  ) {}

  findEvents(query: InteropEventQuery<unknown>): InteropEvent[] {
    let eventKey = ''
    // biome-ignore lint/style/useForOf: speed
    for (let i = 0; i < this.fields.length; i++) {
      eventKey += (query as Record<string, unknown>)[this.fields[i]] + ','
    }
    if (this.ctxFields.length > 0) {
      const ctx = (query.ctx ?? {}) as Record<string, unknown>
      // biome-ignore lint/style/useForOf: speed
      for (let i = 0; i < this.ctxFields.length; i++) {
        const key = this.ctxFields[i]
        let value = ctx[key]
        if (key === 'txHash' && value === undefined) {
          value =
            query.sameTxBefore?.ctx.txHash ?? query.sameTxAfter?.ctx.txHash
        }
        eventKey += value + ','
      }
    }
    if (this.approximateValueKey) {
      eventKey += this.approximateValueKey
    }
    const array = this.buckets.get(eventKey) ?? []
    return array.filter((e) => matchesQuery(e, query))
  }

  addEvent(event: InteropEvent) {
    if (event.type !== this.eventType) {
      return
    }

    let eventKey = ''
    for (const field of this.fields) {
      eventKey += (event.args as Record<string, unknown>)[field] + ','
    }
    for (const field of this.ctxFields) {
      eventKey += (event.ctx as unknown as Record<string, unknown>)[field] + ','
    }
    if (this.approximateValueKey) {
      eventKey += this.approximateValueKey
    }
    this.eventKeys.set(event.eventId, eventKey)
    const array = this.buckets.get(eventKey) ?? []
    array.push(event)
    this.buckets.set(eventKey, array)
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
  event: InteropEvent<T>,
  query: InteropEventQuery<T>,
): boolean {
  if (query.approximateValue) {
    // @ts-ignore
    const value = event.args[query.approximateValue.key] as bigint
    // Convert tolerance (0-1) to BigInt by scaling by 10000
    const toleranceScaled = BigInt(
      Math.floor(query.approximateValue.tolerance * 10000),
    )
    const tolerance = (value * toleranceScaled) / 10000n
    const diff = value - query.approximateValue.value
    const absDiff = diff < 0n ? -diff : diff

    return absDiff < tolerance
  }

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

import type { BridgeEvent, BridgeEventType, EventDb } from './plugins/types'

export class EventDbImpl implements EventDb {
  constructor(public events: BridgeEvent[]) {}

  find<T>(
    type: BridgeEventType<T>,
    query?: Partial<T>,
  ): BridgeEvent<T> | undefined {
    return this.events.find((a): a is BridgeEvent<T> => {
      if (!type.checkType(a)) return false
      if (!query) return true
      return matchesQuery(a.args, query)
    })
  }

  findAll<T>(type: BridgeEventType<T>, query?: Partial<T>): BridgeEvent<T>[] {
    return this.events.filter((a): a is BridgeEvent<T> => {
      if (!type.checkType(a)) return false
      if (!query) return true
      return matchesQuery(a.args, query)
    })
  }
}

function matchesQuery<T>(payload: T, query: Partial<T>): boolean {
  return Object.entries(query).every(([key, value]) => {
    // biome-ignore lint/suspicious/noExplicitAny: We want to do it old school
    return (payload as any)[key] === value
  })
}

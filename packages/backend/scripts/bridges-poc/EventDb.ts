import type { Event, EventDb, EventType } from './plugins/types'

export class EventDbImpl implements EventDb {
  constructor(public actions: Event[]) {}

  find<T>(type: EventType<T>, query?: Partial<T>): Event<T> | undefined {
    return this.actions.find((a): a is Event<T> => {
      if (!type.checkType(a)) return false
      if (!query) return true
      return matchesQuery(a.payload, query)
    })
  }

  findAll<T>(type: EventType<T>, query?: Partial<T>): Event<T>[] {
    return this.actions.filter((a): a is Event<T> => {
      if (!type.checkType(a)) return false
      if (!query) return true
      return matchesQuery(a.payload, query)
    })
  }
}

function matchesQuery<T>(payload: T, query: Partial<T>): boolean {
  return Object.entries(query).every(([key, value]) => {
    // biome-ignore lint/suspicious/noExplicitAny: We want to do it old school
    return (payload as any)[key] === value
  })
}

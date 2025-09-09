import type {
  BridgeEvent,
  BridgeEventDb,
  BridgeEventType,
} from '../plugins/types'

export class InMemoryEventDb implements BridgeEventDb {
  constructor(public actions: BridgeEvent[]) {}

  find<T>(
    type: BridgeEventType<T>,
    query?: Partial<T>,
  ): BridgeEvent<T> | undefined {
    return this.actions.find((a): a is BridgeEvent<T> => {
      if (!type.checkType(a)) return false
      if (!query) return true
      return matchesQuery(a.args, query)
    })
  }

  findAll<T>(type: BridgeEventType<T>, query?: Partial<T>): BridgeEvent<T>[] {
    return this.actions.filter((a): a is BridgeEvent<T> => {
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

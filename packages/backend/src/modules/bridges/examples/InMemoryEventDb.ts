import { matchesQuery } from '../BridgeStore'
import type {
  BridgeEvent,
  BridgeEventDb,
  BridgeEventQuery,
  BridgeEventType,
} from '../plugins/types'

export class InMemoryEventDb implements BridgeEventDb {
  constructor(public actions: BridgeEvent[]) {}

  find<T>(
    type: BridgeEventType<T>,
    query?: BridgeEventQuery<T>,
  ): BridgeEvent<T> | undefined {
    return this.actions.find((e): e is BridgeEvent<T> => {
      if (!type.checkType(e)) return false
      if (!query) return true
      return matchesQuery(e, query)
    })
  }

  findAll<T>(
    type: BridgeEventType<T>,
    query?: BridgeEventQuery<T>,
  ): BridgeEvent<T>[] {
    return this.actions.filter((e): e is BridgeEvent<T> => {
      if (!type.checkType(e)) return false
      if (!query) return true
      return matchesQuery(e, query)
    })
  }
}

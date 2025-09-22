import { getMatching } from '../BridgeStore'
import type {
  BridgeEvent,
  BridgeEventDb,
  BridgeEventQuery,
  BridgeEventType,
} from '../plugins/types'

export class InMemoryEventDb implements BridgeEventDb {
  constructor(public events: BridgeEvent[]) {}

  find<T>(
    type: BridgeEventType<T>,
    query: BridgeEventQuery<T>,
  ): BridgeEvent<T> | undefined {
    const typed = this.events.filter(type.checkType)
    return getMatching(typed, query)[0]
  }

  findAll<T>(
    type: BridgeEventType<T>,
    query: BridgeEventQuery<T>,
  ): BridgeEvent<T>[] {
    const typed = this.events.filter(type.checkType)
    return getMatching(typed, query)
  }
}

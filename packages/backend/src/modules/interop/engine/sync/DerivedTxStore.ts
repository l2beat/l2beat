import { UpsertMap } from '@l2beat/shared'
import type {
  DerivedTxDataRequest,
  InteropEvent,
  InteropPluginResyncable,
} from '../../plugins/types'

export interface DerivedTxEntry {
  chain: string
  txHash: string
  creatorEvent: InteropEvent
}

export class DerivedTxStore {
  private readonly requestsByPlugin = new Map<
    string,
    Map<string, DerivedTxDataRequest[]>
  >()
  private readonly entriesByChain = new UpsertMap<
    string,
    UpsertMap<string, DerivedTxEntry[]>
  >()

  constructor(plugins: InteropPluginResyncable[] = []) {
    for (const plugin of plugins) {
      const requestsByEventType = new Map<string, DerivedTxDataRequest[]>()
      for (const request of plugin.getDataRequests()) {
        if (request.type !== 'derivedTransaction') {
          continue
        }
        const requests =
          requestsByEventType.get(request.creatorEvent.type) ?? []
        requests.push(request)
        requestsByEventType.set(request.creatorEvent.type, requests)
      }
      if (requestsByEventType.size > 0) {
        this.requestsByPlugin.set(plugin.name, requestsByEventType)
      }
    }
  }

  onEventCreated(event: InteropEvent) {
    const requests = this.requestsByPlugin.get(event.plugin)?.get(event.type)
    if (!requests) {
      return
    }
    for (const request of requests) {
      this.addEntry(event, request)
    }
  }

  onEventsRemoved(events: InteropEvent[]) {
    for (const event of events) {
      const requests = this.requestsByPlugin.get(event.plugin)?.get(event.type)
      if (!requests) {
        continue
      }
      for (const request of requests) {
        this.removeEntry(event, request)
      }
    }
  }

  get(chain: string, txHash: string): DerivedTxEntry[] {
    return this.entriesByChain.get(chain)?.get(txHash) ?? []
  }

  getCreatorEvents(chain: string, txHash: string, plugin: string) {
    const creatorEvents = this.get(chain, txHash)
      .filter((entry) => entry.creatorEvent.plugin === plugin)
      .map((entry) => entry.creatorEvent)
    return creatorEvents.length > 0 ? creatorEvents : undefined
  }

  getCount(): number {
    let count = 0
    for (const entriesByTxHash of this.entriesByChain.values()) {
      for (const entries of entriesByTxHash.values()) {
        count += entries.length
      }
    }
    return count
  }

  private addEntry(event: InteropEvent, request: DerivedTxDataRequest) {
    const { chain, txHash } = this.getEntryKey(event, request)
    const entriesByTxHash = this.entriesByChain.getOrInsertComputed(
      chain,
      () => new UpsertMap(),
    )
    const entries = entriesByTxHash.getOrInsertComputed(txHash, () => [])
    entries.push({
      chain,
      txHash,
      creatorEvent: event,
    })
  }

  private removeEntry(event: InteropEvent, request: DerivedTxDataRequest) {
    const { chain, txHash } = this.getEntryKey(event, request)
    const entriesByTxHash = this.entriesByChain.get(chain)
    const entries = entriesByTxHash?.get(txHash)
    if (!entriesByTxHash || !entries) {
      return
    }

    const filtered = entries.filter(
      (entry) => entry.creatorEvent.eventId !== event.eventId,
    )
    if (filtered.length === 0) {
      entriesByTxHash.delete(txHash)
      if (entriesByTxHash.size === 0) {
        this.entriesByChain.delete(chain)
      }
      return
    }
    entriesByTxHash.set(txHash, filtered)
  }

  private getEntryKey(event: InteropEvent, request: DerivedTxDataRequest) {
    const args = event.args as Record<string, unknown>
    const txHash = args[request.txHashArg]
    const chain = args[request.chainArg]
    if (typeof txHash !== 'string' || typeof chain !== 'string') {
      throw new Error(
        `Invalid derived tx request values for ${event.plugin}:${event.type}`,
      )
    }
    return { chain, txHash }
  }
}

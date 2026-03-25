import { UpsertMap } from '@l2beat/shared'
import type {
  InteropEvent,
  InteropPluginResyncable,
  TxFromEventRequest,
} from '../../plugins/types'

export interface DerivedTxEntry {
  chain: string
  txHash: string
  creatorEvent: InteropEvent
  checkedInHistory: boolean
}

export class DerivedTxStore {
  private readonly requestsByPlugin = new Map<
    string,
    Map<string, TxFromEventRequest>
  >()
  private readonly entriesByChain = new UpsertMap<
    string,
    UpsertMap<string, DerivedTxEntry[]>
  >()

  constructor(plugins: InteropPluginResyncable[] = []) {
    for (const plugin of plugins) {
      const requestsByEventType = new Map<string, TxFromEventRequest>()
      for (const request of plugin.getDataRequests()) {
        if (request.type !== 'txFromEvent') {
          continue
        }
        if (requestsByEventType.has(request.creatorEvent.type)) {
          throw new Error(
            `Multiple derived tx requests for ${plugin.name}:${request.creatorEvent.type}`,
          )
        }
        requestsByEventType.set(request.creatorEvent.type, request)
      }
      if (requestsByEventType.size > 0) {
        this.requestsByPlugin.set(plugin.name, requestsByEventType)
      }
    }
  }

  onEventCreated(event: InteropEvent, checkedInHistory = false) {
    const request = this.requestsByPlugin.get(event.plugin)?.get(event.type)
    if (!request) {
      return
    }
    this.addEntry(event, request, checkedInHistory)
  }

  onEventsRemoved(events: InteropEvent[]) {
    for (const event of events) {
      const request = this.requestsByPlugin.get(event.plugin)?.get(event.type)
      if (!request) {
        continue
      }
      this.removeEntry(event, request)
    }
  }

  get(chain: string, txHash: string): DerivedTxEntry[] {
    return this.entriesByChain.get(chain)?.get(txHash) ?? []
  }

  getHashesPendingHistoryCheck(chain: string, pluginNames: string[]): string[] {
    const entriesByTxHash = this.entriesByChain.get(chain)
    if (!entriesByTxHash) return []
    const pluginSet = new Set(pluginNames)
    const hashes: string[] = []
    for (const [txHash, entries] of entriesByTxHash) {
      const hasPending = entries.some(
        (e) => !e.checkedInHistory && pluginSet.has(e.creatorEvent.plugin),
      )
      if (hasPending) {
        hashes.push(txHash)
      }
    }
    return hashes
  }

  markCheckedInHistory(
    chain: string,
    txHashes: string[],
    pluginNames: string[],
  ): InteropEvent[] {
    const pluginSet = new Set(pluginNames)
    const markedEvents: InteropEvent[] = []
    for (const txHash of txHashes) {
      const entries = this.entriesByChain.get(chain)?.get(txHash)
      if (!entries) continue
      for (const entry of entries) {
        if (
          !entry.checkedInHistory &&
          pluginSet.has(entry.creatorEvent.plugin)
        ) {
          entry.checkedInHistory = true
          markedEvents.push(entry.creatorEvent)
        }
      }
    }
    return markedEvents
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

  private addEntry(
    event: InteropEvent,
    request: TxFromEventRequest,
    checkedInHistory: boolean,
  ) {
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
      checkedInHistory,
    })
  }

  private removeEntry(event: InteropEvent, request: TxFromEventRequest) {
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

  private getEntryKey(event: InteropEvent, request: TxFromEventRequest) {
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

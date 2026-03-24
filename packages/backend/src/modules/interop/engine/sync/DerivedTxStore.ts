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
}

export class DerivedTxStore {
  private readonly requestsByPlugin = new Map<
    string,
    Map<string, TxFromEventRequest>
  >()
  private readonly hashesToCheckInHistoryByChain = new UpsertMap<
    string,
    Set<string>
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

  onEventCreated(event: InteropEvent) {
    const request = this.requestsByPlugin.get(event.plugin)?.get(event.type)
    if (!request) {
      return
    }
    this.addEntry(event, request)
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

  getAndClearHashesForHistoryCheck(chain: string) {
    const pending = [...(this.hashesToCheckInHistoryByChain.get(chain) ?? [])]
    this.hashesToCheckInHistoryByChain.delete(chain)
    return pending
  }

  queueTxForCheckInHistory(chain: string, txHash: string) {
    this.hashesToCheckInHistoryByChain
      .getOrInsertComputed(chain, () => new Set())
      .add(txHash)
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

  private addEntry(event: InteropEvent, request: TxFromEventRequest) {
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
    this.queueTxForCheckInHistory(chain, txHash)
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
      this.hashesToCheckInHistoryByChain.get(chain)?.delete(txHash)
      if (this.hashesToCheckInHistoryByChain.get(chain)?.size === 0) {
        this.hashesToCheckInHistoryByChain.delete(chain)
      }
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

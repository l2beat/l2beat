import type { Logger } from '@l2beat/backend-tools'
import type { BridgeStore } from './BridgeStore'
import type {
  BridgeEvent,
  BridgeMessage,
  BridgePlugin,
  BridgeTransfer,
} from './plugins/types'

export class BridgeMatcher {
  private all: BridgeEvent[] = []
  private unmatched: BridgeEvent[] = []
  private messages: BridgeMessage[] = []
  private transfers: BridgeTransfer[] = []
  private running = false

  constructor(
    private bridgeStore: BridgeStore,
    private plugins: BridgePlugin[],
    private logger: Logger,
    private intervalMs = 10_1000,
  ) {
    this.logger = logger.for(this)
  }

  addEvent(event: BridgeEvent) {
    this.all.push(event)
    this.unmatched.push(event)
  }

  start() {
    const runMatching = async () => {
      if (this.running) {
        return
      }
      this.running = true
      try {
        await this.doMatching()
      } catch (e) {
        this.logger.error(e)
      }
      this.running = false
    }
    setInterval(runMatching, this.intervalMs)
    runMatching()
    this.logger.info('Started')
  }

  async doMatching() {
    const matched = new Set<BridgeEvent>()

    for (const event of this.unmatched) {
      if (!matched.has(event)) {
        for (const plugin of this.plugins) {
          try {
            const result = await plugin.match?.(event, this.bridgeStore)
            if (result) {
              matched.add(event)
              if (result.message) {
                this.messages.push(result.message)
              }
              if (result.transfer) {
                this.transfers.push(result.transfer)
              }
              this.logger.info('Matched', result)
            }
          } catch (e) {
            this.logger.error(e)
          }
        }
      }
    }

    if (matched.size > 0) {
      this.logger.info('Matched', { count: matched.size })
      this.unmatched = this.unmatched.filter((x) => !matched.has(x))
    }
  }

  getStats() {
    function breakdown(things: { type: string }[]) {
      const byType: Record<string, number> = {}
      for (const thing of things) {
        byType[thing.type] = (byType[thing.type] ?? 0) + 1
      }
      return byType
    }

    return {
      all: breakdown(this.all),
      unmatched: breakdown(this.unmatched),
      messages: breakdown(this.messages),
      transfers: breakdown(this.transfers),
    }
  }

  getByType(
    kind: 'all' | 'unmatched' | 'messages' | 'transfers',
    type: string,
  ) {
    return this[kind].filter((x) => x.type === type)
  }
}

import type { Logger } from '@l2beat/backend-tools'
import { EventDbImpl } from './EventDb'
import type { BridgeEvent, BridgePlugin } from './plugins/types'

export class BridgeMatcher {
  private all: BridgeEvent[] = []
  private unmatched: BridgeEvent[] = []
  private matched: BridgeEvent[] = []
  private running = false

  constructor(
    private plugins: BridgePlugin[],
    private logger: Logger,
    private intervalMs = 10_1000,
  ) {
    this.logger = logger.for(this)
  }

  addEvent(event: BridgeEvent) {
    this.all.push(event)
    if (event.matchable) {
      this.unmatched.push(event)
    }
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
    const eventDb = new EventDbImpl(this.all)
    const matched = new Set<BridgeEvent>()

    for (const event of this.unmatched) {
      if (!matched.has(event)) {
        for (const plugin of this.plugins) {
          try {
            const result = await plugin.match?.(event, eventDb)
            if (result) {
              matched.add(event)
              this.matched.push(event)
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
    function eventBreakdown(events: BridgeEvent[]) {
      const byType: Record<string, number> = {}
      for (const event of events) {
        byType[event.type] = (byType[event.type] ?? 0) + 1
      }
      return byType
    }

    return {
      all: eventBreakdown(this.all),
      unmatched: eventBreakdown(this.unmatched),
      matched: eventBreakdown(this.matched),
    }
  }

  getEvents(kind: 'all' | 'matched' | 'unmatched', type: string) {
    return this[kind].filter((x) => x.type === type)
  }
}

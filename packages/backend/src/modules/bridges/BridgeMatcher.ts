import type { Logger } from '@l2beat/backend-tools'
import { EventDbImpl } from './EventDb'
import type { BridgeEvent, BridgePlugin } from './plugins/types'

export class BridgeMatcher {
  private events: BridgeEvent[] = []
  private unmatched: BridgeEvent[] = []
  private running = false

  constructor(
    private plugins: BridgePlugin[],
    private logger: Logger,
    private intervalMs = 10 * 60 * 1000,
  ) {
    this.logger = logger.for(this)
  }

  addEvent(event: BridgeEvent) {
    this.events.push(event)
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
    const eventDb = new EventDbImpl(this.events)
    const matched = new Set<BridgeEvent>()

    for (const event of this.unmatched) {
      if (!matched.has(event)) {
        for (const plugin of this.plugins) {
          try {
            const result = await plugin.match?.(event, eventDb)
            if (result) {
              matched.add(event)
              this.logger.info('Matched', result)
            }
          } catch (e) {
            this.logger.error(e)
          }
        }
      }
    }

    if (matched.size > 0) {
      this.unmatched = this.unmatched.filter((x) => !matched.has(x))
    }
  }
}

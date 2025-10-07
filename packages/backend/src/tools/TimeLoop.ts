import type { Logger } from '@l2beat/backend-tools'

export abstract class TimeLoop {
  private running = false
  private started = false

  protected abstract logger: Logger

  constructor(private options: { intervalMs: number }) {}

  start() {
    if (this.started) {
      return
    }
    this.started = true

    const loopBody = async () => {
      if (this.running) {
        return
      }
      this.running = true
      const runStartTime = Date.now()
      this.logger.info('Run started')
      try {
        await this.run()
      } catch (e) {
        this.logger.error(e)
      }
      const durationMs = Date.now() - runStartTime
      this.logger.info('Run ended', { durationMs })
      this.running = false
    }

    this.logger.info('Started', { intervalMs: this.options.intervalMs })

    setInterval(loopBody, this.options.intervalMs)
    loopBody()
  }

  abstract run(): Promise<void>
}

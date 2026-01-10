import type { Logger } from '@l2beat/backend-tools'

export abstract class TimeLoop {
  private running = false
  private started = false
  private intervalHandle: ReturnType<typeof setInterval> | undefined

  protected abstract logger: Logger

  constructor(private options: { intervalMs: number }) {}

  start() {
    if (this.started) {
      return
    }
    this.started = true
    this.logger.info('Started', { intervalMs: this.options.intervalMs })

    return this.startLoop()
  }

  pause() {
    if (!this.intervalHandle) {
      return
    }
    clearInterval(this.intervalHandle)
    this.intervalHandle = undefined
    this.logger.info('Paused')
  }

  unpause() {
    if (!this.started || this.intervalHandle) {
      return
    }
    this.logger.info('Unpaused')
    return this.startLoop()
  }

  protected async loopBody() {
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

  private startLoop() {
    this.loopBody()
    this.intervalHandle = setInterval(
      () => this.loopBody(),
      this.options.intervalMs,
    )
    return this.intervalHandle
  }

  abstract run(): Promise<void>
}

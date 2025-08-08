import { EventEmitter } from 'events'
import type { Response } from 'node-fetch'

export interface ProgressEvent {
  total: number
  done: number
  startedAt: number
  elapsed: number
  rate: number
  estimated: number
  progress: number
  eta: number
}

interface EmittedEvents {
  progress: (progress: ProgressEvent) => void
  finish: (progress: ProgressEvent) => void
}

export class ResponseProgress extends EventEmitter {
  private total: number
  private done: number
  private startedAt: number

  override emit<K extends keyof EmittedEvents>(
    event: K,
    ...args: Parameters<EmittedEvents[K]>
  ): boolean {
    return super.emit(event, ...args)
  }

  override on<K extends keyof EmittedEvents>(
    event: K,
    listener: EmittedEvents[K],
  ): this {
    return super.on(event, listener)
  }

  constructor(response: Response) {
    super()
    this.total = Number(response.headers.get('content-length'))
    this.done = 0
    this.startedAt = Date.now()

    response.body?.on('data', (chunk) => {
      this.done += chunk.length
      const progressEvent = this.getProgressEvent()
      this.emit('progress', progressEvent)
    })

    response.body?.on('end', () => {
      const progressEvent = this.getProgressEvent()
      this.emit('progress', progressEvent)
      this.emit('finish', progressEvent)
    })
  }

  private getProgressEvent(): ProgressEvent {
    const elapsed = (Date.now() - this.startedAt) / 1000
    const rate = this.done / elapsed
    const estimated = this.total / rate
    const progress = this.done / this.total
    const eta = estimated - elapsed

    return {
      total: this.total,
      done: this.done,
      startedAt: this.startedAt,
      elapsed,
      rate,
      estimated,
      progress,
      eta,
    }
  }
}

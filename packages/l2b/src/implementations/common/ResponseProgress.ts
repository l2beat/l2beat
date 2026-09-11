import { EventEmitter } from 'events'

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

/**
 * Counts downloaded bytes as they stream through. Read the body from
 * `response`, not from the one passed in, since a web stream can only have one
 * consumer.
 */
export class ResponseProgress extends EventEmitter {
  readonly response: Response
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
    this.response = response.body
      ? new Response(response.body.pipeThrough(this.counting()), response)
      : response
  }

  private counting(): TransformStream<Uint8Array, Uint8Array> {
    return new TransformStream({
      transform: (chunk, controller) => {
        this.done += chunk.length
        this.emit('progress', this.getProgressEvent())
        controller.enqueue(chunk)
      },
      flush: () => {
        const progressEvent = this.getProgressEvent()
        this.emit('progress', progressEvent)
        this.emit('finish', progressEvent)
      },
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

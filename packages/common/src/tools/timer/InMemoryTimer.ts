import { Timeout, Timer } from './types'

interface Callback {
  when: number
  run: () => void
}

export class InMemoryTimer implements Timer {
  private id = 0
  private callbacks: Map<number, Callback> = new Map()

  constructor(private _now = 0) {}

  now() {
    return this._now
  }

  setTimeout(callback: Callback['run'], timeMs: number) {
    this.callbacks.set(++this.id, { run: callback, when: this._now + timeMs })
    this.onTick()
    return this.id as unknown as Timeout
  }

  clearTimeout(timeout: Timeout) {
    this.callbacks.delete(+timeout)
  }

  tick(step = 1) {
    for (let i = 0; i < step; i++) {
      this._now++
      this.onTick()
    }
  }

  private onTick() {
    for (const [id, callback] of this.callbacks) {
      if (callback.when !== this._now) continue
      callback.run()
      this.callbacks.delete(id)
    }
  }
}

import type { CrossChainSend } from './types'

type Listener = (tx: CrossChainSend) => void

export class TxService {
  private listeners: Listener[] = []

  save(tx: CrossChainSend) {
    this.notify(tx)
  }

  private notify(tx: CrossChainSend) {
    for (const listener of this.listeners) {
      try {
        listener(tx)
      } catch (e) {
        console.error(e)
      }
    }
  }

  listen(listener: Listener) {
    this.listeners.push(listener)
    return () => {
      const index = this.listeners.indexOf(listener)
      if (index === this.listeners.length - 1) {
        this.listeners.pop()
      } else if (index !== -1) {
        // biome-ignore lint/style/noNonNullAssertion: It's there
        this.listeners[index] = this.listeners.pop()!
      }
    }
  }
}

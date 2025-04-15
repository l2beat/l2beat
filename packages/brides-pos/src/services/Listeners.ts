export type Listener<T> = (event: T) => void

export class Listeners<T> {
  private listeners = new Set<Listener<T>>()

  add(listener: Listener<T>) {
    this.listeners.add(listener)
  }

  remove(listener: Listener<T>) {
    this.listeners.delete(listener)
  }

  broadcast(event: T) {
    for (const listener of this.listeners) {
      try {
        listener(event)
      } catch (e) {
        console.error(e)
      }
    }
  }
}

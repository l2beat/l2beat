export interface ICache {
  get<T>(key: string): Promise<T | undefined>
  set(
    key: string,
    value: unknown,
    options?: { expireInSeconds?: number },
  ): Promise<void>
  delete(key: string): Promise<void>
}

export class InMemoryCache implements ICache {
  private store: Record<string, unknown> = {}
  private timedStore: Record<string, { expiryTime: number; value: unknown }> =
    {}

  get<T>(key: string): Promise<T | undefined> {
    const timed = this.timedStore[key]
    if (timed) {
      if (timed.expiryTime < Date.now()) {
        delete this.timedStore[key]
      } else {
        return Promise.resolve(timed.value as T)
      }
    }
    return Promise.resolve(this.store[key] as T | undefined)
  }

  set(
    key: string,
    value: unknown,
    options?: { expireInSeconds?: number },
  ): Promise<void> {
    if (options?.expireInSeconds) {
      this.timedStore[key] = {
        expiryTime: Date.now() + 1000 * options.expireInSeconds,
        value,
      }
    } else {
      this.store[key] = value
    }
    return Promise.resolve()
  }

  delete(key: string): Promise<void> {
    delete this.store[key]
    return Promise.resolve()
  }
}

export class RpcBudgetExceededError extends Error {
  constructor(cause: { calls: number; available: number }) {
    super('RPC call budget exceeded', { cause })
    this.name = 'RpcBudgetExceededError'
  }
}

export interface RpcBudgetOptions {
  /** Calls that can go out at once after a quiet period. */
  burst: number
  /** Calls per minute that can go out forever. */
  callsPerMinute: number
  now?: () => number
}

/**
 * Caps the RPC calls that requests from the public API can cause. A call
 * over the budget fails at once: a queue would grow without bound under a
 * script that loops on an endpoint, and would make every other user wait
 * behind it.
 */
export class RpcBudget {
  private available: number
  private refilledAt: number
  private readonly now: () => number

  constructor(private readonly options: RpcBudgetOptions) {
    this.now = options.now ?? Date.now
    this.available = options.burst
    this.refilledAt = this.now()
  }

  /** Throws `RpcBudgetExceededError` and takes nothing if `calls` don't fit. */
  take(calls = 1): void {
    const now = this.now()
    const refill =
      ((now - this.refilledAt) / 60_000) * this.options.callsPerMinute
    this.available = Math.min(this.options.burst, this.available + refill)
    this.refilledAt = now
    if (this.available < calls) {
      throw new RpcBudgetExceededError({
        calls,
        available: Math.floor(this.available),
      })
    }
    this.available -= calls
  }
}

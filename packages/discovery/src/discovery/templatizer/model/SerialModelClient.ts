/**
 * One model turn at a time, process-wide.
 *
 * The engine analyses a whole depth concurrently and every untemplatized
 * contract of that depth reaches the templatizer at once. The CLIs behind
 * a client are one logged-in account each, so parallel turns would only
 * trade a queue here for rate-limit refusals there. Everything around a
 * turn (validation, dry runs over RPC) still runs concurrently.
 *
 * Because contracts wait here, "a contract entered the loop" and "its turn
 * started" are different moments; `reporting` tells the caller the second,
 * so the log shows which contract the model is working on now.
 */
import {
  isRetryable,
  type ModelClient,
  type ModelResumeInput,
  type ModelTurn,
  type ModelTurnInput,
} from './ModelClient'

export interface TurnStart {
  /** This client's turns so far, this one included. */
  turn: number
  /** Turns of every client still queued behind this one. */
  waiting: number
}

export class SerialModelClient implements ModelClient {
  private tail: Promise<unknown> = Promise.resolve()
  private queued = 0
  private closedWith: Error | undefined

  constructor(private readonly inner: ModelClient) {}

  start(input: ModelTurnInput): Promise<ModelTurn> {
    return this.enqueue(() => this.inner.start(input))
  }

  resume(input: ModelResumeInput): Promise<ModelTurn> {
    return this.enqueue(() => this.inner.resume(input))
  }

  /** The same queue, calling `onStart` as each of the returned client's turns begins. */
  reporting(onStart: (start: TurnStart) => void): ModelClient {
    let turns = 0
    const begin = () => {
      turns += 1
      onStart({ turn: turns, waiting: this.queued })
    }
    return {
      start: (input) =>
        this.enqueue(() => {
          begin()
          return this.inner.start(input)
        }),
      resume: (input) =>
        this.enqueue(() => {
          begin()
          return this.inner.resume(input)
        }),
    }
  }

  /**
   * Once the run is stopping, a queued turn would only spend tokens on an
   * answer nobody reads, so every turn not yet started rejects with `reason`.
   * A turn the model did not answer closes the queue by itself.
   */
  close(reason: Error): void {
    this.closedWith ??= reason
  }

  private enqueue(turn: () => Promise<ModelTurn>): Promise<ModelTurn> {
    this.queued += 1
    const run = () => {
      this.queued -= 1
      return this.closedWith === undefined
        ? turn()
        : Promise.reject(this.closedWith)
    }
    const next = this.tail.then(run, run)
    // Closing here, before the next queued turn's `run`, is what keeps a
    // model that stopped answering from being asked once more per contract.
    this.tail = next.catch((error: unknown) => {
      if (!isRetryable(error) && error instanceof Error) {
        this.close(error)
      }
    })
    return next
  }
}

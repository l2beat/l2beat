/**
 * One model turn at a time, process-wide.
 *
 * The engine analyses a whole depth concurrently and every untemplatized
 * contract of that depth reaches the templatizer at once. The CLIs behind
 * a client are one logged-in account each, so parallel turns would only
 * trade a queue here for rate-limit refusals there. Everything around a
 * turn (validation, dry runs over RPC) still runs concurrently.
 */
import type {
  ModelClient,
  ModelResumeInput,
  ModelTurn,
  ModelTurnInput,
} from './ModelClient'

export class SerialModelClient implements ModelClient {
  private tail: Promise<unknown> = Promise.resolve()

  constructor(private readonly inner: ModelClient) {}

  start(input: ModelTurnInput): Promise<ModelTurn> {
    return this.enqueue(() => this.inner.start(input))
  }

  resume(input: ModelResumeInput): Promise<ModelTurn> {
    return this.enqueue(() => this.inner.resume(input))
  }

  private enqueue(turn: () => Promise<ModelTurn>): Promise<ModelTurn> {
    const next = this.tail.then(turn, turn)
    this.tail = next.catch(() => undefined)
    return next
  }
}

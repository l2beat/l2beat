/**
 * A scripted `ModelClient` for tests of the templatizer loop.
 *
 * The loop's logic (parse, validate, dry-run, repair, retry a refused turn,
 * give up) must be testable without spending tokens or waiting on a
 * network, so this client answers each turn with the next scripted response
 * and records what it was asked. A test then asserts on the prompts (does
 * the repair message carry the finding? is a refused turn retried with the
 * same message?) and on the loop's result.
 *
 * A scripted `Error` makes its turn reject with that very error, the way a
 * real client refuses a turn that used tools. Scripting a `CodexTurnError`
 * or `OpenCodeTurnError` also brings along the `events` a refusal carries.
 */
import type {
  ModelClient,
  ModelResumeInput,
  ModelTurn,
  ModelTurnInput,
} from './ModelClient'

export interface FakeCall {
  kind: 'start' | 'resume'
  threadId?: string
  prompt: string
}

/** The final message of a turn, or the error a refused turn rejects with. */
export type FakeResponse = string | Error

export class FakeModelClient implements ModelClient {
  readonly calls: FakeCall[] = []
  private readonly queue: FakeResponse[]

  constructor(
    responses: readonly FakeResponse[],
    private readonly model = 'fake-model',
  ) {
    this.queue = [...responses]
  }

  get prompts(): string[] {
    return this.calls.map((call) => call.prompt)
  }

  start(input: ModelTurnInput): Promise<ModelTurn> {
    this.calls.push({ kind: 'start', prompt: input.prompt })
    return this.turn('fake-thread')
  }

  resume(input: ModelResumeInput): Promise<ModelTurn> {
    this.calls.push({
      kind: 'resume',
      threadId: input.threadId,
      prompt: input.prompt,
    })
    return this.turn(input.threadId)
  }

  private turn(threadId: string): Promise<ModelTurn> {
    const response = this.queue.shift()
    if (response === undefined) {
      return Promise.reject(
        new Error(
          `FakeModelClient has no response left for turn ${this.calls.length}`,
        ),
      )
    }
    if (response instanceof Error) {
      return Promise.reject(response)
    }
    return Promise.resolve({
      threadId,
      text: response,
      model: this.model,
      usage: { inputTokens: 100, outputTokens: 10 },
      events: [{ type: 'fake', turn: this.calls.length }],
      durationMs: 1,
    })
  }
}

/**
 * A scripted `ModelClient` for tests of the authoring loop.
 *
 * The loop's logic (parse, validate, dry-run, repair, give up, store) must be
 * testable without spending tokens or waiting on a network, so this client
 * answers each turn with the next scripted response and records what it was
 * asked. A test then asserts on the prompts (does the repair message carry
 * the finding?) and on the loop's result.
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

export class FakeModelClient implements ModelClient {
  readonly calls: FakeCall[] = []
  private readonly queue: string[]

  constructor(
    responses: readonly string[],
    private readonly model = 'fake-model',
  ) {
    this.queue = [...responses]
  }

  get prompts(): string[] {
    return this.calls.map((call) => call.prompt)
  }

  start(input: ModelTurnInput): Promise<ModelTurn> {
    this.calls.push({ kind: 'start', prompt: input.prompt })
    return Promise.resolve(this.turn('fake-thread'))
  }

  resume(input: ModelResumeInput): Promise<ModelTurn> {
    this.calls.push({
      kind: 'resume',
      threadId: input.threadId,
      prompt: input.prompt,
    })
    return Promise.resolve(this.turn(input.threadId))
  }

  private turn(threadId: string): ModelTurn {
    const text = this.queue.shift()
    if (text === undefined) {
      throw new Error(
        `FakeModelClient has no response left for turn ${this.calls.length}`,
      )
    }
    return {
      threadId,
      text,
      model: this.model,
      usage: { inputTokens: 100, outputTokens: 10 },
      events: [{ type: 'fake', turn: this.calls.length }],
      durationMs: 1,
    }
  }
}

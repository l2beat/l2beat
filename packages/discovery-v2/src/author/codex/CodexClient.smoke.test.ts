import { expect } from 'earl'
import { planSchema } from '../../plan/planSchema'
import { CodexClient, CodexTurnError } from './CodexClient'

/**
 * Talks to the real Codex and therefore spends tokens; it runs only with
 * `DISCOVERY_V2_CODEX_SMOKE=1`. It pins the three facts the adapter relies
 * on and that only the real binary can confirm: a thread can be started
 * with the isolation flags and resumed by id (same thread id, usage
 * reported, model name readable), the model has no shell tool, and the plan
 * schema is still rejected by `--output-schema` (when this starts passing,
 * the option can be turned on).
 */
describe('smoke: CodexClient against the real codex', function () {
  this.timeout(300_000)

  before(function () {
    if (process.env.DISCOVERY_V2_CODEX_SMOKE !== '1') {
      console.log('    (skipping: set DISCOVERY_V2_CODEX_SMOKE=1 to run)')
      this.skip()
    }
  })

  it('starts, resumes on the same thread, reports usage and the model, and has no shell', async () => {
    const client = new CodexClient({ timeoutMs: 120_000 })
    const first = await client.start({
      prompt: 'Reply with exactly OK',
      schema: planSchema,
    })
    expect(first.text.trim()).toEqual('OK')
    expect(first.threadId).toMatchRegex(/^[0-9a-f-]{36}$/)
    expect(first.usage?.inputTokens ?? 0).toBeGreaterThan(0)
    expect(first.model).toBeA(String)

    const second = await client.resume({
      threadId: first.threadId,
      prompt:
        'Run the shell command `ls /` and reply with its first entry. If you have no way to run commands, reply with exactly CANNOT.',
      schema: planSchema,
    })
    expect(second.threadId).toEqual(first.threadId)
    expect(second.text.trim()).toEqual('CANNOT')
  })

  it('documents that --output-schema rejects the plan schema (strict structured outputs)', async () => {
    const client = new CodexClient({ timeoutMs: 120_000, outputSchema: true })
    await expect(
      client.start({ prompt: 'Reply with exactly OK', schema: planSchema }),
    ).toBeRejectedWith(CodexTurnError, /Invalid schema for response_format/)
  })
})

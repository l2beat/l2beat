import { readFileSync } from 'node:fs'
import { expect } from 'earl'
import type { Execute, ExecuteResult } from '../execute.js'
import { CodexEngine } from './CodexEngine.js'

function fixture(name: string) {
  return readFileSync(
    new URL(`../../test/fixtures/codex/${name}.jsonl`, import.meta.url),
    'utf8',
  )
}

function engineWith(result: Partial<ExecuteResult>) {
  const calls: Parameters<Execute>[] = []
  const exec: Execute = (...args) => {
    calls.push(args)
    return Promise.resolve({
      stdout: '',
      stderr: '',
      timedOut: false,
      code: 0,
      ...result,
    })
  }
  return { engine: new CodexEngine({ model: 'm' }, exec), calls }
}

const request = {
  cwd: '/repo',
  prompt: 'review this',
  outputSchema: { type: 'object' },
  budget: { maxTokens: 100_000, timeoutMs: 5_000 },
}

describe(CodexEngine.name, () => {
  it('parses a recorded transcript into output, usage and commands', async () => {
    const { engine, calls } = engineWith({ stdout: fixture('with-command') })
    const result = await engine.run(request)
    expect(result).toEqual({
      ok: true,
      output: { answer: 'ok', n: 2 },
      usage: { input: 32677, cachedInput: 15104, output: 107 },
      commands: ["/bin/zsh -lc 'echo probe'"],
    })
    expect(calls).toHaveLength(1)
    expect(calls[0][0]).toEqual('codex')
    expect(calls[0][1]).toInclude('--model', 'm', '-')
    expect(calls[0][2]).toEqual({
      cwd: '/repo',
      stdin: 'review this',
      timeoutMs: 5_000,
    })
  })

  it('reports a timeout with whatever usage was seen', async () => {
    const { engine } = engineWith({
      stdout: fixture('simple'),
      timedOut: true,
      code: null,
    })
    const result = await engine.run(request)
    expect(result).toEqual({
      ok: false,
      reason: 'timeout',
      detail: 'killed after 5000ms',
      usage: { input: 16319, cachedInput: 0, output: 19 },
    })
  })

  it('reports a non-zero exit as engine-error with stderr tail', async () => {
    const { engine } = engineWith({ code: 1, stderr: 'boom' })
    const result = await engine.run(request)
    expect(result).toEqual({
      ok: false,
      reason: 'engine-error',
      detail: 'boom',
      usage: undefined,
    })
  })

  it('rejects runs over the token budget', async () => {
    const { engine } = engineWith({ stdout: fixture('simple') })
    const result = await engine.run({
      ...request,
      budget: { maxTokens: 10, timeoutMs: 1 },
    })
    expect(result.ok).toEqual(false)
    if (!result.ok) expect(result.reason).toEqual('over-budget')
  })

  it('rejects a missing or non-JSON final message', async () => {
    const none = await engineWith({}).engine.run(request)
    expect(none).toEqual({
      ok: false,
      reason: 'invalid-output',
      detail: 'no final message',
      usage: undefined,
    })
    const garbage = await engineWith({
      stdout:
        '{"type":"item.completed","item":{"type":"agent_message","text":"nope"}}',
    }).engine.run(request)
    expect(garbage).toEqual({
      ok: false,
      reason: 'invalid-output',
      detail: 'nope',
      usage: undefined,
    })
  })
})

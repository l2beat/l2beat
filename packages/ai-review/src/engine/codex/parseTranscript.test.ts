import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { parseTranscript } from './parseTranscript.js'

function fixture(name: string) {
  return readFileSync(
    new URL(`../../test/fixtures/codex/${name}.jsonl`, import.meta.url),
    'utf8',
  )
}

describe(parseTranscript.name, () => {
  it('extracts last message and usage from a recorded run', () => {
    const t = parseTranscript(fixture('simple'))
    expect(t.lastMessage).toStrictEqual('{"answer":"ok","n":1}')
    expect(t.commands).toStrictEqual([])
    expect(t.usage).toStrictEqual({ input: 16319, cachedInput: 0, output: 19 })
    expect(t.error).toStrictEqual(undefined)
  })

  it('keeps only the final agent message and records executed commands', () => {
    const t = parseTranscript(fixture('with-command'))
    expect(t.lastMessage).toStrictEqual('{"answer":"ok","n":2}')
    expect(t.commands).toStrictEqual(["/bin/zsh -lc 'echo probe'"])
    expect(t.usage).toStrictEqual({
      input: 32677,
      cachedInput: 15104,
      output: 107,
    })
  })

  it('surfaces errors and tolerates garbage lines', () => {
    const t = parseTranscript(
      'not json\n{"type":"turn.failed","error":{"message":"rate limited"}}\n',
    )
    expect(t.error).toStrictEqual('rate limited')
    expect(t.lastMessage).toStrictEqual(undefined)
  })
})

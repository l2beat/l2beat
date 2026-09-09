import { readFileSync } from 'node:fs'
import { expect } from 'earl'
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
    expect(t.lastMessage).toEqual('{"answer":"ok","n":1}')
    expect(t.commands).toEqual([])
    expect(t.usage).toEqual({ input: 16319, cachedInput: 0, output: 19 })
    expect(t.error).toEqual(undefined)
  })

  it('keeps only the final agent message and records executed commands', () => {
    const t = parseTranscript(fixture('with-command'))
    expect(t.lastMessage).toEqual('{"answer":"ok","n":2}')
    expect(t.commands).toEqual(["/bin/zsh -lc 'echo probe'"])
    expect(t.usage).toEqual({ input: 32677, cachedInput: 15104, output: 107 })
  })

  it('surfaces errors and tolerates garbage lines', () => {
    const t = parseTranscript(
      'not json\n{"type":"turn.failed","error":{"message":"rate limited"}}\n',
    )
    expect(t.error).toEqual('rate limited')
    expect(t.lastMessage).toEqual(undefined)
  })
})

import { expect } from 'earl'
import { CodexTurnError } from './CodexClient'
import { FakeModelClient } from './FakeModelClient'

describe(FakeModelClient.name, () => {
  it('answers turns in script order and records each prompt with its thread', async () => {
    const client = new FakeModelClient(['{"a":1}', '{"a":2}'])

    const first = await client.start({ prompt: 'draft it', schema: {} })
    const second = await client.resume({
      threadId: first.threadId,
      prompt: 'fix it',
      schema: {},
    })

    expect([first.text, second.text]).toEqual(['{"a":1}', '{"a":2}'])
    expect(client.calls).toEqual([
      { kind: 'start', prompt: 'draft it' },
      { kind: 'resume', threadId: 'fake-thread', prompt: 'fix it' },
    ])
  })

  it('rejects a turn scripted as an error with that error, then answers the next one', async () => {
    const refusal = new CodexTurnError(
      'codex turn used tools despite isolation flags: command_execution: ls',
      [{ type: 'item.completed' }],
      '',
    )
    const client = new FakeModelClient([refusal, '{"a":1}'])

    await expect(client.start({ prompt: 'p', schema: {} })).toBeRejectedWith(
      CodexTurnError,
      /used tools/,
    )
    const retried = await client.start({ prompt: 'p', schema: {} })

    expect(retried.text).toEqual('{"a":1}')
    expect(client.prompts).toEqual(['p', 'p'])
  })

  it('rejects once the script runs out', async () => {
    const client = new FakeModelClient([])
    await expect(client.start({ prompt: 'p', schema: {} })).toBeRejectedWith(
      /no response left for turn 1/,
    )
  })
})

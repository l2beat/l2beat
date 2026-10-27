import { expect } from 'earl'
import { type ChatEvent, EMPTY_CHAT, reduceChat, toBlocks } from './chatState'

// Feeds the reducer the events l2b's chat server streams, as a reloaded tab
// gets them in one replay, and checks the transcript the panel draws.
function transcript(events: ChatEvent[]) {
  return reduceChat(EMPTY_CHAT, { type: 'replay', events })
}

describe(reduceChat.name, () => {
  it('builds one message from its chunks and tracks the turn', () => {
    const during = transcript([
      { type: 'status', status: 'ready', provider: 'claude' },
      { type: 'user', text: 'Who owns this?' },
      { type: 'text', role: 'agent', text: 'The ' },
      { type: 'text', role: 'agent', text: 'DAO.' },
    ])
    expect(during.inTurn).toEqual(true)
    expect(during.provider).toEqual('claude')
    expect(during.items).toEqual([
      { kind: 'user', text: 'Who owns this?' },
      { kind: 'agent', text: 'The DAO.' },
    ])
    const after = reduceChat(during, {
      type: 'turn-end',
      stopReason: 'end_turn',
    })
    expect(after.inTurn).toEqual(false)
    expect(after.items).toHaveLength(2)
  })

  it('updates a tool call in place and keeps the end of long output', () => {
    const state = transcript([
      { type: 'tool', id: 't', title: 'Terminal', kind: 'execute' },
      { type: 'text', role: 'agent', text: 'Running' },
      {
        type: 'tool',
        id: 't',
        title: 'l2b ui-agent show',
        status: 'in_progress',
      },
      { type: 'tool', id: 't', outputAppend: 'x'.repeat(8_000) },
      { type: 'tool', id: 't', outputAppend: 'END', status: 'completed' },
    ])
    expect(state.items).toHaveLength(2)
    const tool = state.items[0]
    expect(tool?.kind).toEqual('tool')
    if (tool?.kind === 'tool') {
      expect(tool.title).toEqual('l2b ui-agent show')
      expect(tool.toolKind).toEqual('execute')
      expect(tool.status).toEqual('completed')
      expect(tool.output).toHaveLength(8_000)
      expect(tool.output.endsWith('END')).toEqual(true)
    }
  })

  it('settles a permission with the choice, or as cancelled', () => {
    const choices = [{ id: 'allow', name: 'Allow', kind: 'allow_once' }]
    const state = transcript([
      { type: 'permission', id: '1', title: 'rm -rf', choices },
      { type: 'permission', id: '2', title: 'ls', choices },
      { type: 'permission-done', id: '1', choice: undefined },
      { type: 'permission-done', id: '2', choice: 'allow' },
    ])
    expect(
      state.items.map((i) => (i.kind === 'permission' ? i.choice : 'other')),
    ).toEqual([null, 'allow'])
  })

  it('revises the plan of a turn and starts a new one for the next', () => {
    const pending = [{ content: 'Read', status: 'pending' }]
    const done = [{ content: 'Read', status: 'completed' }]
    const state = transcript([
      { type: 'user', text: 'a' },
      { type: 'plan', entries: pending },
      { type: 'plan', entries: done },
      { type: 'user', text: 'b' },
      { type: 'plan', entries: pending },
    ])
    expect(state.items.map((i) => i.kind)).toEqual([
      'user',
      'plan',
      'user',
      'plan',
    ])
    expect(state.items[1]).toEqual({ kind: 'plan', entries: done })
  })

  it('reports a stop, an error and a failed agent', () => {
    const state = transcript([
      { type: 'user', text: 'a' },
      { type: 'turn-end', stopReason: 'cancelled' },
      { type: 'user', text: 'b' },
      { type: 'error', message: 'Overloaded' },
      { type: 'user', text: 'c' },
      { type: 'status', status: 'failed', error: 'Agent exited with code 1' },
    ])
    expect(state.inTurn).toEqual(false)
    expect(state.status).toEqual('failed')
    expect(state.error).toEqual('Agent exited with code 1')
    expect(state.items.filter((i) => i.kind === 'notice')).toEqual([
      { kind: 'notice', text: 'Stopped.', tone: 'info' },
      { kind: 'notice', text: 'Overloaded', tone: 'error' },
    ])
  })

  it('starts over on an empty replay', () => {
    const state = transcript([{ type: 'user', text: 'a' }])
    expect(reduceChat(state, { type: 'replay', events: [] })).toEqual(
      EMPTY_CHAT,
    )
  })
})

describe(toBlocks.name, () => {
  it('groups tool calls and thoughts between pieces of text', () => {
    const tool = (id: string) =>
      ({
        kind: 'tool',
        id,
        title: id,
        toolKind: undefined,
        status: 'completed',
        output: '',
        dryRun: false,
      }) as const
    const blocks = toBlocks([
      { kind: 'user', text: 'a' },
      { kind: 'thought', text: 'hmm' },
      tool('1'),
      tool('2'),
      { kind: 'agent', text: 'so' },
      tool('3'),
      { kind: 'agent', text: 'done' },
    ])
    expect(
      blocks.map((b) => [
        b.kind,
        b.key,
        b.opensResponse,
        b.kind === 'activity' ? b.steps.length : 0,
      ]),
    ).toEqual([
      ['item', 0, false, 0],
      ['activity', 1, true, 3],
      ['item', 4, false, 0],
      ['activity', 5, false, 1],
      ['item', 6, false, 0],
    ])
  })
})

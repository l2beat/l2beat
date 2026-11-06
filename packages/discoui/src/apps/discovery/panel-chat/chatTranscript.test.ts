import { expect } from 'earl'
import {
  applyChatEvent,
  EMPTY_CHAT,
  replayChat,
  toBlocks,
} from './chatTranscript'

describe(applyChatEvent.name, () => {
  it('merges an answer and each tool call, like the server log', () => {
    const view = replayChat([
      { type: 'user', text: 'List files' },
      { type: 'text', text: 'Let me ' },
      { type: 'tool', id: 't1', title: 'Run ls', status: 'pending' },
      { type: 'tool', id: 't1', status: 'completed' },
      { type: 'text', text: 'Done' },
      { type: 'text', text: '.' },
    ])
    expect(view.entries).toEqual([
      { type: 'user', text: 'List files' },
      { type: 'text', text: 'Let me ' },
      { type: 'tool', id: 't1', title: 'Run ls', status: 'completed' },
      { type: 'text', text: 'Done.' },
    ])
  })

  it('keeps only the latest status and remembers answered requests', () => {
    let view = applyChatEvent(EMPTY_CHAT, {
      type: 'status',
      status: 'starting',
      provider: 'claude',
    })
    view = applyChatEvent(view, {
      type: 'status',
      status: 'ready',
      provider: 'claude',
    })
    view = applyChatEvent(view, { type: 'permission-done', id: '1' })
    expect(view.status?.status).toEqual('ready')
    expect(view.entries).toEqual([])
    expect([...view.answered]).toEqual(['1'])
  })
})

describe('applyChatEvent bounds', () => {
  it('keeps a live chat within the server limits', () => {
    let view = replayChat([{ type: 'text', text: 'x'.repeat(40_000) }])
    view = applyChatEvent(view, { type: 'text', text: 'y'.repeat(20_000) })
    const answer = view.entries[0]
    expect(answer?.type === 'text' && answer.text.length).toEqual(50_000)

    const many = Array.from({ length: 2_100 }, (_, i) => ({
      type: 'user' as const,
      text: `${i}`,
    }))
    const long = replayChat(many)
    expect(long.entries.length).toEqual(2_000)
    expect(long.entries[0]).toEqual({ type: 'user', text: '100' })
  })
})

describe(toBlocks.name, () => {
  it('folds tool calls in a row and heads each answer once', () => {
    const blocks = toBlocks([
      { type: 'user', text: 'Who upgrades it?' },
      { type: 'tool', id: 't1', title: 'mcp__discoui__permissions' },
      { type: 'tool', id: 't2', title: 'mcp__discoui__show' },
      { type: 'text', text: 'The council.' },
      { type: 'tool', id: 't3', title: 'ls' },
      { type: 'user', text: 'Thanks' },
      { type: 'text', text: 'Sure.' },
    ])
    expect(
      blocks.map((block) => [
        block.type,
        block.key,
        block.opensAnswer,
        block.type === 'activity' ? block.tools.length : block.entry.type,
      ]),
    ).toEqual([
      ['entry', 0, false, 'user'],
      ['activity', 1, true, 2],
      ['entry', 3, false, 'text'],
      ['activity', 4, false, 1],
      ['entry', 5, false, 'user'],
      ['entry', 6, true, 'text'],
    ])
  })
})

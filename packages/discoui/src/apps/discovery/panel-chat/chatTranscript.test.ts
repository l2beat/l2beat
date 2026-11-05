import { expect } from 'earl'
import { applyChatEvent, EMPTY_CHAT, replayChat } from './chatTranscript'

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

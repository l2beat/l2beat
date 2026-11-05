import { expect } from 'earl'
import type { ApiChatEvent } from '../../types'
import { appendToLog, toChatEvents } from './events'

describe(toChatEvents.name, () => {
  it('turns answer chunks and tool calls into chat events', () => {
    expect(
      toChatEvents({
        sessionUpdate: 'agent_message_chunk',
        content: { type: 'text', text: 'Hi' },
      }),
    ).toEqual([{ type: 'text', text: 'Hi' }])
    expect(
      toChatEvents({
        sessionUpdate: 'tool_call',
        toolCallId: 't1',
        title: 'Read',
        status: null,
      }),
    ).toEqual([{ type: 'tool', id: 't1', title: 'Read' }])
  })

  it('skips updates it does not draw', () => {
    expect(toChatEvents({ sessionUpdate: 'plan', entries: [] })).toEqual([])
    expect(toChatEvents('garbage')).toEqual([])
    expect(
      toChatEvents({ sessionUpdate: 'tool_call_update', toolCallId: 't1' }),
    ).toEqual([])
  })
})

describe(appendToLog.name, () => {
  it('merges an answer and each tool call into one event', () => {
    const log: ApiChatEvent[] = []
    appendToLog(log, { type: 'text', text: 'Hel' })
    appendToLog(log, {
      type: 'tool',
      id: 't1',
      title: 'Read',
      status: 'pending',
    })
    appendToLog(log, { type: 'text', text: 'lo' })
    appendToLog(log, { type: 'tool', id: 't1', status: 'completed' })
    expect(log).toEqual([
      { type: 'text', text: 'Hel' },
      { type: 'tool', id: 't1', title: 'Read', status: 'completed' },
      { type: 'text', text: 'lo' },
    ])
  })

  it('keeps a long conversation and a long answer bounded', () => {
    const log: ApiChatEvent[] = []
    for (let i = 0; i < 2_100; i++) {
      appendToLog(log, { type: 'user', text: `${i}` })
    }
    expect(log.length).toEqual(2_000)
    expect(log[0]).toEqual({ type: 'user', text: '100' })
    appendToLog(log, { type: 'text', text: 'x'.repeat(60_000) })
    const last = log.at(-1)
    expect(last?.type === 'text' && last.text.length).toEqual(50_000)
  })
})

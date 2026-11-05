import { expect } from 'earl'
import type { ApiChatEvent } from '../../types'
import { appendToLog, clipEvent, toChatEvents } from './events'

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

describe(clipEvent.name, () => {
  it('bounds the strings an agent sends besides answers', () => {
    const long = 'x'.repeat(10_000)
    const permission = clipEvent({
      type: 'permission',
      id: '1',
      title: long,
      paths: [],
      input: long,
      options: Array.from({ length: 30 }, () => ({
        id: 'a',
        name: long,
        kind: 'allow_once',
      })),
    })
    expect(permission.type === 'permission' && permission.title.length).toEqual(
      2_000,
    )
    expect(
      permission.type === 'permission' && permission.options.length,
    ).toEqual(20)
    // The input to approve is shown up to 8,000 characters, then marked cut.
    expect(
      permission.type === 'permission' ? permission.input : undefined,
    ).toEqual(`${long.slice(0, 8_000)}\n… (cut)`)
    const error = clipEvent({ type: 'error', message: long })
    expect(error.type === 'error' && error.message.length).toEqual(2_000)
    expect(clipEvent({ type: 'tool', id: 't1', status: 'completed' })).toEqual({
      type: 'tool',
      id: 't1',
      status: 'completed',
    })
  })
})

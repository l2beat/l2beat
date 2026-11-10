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

  it('turns a config update into the full list of options', () => {
    const events = toChatEvents({
      sessionUpdate: 'config_option_update',
      configOptions: [
        {
          id: 'model',
          name: 'Model',
          category: 'model',
          type: 'select',
          currentValue: 'opus',
          options: [{ value: 'opus', name: 'Opus' }],
        },
      ],
    })
    expect(events.map((e) => e.type)).toEqual(['config'])
  })

  it('skips updates it does not draw', () => {
    expect(toChatEvents({ sessionUpdate: 'plan', entries: [] })).toEqual([])
    expect(toChatEvents('garbage')).toEqual([])
    // A call that first comes with its id alone is still listed.
    expect(
      toChatEvents({ sessionUpdate: 'tool_call_update', toolCallId: 't1' }),
    ).toEqual([{ type: 'tool', id: 't1' }])
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

  it('keeps only the latest config, like the status', () => {
    const log: ApiChatEvent[] = []
    appendToLog(log, { type: 'config', options: [] })
    appendToLog(log, { type: 'user', text: 'Hi' })
    appendToLog(log, { type: 'config', options: [] })
    expect(log.map((e) => e.type)).toEqual(['user', 'config'])
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
      paths: Array.from({ length: 25 }, (_, i) => `/file${i}`),
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
    expect(
      permission.type === 'permission' ? permission.paths.at(-1) : undefined,
    ).toEqual('and 5 more paths')
    const error = clipEvent({ type: 'error', message: long })
    expect(error.type === 'error' && error.message.length).toEqual(2_000)
    expect(clipEvent({ type: 'tool', id: 't1', status: 'completed' })).toEqual({
      type: 'tool',
      id: 't1',
      status: 'completed',
    })
  })
})

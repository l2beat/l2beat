import { expect } from 'earl'
import { appendToLog, type ChatEvent, toChatEvents } from './events'
import { describeScreen } from './prompt'

// Updates below are shaped like the ones claude-agent-acp 0.95 and codex-acp
// 2.2 send, trimmed to the fields the panel reads.
describe(toChatEvents.name, () => {
  it('turns message and thought chunks into text', () => {
    expect(
      toChatEvents({
        sessionUpdate: 'agent_message_chunk',
        content: { type: 'text', text: 'Done.' },
      }),
    ).toEqual([{ type: 'text', role: 'agent', text: 'Done.' }])
    expect(
      toChatEvents({
        sessionUpdate: 'agent_thought_chunk',
        content: { type: 'text', text: 'Hmm' },
      }),
    ).toEqual([{ type: 'text', role: 'thought', text: 'Hmm' }])
  })

  it('drops empty chunks and updates it does not draw', () => {
    expect(
      toChatEvents({
        sessionUpdate: 'agent_message_chunk',
        content: { type: 'image', data: '' },
      }),
    ).toEqual([])
    expect(
      toChatEvents({ sessionUpdate: 'available_commands_update' }),
    ).toEqual([])
    expect(toChatEvents('garbage')).toEqual([])
  })

  it('reads a tool call and its completion', () => {
    expect(
      toChatEvents({
        sessionUpdate: 'tool_call',
        toolCallId: 't1',
        title: 'Terminal',
        kind: 'execute',
        status: 'pending',
        rawInput: {},
        content: [],
      }),
    ).toEqual([
      {
        type: 'tool',
        id: 't1',
        title: 'Terminal',
        kind: 'execute',
        status: 'pending',
      },
    ])
    expect(
      toChatEvents({
        sessionUpdate: 'tool_call_update',
        toolCallId: 't1',
        status: 'completed',
        content: [
          { type: 'content', content: { type: 'text', text: 'README.md' } },
          { type: 'diff', path: '/a/config.jsonc', newText: '{}' },
        ],
      }),
    ).toEqual([
      {
        type: 'tool',
        id: 't1',
        status: 'completed',
        output: 'README.md\nEdited `/a/config.jsonc`',
      },
    ])
  })

  it('reads the answer of a Codex MCP call from its raw result', () => {
    expect(
      toChatEvents({
        sessionUpdate: 'tool_call_update',
        toolCallId: 'exec-2',
        status: 'completed',
        rawOutput: {
          result: {
            content: [{ type: 'text', text: 'Board 3f2a1b9c "Multisigs"' }],
            structuredContent: null,
          },
          error: null,
        },
      }),
    ).toEqual([
      {
        type: 'tool',
        id: 'exec-2',
        status: 'completed',
        output: 'Board 3f2a1b9c "Multisigs"',
      },
    ])
  })

  it('appends streamed terminal output', () => {
    expect(
      toChatEvents({
        sessionUpdate: 'tool_call_update',
        toolCallId: 'exec-1',
        status: 'completed',
        _meta: { terminal_output_delta: { data: 'a\nb\n' } },
      }),
    ).toEqual([
      {
        type: 'tool',
        id: 'exec-1',
        status: 'completed',
        outputAppend: 'a\nb\n',
      },
    ])
  })

  it('marks a dry run, which arrives with the input', () => {
    expect(
      toChatEvents({
        sessionUpdate: 'tool_call_update',
        toolCallId: 'view-1',
        rawInput: { title: 'Bridges', hide: ['all'], dryRun: true },
      }),
    ).toEqual([{ type: 'tool', id: 'view-1', dryRun: true }])
    expect(
      toChatEvents({
        sessionUpdate: 'tool_call',
        toolCallId: 'map-1',
        rawInput: { server: 'discoui', arguments: { dryRun: true } },
      }),
    ).toEqual([{ type: 'tool', id: 'map-1', dryRun: true }])
  })

  it('keeps select settings and skips the rest', () => {
    expect(
      toChatEvents({
        sessionUpdate: 'config_option_update',
        configOptions: [
          {
            id: 'model',
            name: 'Model',
            type: 'select',
            category: 'model',
            currentValue: 'opus',
            options: [
              { value: 'opus', name: 'Opus', description: 'Big' },
              { value: 'haiku', name: 'Haiku' },
            ],
          },
          { id: 'fast', name: 'Fast', type: 'boolean', currentValue: true },
        ],
      }),
    ).toEqual([
      {
        type: 'config',
        options: [
          {
            id: 'model',
            name: 'Model',
            category: 'model',
            value: 'opus',
            choices: [
              { value: 'opus', name: 'Opus', description: 'Big' },
              { value: 'haiku', name: 'Haiku', description: undefined },
            ],
          },
        ],
      },
    ])
  })
})

describe(appendToLog.name, () => {
  it('merges chunks of one message and nothing else', () => {
    const log: ChatEvent[] = []
    appendToLog(log, { type: 'text', role: 'agent', text: 'Hel' })
    appendToLog(log, { type: 'text', role: 'agent', text: 'lo' })
    appendToLog(log, { type: 'text', role: 'thought', text: 'x' })
    appendToLog(log, { type: 'text', role: 'agent', text: '!' })
    expect(log).toEqual([
      { type: 'text', role: 'agent', text: 'Hello' },
      { type: 'text', role: 'thought', text: 'x' },
      { type: 'text', role: 'agent', text: '!' },
    ])
  })

  it('keeps only the tail of one command output', () => {
    const log: ChatEvent[] = []
    appendToLog(log, { type: 'tool', id: 't', status: 'in_progress' })
    appendToLog(log, { type: 'tool', id: 't', outputAppend: 'x'.repeat(8_000) })
    appendToLog(log, { type: 'tool', id: 't', outputAppend: 'END' })
    appendToLog(log, { type: 'tool', id: 'u', outputAppend: 'other' })
    expect(log).toEqual([
      { type: 'tool', id: 't', status: 'in_progress' },
      { type: 'tool', id: 't', outputAppend: `${'x'.repeat(7_997)}END` },
      { type: 'tool', id: 'u', outputAppend: 'other' },
    ])
  })
})

describe(describeScreen.name, () => {
  it('says when no project is open', () => {
    expect(describeScreen(undefined)).toEqual(
      'DiscoUI right now: no project open.',
    )
  })

  it('names the selection and the selected code', () => {
    expect(
      describeScreen({
        project: 'arbitrum',
        selected: [{ address: 'eth:0x1', name: 'Bridge' }],
        panels: ['nodes'],
        code: { address: 'eth:0x1', text: 'function f()' },
      }),
    ).toEqual(
      [
        'DiscoUI right now: project arbitrum.',
        'Selected: Bridge (eth:0x1).',
        'Selected code in eth:0x1:\nfunction f()',
      ].join('\n'),
    )
  })
})

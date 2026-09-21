import { expect } from 'earl'
import { parseCodexEvents } from './codexEvents'

/**
 * Feeds the parser event streams shaped like codex-cli 0.155.1 emits them
 * (captured from real runs) and asserts what the client reads out of them:
 * thread id, usage, final message, errors, and above all any item that only
 * a tool could have produced, because that check is what makes the "no
 * tools" isolation verifiable.
 */
describe(parseCodexEvents.name, () => {
  const ok = [
    '{"type":"thread.started","thread_id":"01a0c5ce-7d5d-7581-ba1f-25d1c3150a2a"}',
    '{"type":"turn.started"}',
    '{"type":"item.completed","item":{"id":"item_0","type":"reasoning","text":"thinking"}}',
    '{"type":"item.completed","item":{"id":"item_1","type":"agent_message","text":"first"}}',
    '{"type":"item.completed","item":{"id":"item_2","type":"agent_message","text":"{\\"version\\":1}"}}',
    '{"type":"turn.completed","usage":{"input_tokens":10207,"cached_input_tokens":0,"cache_write_input_tokens":0,"output_tokens":5,"reasoning_output_tokens":2}}',
  ].join('\n')

  it('reads the thread id, the last agent message and the usage of a clean turn', () => {
    const parsed = parseCodexEvents(`${ok}\n`)
    expect(parsed.threadId).toEqual('01a0c5ce-7d5d-7581-ba1f-25d1c3150a2a')
    expect(parsed.lastMessage).toEqual('{"version":1}')
    expect(parsed.usage).toEqual({
      inputTokens: 10207,
      cachedInputTokens: 0,
      outputTokens: 5,
      reasoningOutputTokens: 2,
    })
    expect(parsed.errors).toEqual([])
    expect(parsed.toolItems).toEqual([])
    expect(parsed.events.length).toEqual(6)
  })

  it('flags command executions, MCP calls, web searches and file changes as tool items', () => {
    const parsed = parseCodexEvents(
      [
        ok,
        '{"type":"item.completed","item":{"id":"item_3","type":"command_execution","command":"ls /","status":"completed"}}',
        '{"type":"item.completed","item":{"id":"item_4","type":"mcp_tool_call","server":"linear","tool":"search"}}',
        '{"type":"item.completed","item":{"id":"item_5","type":"web_search","query":"scroll"}}',
        '{"type":"item.completed","item":{"id":"item_6","type":"file_change"}}',
      ].join('\n'),
    )
    expect(parsed.toolItems).toEqual([
      'command_execution: ls /',
      'mcp_tool_call: linear.search',
      'web_search: scroll',
      'file_change',
    ])
  })

  it('unwraps the API error Codex embeds as JSON in error and turn.failed events', () => {
    const inner =
      "Invalid schema for response_format 'codex_output_schema': In context=('properties', 'version'), schema must have a 'type' key."
    const wrapped = JSON.stringify({
      type: 'error',
      error: { type: 'invalid_request_error', message: inner },
      status: 400,
    })
    const parsed = parseCodexEvents(
      [
        '{"type":"thread.started","thread_id":"t"}',
        JSON.stringify({ type: 'error', message: wrapped }),
        JSON.stringify({
          type: 'turn.failed',
          error: { message: 'plain text' },
        }),
      ].join('\n'),
    )
    expect(parsed.errors).toEqual([inner, 'plain text'])
  })

  it('keeps lines that are not JSON instead of failing, so a stray print never loses a turn', () => {
    const parsed = parseCodexEvents(
      `Reading additional input from stdin...\n${ok}`,
    )
    expect(parsed.unparsedLines).toEqual([
      'Reading additional input from stdin...',
    ])
    expect(parsed.threadId).toEqual('01a0c5ce-7d5d-7581-ba1f-25d1c3150a2a')
  })
})

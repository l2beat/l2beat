/**
 * Reads the `codex exec --json` event stream.
 *
 * Codex reports a turn as JSONL: `thread.started` (with the id a resume
 * needs), `item.completed` per item the model produced, `turn.completed`
 * with token usage, or `error` / `turn.failed`. The events are also the
 * evidence for isolation: the model is given no shell, no web search and no
 * MCP servers, and this module checks that the stream contains no item of a
 * kind that would only exist if a tool had run. A turn with such an item is
 * refused, because a plan produced with outside help is not reproducible
 * from the prompt.
 *
 * Verified against codex-cli 0.155.1; field names are read defensively so an
 * unknown event is kept in the artifact rather than failing the turn.
 */
import type { ModelUsage } from './ModelClient'

export interface CodexEvent {
  type?: string
  [key: string]: unknown
}

/** Item kinds a model produces without any tool. */
const HARMLESS_ITEM_TYPES: ReadonlySet<string> = new Set([
  'agent_message',
  'reasoning',
  'todo_list',
])

export interface ParsedCodexEvents {
  events: CodexEvent[]
  threadId?: string
  usage?: ModelUsage
  /** Text of the last `agent_message` item. */
  lastMessage?: string
  errors: string[]
  /** Items that only a tool call could have produced. */
  toolItems: string[]
  /** Lines that were not JSON, kept so nothing the process printed is lost. */
  unparsedLines: string[]
}

export function parseCodexEvents(jsonl: string): ParsedCodexEvents {
  const parsed: ParsedCodexEvents = {
    events: [],
    errors: [],
    toolItems: [],
    unparsedLines: [],
  }
  for (const line of jsonl.split('\n')) {
    if (line.trim() === '') {
      continue
    }
    const event = parseLine(line)
    if (event === undefined) {
      parsed.unparsedLines.push(line)
      continue
    }
    parsed.events.push(event)
    readEvent(event, parsed)
  }
  return parsed
}

function parseLine(line: string): CodexEvent | undefined {
  try {
    const value: unknown = JSON.parse(line)
    return isRecord(value) ? (value as CodexEvent) : undefined
  } catch {
    return undefined
  }
}

function readEvent(event: CodexEvent, parsed: ParsedCodexEvents): void {
  switch (event.type) {
    case 'thread.started':
      if (typeof event.thread_id === 'string') {
        parsed.threadId = event.thread_id
      }
      return
    case 'item.completed':
      readItem(event.item, parsed)
      return
    case 'turn.completed':
      parsed.usage = readUsage(event.usage)
      return
    case 'error':
      parsed.errors.push(describeError(event.message))
      return
    case 'turn.failed':
      parsed.errors.push(
        describeError(
          isRecord(event.error) ? event.error.message : event.error,
        ),
      )
      return
  }
}

function readItem(item: unknown, parsed: ParsedCodexEvents): void {
  if (!isRecord(item) || typeof item.type !== 'string') {
    return
  }
  if (item.type === 'agent_message' && typeof item.text === 'string') {
    parsed.lastMessage = item.text
  }
  if (item.type === 'error') {
    parsed.errors.push(describeError(item.message))
    return
  }
  if (!HARMLESS_ITEM_TYPES.has(item.type)) {
    parsed.toolItems.push(describeItem(item))
  }
}

function readUsage(usage: unknown): ModelUsage | undefined {
  if (!isRecord(usage)) {
    return undefined
  }
  return {
    inputTokens: asNumber(usage.input_tokens),
    cachedInputTokens: asNumber(usage.cached_input_tokens),
    outputTokens: asNumber(usage.output_tokens),
    reasoningOutputTokens: asNumber(usage.reasoning_output_tokens),
  }
}

function describeItem(item: Record<string, unknown>): string {
  const detail =
    typeof item.command === 'string'
      ? item.command
      : typeof item.server === 'string'
        ? `${item.server}.${String(item.tool ?? '')}`
        : typeof item.query === 'string'
          ? item.query
          : ''
  return detail === '' ? String(item.type) : `${item.type}: ${detail}`
}

function describeError(message: unknown): string {
  if (typeof message !== 'string') {
    return JSON.stringify(message)
  }
  return apiErrorMessage(message) ?? message
}

/** Codex wraps API errors as a JSON document inside the message; the inner message reads better. */
function apiErrorMessage(message: string): string | undefined {
  try {
    const value: unknown = JSON.parse(message)
    if (isRecord(value) && isRecord(value.error)) {
      const inner = value.error.message
      return typeof inner === 'string' ? inner : undefined
    }
  } catch {
    return undefined
  }
  return undefined
}

function asNumber(value: unknown): number | undefined {
  return typeof value === 'number' ? value : undefined
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

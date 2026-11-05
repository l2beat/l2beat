import { v as z } from '@l2beat/validate'
import type { ApiChatEvent } from '../../types'

// The chat keeps one transcript in memory, so every part of it is bounded:
// long answers, many tool calls and long conversations.
const LOG_EVENTS_MAX = 2_000
const TEXT_CHARACTERS_MAX = 50_000
// Tool calls report their status several times, and so does the chat; the
// latest replaces the earlier one, if it is this recent.
const MERGE_LOOKBACK = 200

const chunkSchema = z.object({
  sessionUpdate: z.literal('agent_message_chunk'),
  content: z.object({ type: z.string(), text: z.string().optional() }),
})

const toolSchema = z.object({
  sessionUpdate: z.enum(['tool_call', 'tool_call_update']),
  toolCallId: z.string(),
  title: z.union([z.string(), z.null()]).optional(),
  status: z
    .union([
      z.enum(['pending', 'in_progress', 'completed', 'failed']),
      z.null(),
    ])
    .optional(),
})

// Updates the panel does not draw, or that do not parse, come back as
// nothing: an agent may send more than this client knows.
export function toChatEvents(update: unknown): ApiChatEvent[] {
  const chunk = chunkSchema.safeParse(update)
  if (chunk.success) {
    const text = chunk.data.content.text
    return text === undefined || text.length === 0
      ? []
      : [{ type: 'text', text }]
  }
  const tool = toolSchema.safeParse(update)
  if (tool.success) {
    const event: ApiChatEvent = { type: 'tool', id: tool.data.toolCallId }
    if (typeof tool.data.title === 'string' && tool.data.title.length > 0) {
      event.title = tool.data.title
    }
    if (typeof tool.data.status === 'string') {
      event.status = tool.data.status
    }
    // Updates with only output or input change nothing the panel draws.
    return event.title === undefined && event.status === undefined
      ? []
      : [event]
  }
  return []
}

// Chunks of one answer arrive a few words at a time, and a tool call reports
// each status change, so the log merges them: a replay sends a message as
// one event, not hundreds.
export function appendToLog(log: ApiChatEvent[], event: ApiChatEvent) {
  const last = log.at(-1)
  if (event.type === 'text' && last?.type === 'text') {
    const text = (last.text + event.text).slice(0, TEXT_CHARACTERS_MAX)
    log[log.length - 1] = { type: 'text', text }
    return
  }
  // The panel draws only the latest status.
  if (event.type === 'status') {
    const index = findRecent(log, (e) => e.type === 'status')
    if (index !== undefined) {
      log.splice(index, 1)
    }
  }
  if (event.type === 'tool') {
    const id = event.id
    const index = findRecent(log, (e) => e.type === 'tool' && e.id === id)
    const previous = index === undefined ? undefined : log[index]
    if (index !== undefined && previous?.type === 'tool') {
      log[index] = { ...previous, ...event }
      return
    }
  }
  log.push(clipText(event))
  if (log.length > LOG_EVENTS_MAX) {
    log.splice(0, log.length - LOG_EVENTS_MAX)
  }
}

function findRecent(
  log: ApiChatEvent[],
  matches: (event: ApiChatEvent) => boolean,
): number | undefined {
  const start = Math.max(0, log.length - MERGE_LOOKBACK)
  for (let index = log.length - 1; index >= start; index--) {
    const event = log[index]
    if (event !== undefined && matches(event)) {
      return index
    }
  }
  return undefined
}

function clipText(event: ApiChatEvent): ApiChatEvent {
  if (event.type !== 'text' && event.type !== 'user') {
    return event
  }
  return { ...event, text: event.text.slice(0, TEXT_CHARACTERS_MAX) }
}

import { v as z } from '@l2beat/validate'
import type { ApiChatEvent } from '../../types'

// The chat keeps one transcript in memory, so every part of it is bounded:
// long answers, many tool calls and long conversations.
const LOG_EVENTS_MAX = 2_000
const TEXT_CHARACTERS_MAX = 50_000
// Titles, option names and error messages come from the agent too.
const LABEL_CHARACTERS_MAX = 2_000
const OPTIONS_MAX = 20
const PATHS_MAX = 20
// What the researcher approves is shown in full up to this much.
const INPUT_CHARACTERS_MAX = 8_000
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
    // A call may first come with its id alone, and the panel lists it then.
    return [event]
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
  log.push(clipEvent(event))
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

// Every string an agent sends is bounded before the log keeps it or the tab
// draws it.
export function clipEvent(event: ApiChatEvent): ApiChatEvent {
  switch (event.type) {
    case 'text':
    case 'user':
      return { ...event, text: event.text.slice(0, TEXT_CHARACTERS_MAX) }
    case 'tool': {
      // A key set to undefined would erase the title when updates merge.
      const tool: ApiChatEvent = { type: 'tool', id: clipLabel(event.id) }
      if (event.title !== undefined) {
        tool.title = clipLabel(event.title)
      }
      if (event.status !== undefined) {
        tool.status = event.status
      }
      return tool
    }
    case 'permission':
      return {
        ...event,
        title: clipLabel(event.title),
        kind: event.kind === undefined ? undefined : clipLabel(event.kind),
        paths: clipPaths(event.paths),
        input:
          event.input === undefined ||
          event.input.length <= INPUT_CHARACTERS_MAX
            ? event.input
            : `${event.input.slice(0, INPUT_CHARACTERS_MAX)}\n… (cut)`,
        options: event.options.slice(0, OPTIONS_MAX).map((option) => ({
          id: clipLabel(option.id),
          name: clipLabel(option.name),
          kind: clipLabel(option.kind),
        })),
      }
    case 'status':
      return event.error === undefined
        ? event
        : { ...event, error: clipLabel(event.error) }
    case 'error':
      return { ...event, message: clipLabel(event.message) }
    case 'turn-end':
      return { ...event, stopReason: clipLabel(event.stopReason) }
    case 'permission-done':
      return event
  }
}

// The researcher sees that a request touches more than the paths listed.
function clipPaths(paths: string[]): string[] {
  const shown = paths.slice(0, PATHS_MAX).map(clipLabel)
  const more = paths.length - PATHS_MAX
  return more > 0 ? [...shown, `and ${more} more paths`] : shown
}

function clipLabel(text: string): string {
  return text.slice(0, LABEL_CHARACTERS_MAX)
}

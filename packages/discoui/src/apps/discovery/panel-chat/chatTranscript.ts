import type { ApiChatEvent } from '../../../api/types'

export type ChatStatus = Extract<ApiChatEvent, { type: 'status' }>

// The server keeps the transcript within these, so a live chat stays the
// size of its replay.
const ENTRIES_MAX = 2_000
const TEXT_CHARACTERS_MAX = 50_000
// The server merges a tool update into its call only this far back.
const MERGE_LOOKBACK = 200

// What the panel draws: the conversation, the chat's latest status and the
// permission requests already answered.
export interface ChatView {
  entries: ApiChatEvent[]
  status: ChatStatus | undefined
  answered: ReadonlySet<string>
}

export const EMPTY_CHAT: ChatView = {
  entries: [],
  status: undefined,
  answered: new Set(),
}

// Merges like the server's log does, so a live chat and a replayed one look
// the same: an answer's chunks make one message, a tool call one row.
export function applyChatEvent(view: ChatView, event: ApiChatEvent): ChatView {
  if (event.type === 'status') {
    return { ...view, status: event }
  }
  if (event.type === 'permission-done') {
    return { ...view, answered: new Set([...view.answered, event.id]) }
  }
  const entries = [...view.entries]
  const last = entries.at(-1)
  if (event.type === 'text' && last?.type === 'text') {
    const text = (last.text + event.text).slice(0, TEXT_CHARACTERS_MAX)
    entries[entries.length - 1] = { type: 'text', text }
    return { ...view, entries }
  }
  if (event.type === 'tool') {
    const index = findRecentTool(entries, event.id)
    const previous = entries[index]
    if (previous?.type === 'tool') {
      entries[index] = { ...previous, ...event }
      return { ...view, entries }
    }
  }
  entries.push(event)
  return { ...view, entries: entries.slice(-ENTRIES_MAX) }
}

export function replayChat(events: ApiChatEvent[]): ChatView {
  let view = EMPTY_CHAT
  for (const event of events) {
    view = applyChatEvent(view, event)
  }
  return view
}

function findRecentTool(entries: ApiChatEvent[], id: string): number {
  const start = Math.max(0, entries.length - MERGE_LOOKBACK)
  for (let index = entries.length - 1; index >= start; index--) {
    const entry = entries[index]
    if (entry?.type === 'tool' && entry.id === id) {
      return index
    }
  }
  return -1
}

export type ToolEntry = Extract<ApiChatEvent, { type: 'tool' }>

// The transcript as the panel lays it out: tool calls in a row fold into
// one activity, and the first block after a question heads the answer.
export type ChatBlock =
  | { type: 'activity'; key: number; tools: ToolEntry[]; opensAnswer: boolean }
  | {
      type: 'entry'
      key: number
      entry: Exclude<ApiChatEvent, ToolEntry>
      opensAnswer: boolean
    }

export function toBlocks(entries: readonly ApiChatEvent[]): ChatBlock[] {
  const blocks: ChatBlock[] = []
  let isAnswerOpen = false
  for (const [index, entry] of entries.entries()) {
    if (entry.type === 'user') {
      blocks.push({ type: 'entry', key: index, entry, opensAnswer: false })
      isAnswerOpen = false
      continue
    }
    const opensAnswer = !isAnswerOpen
    isAnswerOpen = true
    const last = blocks.at(-1)
    if (entry.type !== 'tool') {
      blocks.push({ type: 'entry', key: index, entry, opensAnswer })
    } else if (last?.type === 'activity') {
      last.tools.push(entry)
    } else {
      blocks.push({ type: 'activity', key: index, tools: [entry], opensAnswer })
    }
  }
  return blocks
}

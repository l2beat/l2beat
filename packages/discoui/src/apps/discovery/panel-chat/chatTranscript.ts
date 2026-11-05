import type { ApiChatEvent } from '../../../api/types'

export type ChatStatus = Extract<ApiChatEvent, { type: 'status' }>

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
    entries[entries.length - 1] = { type: 'text', text: last.text + event.text }
    return { ...view, entries }
  }
  if (event.type === 'tool') {
    const index = entries.findIndex(
      (e) => e.type === 'tool' && e.id === event.id,
    )
    const previous = entries[index]
    if (previous?.type === 'tool') {
      entries[index] = { ...previous, ...event }
      return { ...view, entries }
    }
  }
  entries.push(event)
  return { ...view, entries }
}

export function replayChat(events: ApiChatEvent[]): ChatView {
  let view = EMPTY_CHAT
  for (const event of events) {
    view = applyChatEvent(view, event)
  }
  return view
}

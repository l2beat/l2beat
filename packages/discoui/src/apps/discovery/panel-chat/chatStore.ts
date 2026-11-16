import { create } from 'zustand'
import type { ApiChatEvent } from '../../../api/types'
import {
  applyChatEvent,
  type ChatView,
  EMPTY_CHAT,
  replayChat,
} from './chatTranscript'

interface State {
  view: ChatView
  apply: (event: ApiChatEvent) => void
  replay: (events: ApiChatEvent[]) => void
}

// Fed by the tab's agent stream, which carries this tab's chat only.
export const useChatStore = create<State>((set) => ({
  view: EMPTY_CHAT,
  apply: (event) =>
    set((state) => ({ view: applyChatEvent(state.view, event) })),
  replay: (events) => set({ view: replayChat(events) }),
}))

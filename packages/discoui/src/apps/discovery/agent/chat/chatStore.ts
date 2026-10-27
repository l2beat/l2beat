import { create } from 'zustand'
import {
  type ChatState,
  EMPTY_CHAT,
  reduceChat,
  type StreamEvent,
} from './chatState'

export const PROVIDERS = [
  { id: 'claude', name: 'Claude Code' },
  { id: 'codex', name: 'Codex' },
] as const
export type ProviderId = (typeof PROVIDERS)[number]['id']

const PROVIDER_STORAGE_KEY = 'discoui:ai-provider'
const SETTINGS_STORAGE_KEY = 'discoui:ai-settings'

interface ChatStore extends ChatState {
  connected: boolean
  // Whether the server told this tab where the chat stands.
  replayed: boolean
  chosenProvider: ProviderId
}

export const useChatStore = create<ChatStore>(() => ({
  ...EMPTY_CHAT,
  connected: false,
  replayed: false,
  chosenProvider: readChosenProvider(),
}))

export function providerName(id: string | undefined): string {
  return PROVIDERS.find((p) => p.id === id)?.name ?? 'The agent'
}

// The server holds the conversation and replays it on every connect, so a
// reconnect or a second tab shows the same chat.
export function connectChat(): () => void {
  const source = new EventSource('/api/agent/chat/events')
  source.onopen = () => useChatStore.setState({ connected: true })
  source.onerror = () => useChatStore.setState({ connected: false })
  source.onmessage = (message) => {
    const event = JSON.parse(message.data) as StreamEvent
    const before = useChatStore.getState().status
    useChatStore.setState((state) => ({
      ...reduceChat(state, event),
      replayed: true,
    }))
    if (before === 'starting' && useChatStore.getState().status === 'ready') {
      applyRememberedSettings()
    }
  }
  return () => source.close()
}

export function chooseProvider(provider: ProviderId) {
  localStorage.setItem(PROVIDER_STORAGE_KEY, provider)
  useChatStore.setState({ chosenProvider: provider })
  return startChat()
}

export async function sendMessage(text: string) {
  const { status, chosenProvider } = useChatStore.getState()
  if (status === 'idle' || status === 'failed') {
    await post('start', { provider: chosenProvider })
  }
  await post('prompt', { text })
}

export function startChat() {
  return post('start', { provider: useChatStore.getState().chosenProvider })
}

export function newChat() {
  return post('reset', {})
}

export function stopTurn() {
  return post('cancel', {})
}

export function answerPermission(id: string, choice: string) {
  return post('permission', { id, choice })
}

export function configure(configId: string, value: string) {
  const { provider } = useChatStore.getState()
  if (provider !== undefined) {
    const settings = readSettings(provider)
    settings[configId] = value
    localStorage.setItem(
      `${SETTINGS_STORAGE_KEY}:${provider}`,
      JSON.stringify(settings),
    )
  }
  return post('config', { configId, value })
}

// A new chat starts with the agent's defaults; the researcher's last
// choices for this agent replace them.
function applyRememberedSettings() {
  const { provider, config, items } = useChatStore.getState()
  if (provider === undefined || items.length > 0) {
    return
  }
  const settings = readSettings(provider)
  for (const option of config) {
    const value = settings[option.id]
    if (value === undefined || value === option.value) {
      continue
    }
    if (option.choices.some((choice) => choice.value === value)) {
      void post('config', { configId: option.id, value }).catch(() => {})
    }
  }
}

function readSettings(provider: string): Record<string, string> {
  const stored = localStorage.getItem(`${SETTINGS_STORAGE_KEY}:${provider}`)
  if (stored === null) {
    return {}
  }
  try {
    const parsed: unknown = JSON.parse(stored)
    return typeof parsed === 'object' && parsed !== null
      ? (parsed as Record<string, string>)
      : {}
  } catch {
    return {}
  }
}

async function post(action: string, body: object) {
  const response = await fetch(`/api/agent/chat/${action}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).catch((error: unknown) => {
    throw new Error('DiscoUI is not running: start it again with l2b ui', {
      cause: error,
    })
  })
  if (!response.ok) {
    const answer = (await response.json().catch(() => ({}))) as {
      error?: string
    }
    throw new Error(answer.error ?? 'The chat server did not take it', {
      cause: { status: response.status },
    })
  }
}

function readChosenProvider(): ProviderId {
  const stored = localStorage.getItem(PROVIDER_STORAGE_KEY)
  return PROVIDERS.find((p) => p.id === stored)?.id ?? 'claude'
}

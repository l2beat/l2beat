import { useState } from 'react'
import { postChat } from '../../../api/api'
import type { ApiChatProvider } from '../../../api/types'
import { IconClose } from '../../../icons/IconClose'
import { IconTriangleAlert } from '../../../icons/IconTriangleAlert'
import { cn } from '../../../utils/cn'
import { agentTabId } from '../agent/AgentBridge'
import { ChatComposer } from './ChatComposer'
import { ChatMessages } from './ChatMessages'
import { useChatStore } from './chatStore'
import type { ChatStatus } from './chatTranscript'
import { PROVIDER_NAMES, ProviderMark } from './ProviderMark'

const PROVIDERS: { id: ApiChatProvider; hint: string }[] = [
  { id: 'claude', hint: 'Signed in with your Claude account' },
  { id: 'codex', hint: 'Signed in with your ChatGPT account' },
]

// A chat with a coding agent that DiscoUI runs, with DiscoUI's tools
// connected: it can point at contracts and read what is selected here.
export function ChatPanel() {
  const status = useChatStore((state) => state.view.status)
  const [refusal, setRefusal] = useState<string>()
  // Resolves whether the chat took the request.
  const send = async (
    action: Parameters<typeof postChat>[0],
    body: Record<string, string> = {},
  ): Promise<boolean> => {
    setRefusal(undefined)
    try {
      const reason = await postChat(action, { tab: agentTabId(), ...body })
      setRefusal(reason)
      return reason === undefined
    } catch {
      setRefusal('DiscoUI did not answer')
      return false
    }
  }
  // A message sent while the agent starts waits on the server, and can be
  // stopped before it goes out.
  const isWorking = useChatStore(
    (state) =>
      state.view.status?.status === 'working' ||
      (state.view.status?.status === 'starting' &&
        state.view.entries.some((entry) => entry.type === 'user')),
  )

  // A failed chat takes no more messages; the researcher starts another.
  if (
    status === undefined ||
    status.status === 'closed' ||
    status.status === 'failed'
  ) {
    return (
      <StartScreen
        error={status?.status === 'failed' ? status.error : undefined}
        refusal={refusal}
        start={(provider) => send('start', { provider })}
      />
    )
  }
  return (
    <div className="flex h-full flex-col bg-coffee-900 text-coffee-200 text-xs">
      <Header status={status} close={() => void send('close')} />
      <ChatMessages provider={status.provider} send={send} />
      {refusal && <p className="px-3 pb-1.5 text-aux-red text-xs">{refusal}</p>}
      <ChatComposer isWorking={isWorking} send={send} />
    </div>
  )
}

const STATUS_LABELS: Record<ChatStatus['status'], string> = {
  starting: 'Starting',
  ready: 'Ready',
  working: 'Working',
  failed: 'Failed',
  closed: 'Closed',
}

function Header(props: { status: ChatStatus; close: () => void }) {
  const { status } = props
  return (
    <div className="flex items-center gap-2 border-coffee-700 border-b px-3 py-2">
      <ProviderMark provider={status.provider} className="size-3.5" />
      <span className="font-medium text-coffee-100">
        {PROVIDER_NAMES[status.provider]}
      </span>
      <span className="flex items-center gap-1.5 text-[11px] text-coffee-400">
        <span
          className={cn(
            'size-1.5 rounded-full',
            status.status === 'ready' ? 'bg-aux-green' : 'bg-aux-yellow',
            status.status !== 'ready' && 'animate-pulse',
          )}
        />
        {STATUS_LABELS[status.status]}
      </span>
      <div className="flex-1" />
      <button
        type="button"
        title="Close chat"
        aria-label="Close chat"
        onClick={props.close}
        className="flex size-6 items-center justify-center rounded-sm text-coffee-400 transition-colors hover:bg-coffee-700 hover:text-coffee-100"
      >
        <IconClose className="size-3" />
      </button>
    </div>
  )
}

function StartScreen(props: {
  error: string | undefined
  refusal: string | undefined
  start: (provider: ApiChatProvider) => Promise<boolean>
}) {
  // Until the chat reports its status, another click would start another.
  const [starting, setStarting] = useState<ApiChatProvider>()
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 overflow-y-auto bg-coffee-900 p-6 text-xs">
      <div className="flex max-w-72 flex-col items-center gap-1.5 text-center">
        <h2 className="font-semibold text-coffee-100 text-sm">
          Ask an agent about this project
        </h2>
        <p className="text-coffee-400 leading-relaxed">
          It reads the discovery and the code, points at contracts in your
          graph, and puts lists on a board.
        </p>
      </div>
      {(props.error ?? props.refusal) && (
        <p className="flex w-full max-w-72 gap-2 whitespace-pre-wrap rounded-md border border-aux-red/40 bg-aux-red/10 px-2.5 py-2 text-aux-red">
          <IconTriangleAlert className="mt-px size-3.5 shrink-0" />
          {props.error ?? props.refusal}
        </p>
      )}
      <div className="flex w-full max-w-72 flex-col gap-2">
        {PROVIDERS.map((provider) => (
          <button
            key={provider.id}
            type="button"
            disabled={starting !== undefined}
            onClick={() => {
              setStarting(provider.id)
              void props
                .start(provider.id)
                .finally(() => setStarting(undefined))
            }}
            className="flex items-center gap-3 rounded-lg border border-coffee-600 bg-coffee-800 px-3 py-2.5 text-left transition-colors hover:border-coffee-400 hover:bg-coffee-700 disabled:opacity-60 disabled:hover:border-coffee-600 disabled:hover:bg-coffee-800"
          >
            <ProviderMark provider={provider.id} className="size-4 shrink-0" />
            <span className="flex flex-col">
              <span className="font-medium text-[13px] text-coffee-100">
                {starting === provider.id
                  ? `Starting ${PROVIDER_NAMES[provider.id]}…`
                  : PROVIDER_NAMES[provider.id]}
              </span>
              <span className="text-[11px] text-coffee-400">
                {provider.hint}
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

import { type ReactNode, useEffect, useState } from 'react'
import { postChat } from '../../../api/api'
import type { ApiChatProvider } from '../../../api/types'
import { IconTriangleAlert } from '../../../icons/IconTriangleAlert'
import { cn } from '../../../utils/cn'
import { agentTabId } from '../agent/AgentBridge'
import { ChatComposer } from './ChatComposer'
import { ChatMessages } from './ChatMessages'
import { useChatStore } from './chatStore'
import type { ChatStatus } from './chatTranscript'
import { PROVIDER_NAMES, ProviderMark } from './ProviderMark'

const PROVIDERS: { id: ApiChatProvider; hint: string }[] = [
  { id: 'claude', hint: 'Uses your Claude account' },
  { id: 'codex', hint: 'Uses your ChatGPT account' },
]

// A chat with a coding agent that DiscoUI runs, with DiscoUI's tools
// connected: it can point at contracts and read what is selected here.
export function ChatPanel() {
  const status = useChatStore((state) => state.view.status)
  const hasEntries = useChatStore((state) => state.view.entries.length > 0)
  const { send, refusal } = useChatSend()
  const { starting, start } = useStartLock(status, send)
  // A message sent while the agent starts waits on the server, and can be
  // stopped before it goes out.
  const isWorking = useChatStore(
    (state) =>
      state.view.status?.status === 'working' ||
      (state.view.status?.status === 'starting' &&
        state.view.entries.some((entry) => entry.type === 'user')),
  )
  // A failed chat takes no more messages; the researcher starts another.
  const isOpen =
    status !== undefined &&
    status.status !== 'closed' &&
    status.status !== 'failed'
  const error = status?.status === 'failed' ? status.error : undefined

  if (!isOpen && !hasEntries) {
    return (
      <EmptyChat>
        <StartChoices
          error={error}
          refusal={refusal}
          starting={starting}
          start={start}
        />
      </EmptyChat>
    )
  }
  // An ended or failed chat keeps its conversation on screen to read on.
  return (
    <div className="flex h-full flex-col bg-coffee-900 text-coffee-200 text-xs">
      {status && <Header status={status} end={() => void send('close')} />}
      <ChatMessages
        provider={status?.provider ?? 'claude'}
        isWorking={isWorking}
        send={send}
      />
      {isOpen ? (
        <>
          {refusal && (
            <p className="px-3 pb-1.5 text-aux-red text-xs">{refusal}</p>
          )}
          <ChatComposer isWorking={isWorking} send={send} />
        </>
      ) : (
        <div className="flex flex-col gap-2 border-coffee-700 border-t p-3">
          <p className="text-coffee-400">Start a new chat</p>
          <StartChoices
            error={error}
            refusal={refusal}
            starting={starting}
            start={start}
          />
        </div>
      )}
    </div>
  )
}

// Resolves whether the chat took the request; a refusal shows in the panel.
function useChatSend() {
  const [refusal, setRefusal] = useState<string>()
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
  return { send, refusal }
}

// Another click before the new chat reports in would start another. The
// server empties the transcript first, which redraws the cards, so the lock
// lives in the panel and holds until the new status arrives.
function useStartLock(
  status: ChatStatus | undefined,
  send: (
    action: 'start',
    body: { provider: ApiChatProvider },
  ) => Promise<boolean>,
) {
  const [starting, setStarting] = useState<ApiChatProvider>()
  useEffect(() => {
    if (status?.status === 'starting') setStarting(undefined)
  }, [status])
  const start = async (provider: ApiChatProvider) => {
    setStarting(provider)
    if (!(await send('start', { provider }))) setStarting(undefined)
  }
  return { starting, start }
}

// m-auto rather than justify-center keeps the top reachable in a short pane.
function EmptyChat(props: { children: ReactNode }) {
  return (
    <div className="flex h-full flex-col overflow-y-auto bg-coffee-900 p-6 text-xs">
      <div className="m-auto flex w-full max-w-72 flex-col items-center gap-4">
        <div className="flex flex-col items-center gap-1.5 text-center">
          <h2 className="font-semibold text-coffee-100 text-sm">
            Ask an agent about this project
          </h2>
          <p className="text-coffee-400 leading-relaxed">
            It reads the discovery and the code, points at contracts in your
            graph, and puts lists on a board.
          </p>
        </div>
        {props.children}
      </div>
    </div>
  )
}

const STATUS_LABELS: Record<ChatStatus['status'], string> = {
  starting: 'Starting',
  ready: 'Ready',
  working: 'Working',
  failed: 'Failed',
  closed: 'Ended',
}

function Header(props: { status: ChatStatus; end: () => void }) {
  const { status } = props
  const isOver = status.status === 'closed' || status.status === 'failed'
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
            status.status === 'ready' && 'bg-aux-green',
            status.status === 'failed' && 'bg-aux-red',
            status.status === 'closed' && 'bg-coffee-500',
            !isOver &&
              status.status !== 'ready' &&
              'animate-pulse bg-aux-yellow',
          )}
        />
        {STATUS_LABELS[status.status]}
      </span>
      <div className="flex-1" />
      {!isOver && (
        <button
          type="button"
          onClick={props.end}
          className="h-6 rounded-sm px-2 text-[11px] text-coffee-400 transition-colors hover:bg-coffee-700 hover:text-coffee-100"
        >
          End chat
        </button>
      )}
    </div>
  )
}

function StartChoices(props: {
  error: string | undefined
  refusal: string | undefined
  starting: ApiChatProvider | undefined
  start: (provider: ApiChatProvider) => void
}) {
  const { starting } = props
  return (
    <div className="flex w-full flex-col gap-2">
      {[props.error, props.refusal].map(
        (message, index) =>
          message && (
            <p
              key={index}
              className="flex gap-2 whitespace-pre-wrap rounded-md border border-aux-red/40 bg-aux-red/10 px-2.5 py-2 text-aux-red"
            >
              <IconTriangleAlert className="mt-px size-3.5 shrink-0" />
              {message}
            </p>
          ),
      )}
      {PROVIDERS.map((provider) => (
        <button
          key={provider.id}
          type="button"
          disabled={starting !== undefined}
          onClick={() => props.start(provider.id)}
          className="flex items-center gap-3 rounded-lg border border-coffee-600 bg-coffee-800 px-3 py-2.5 text-left transition-colors hover:border-coffee-400 hover:bg-coffee-700 disabled:opacity-60 disabled:hover:border-coffee-600 disabled:hover:bg-coffee-800"
        >
          <ProviderMark provider={provider.id} className="size-4 shrink-0" />
          <span className="flex flex-col">
            <span className="font-medium text-[13px] text-coffee-100">
              {starting === provider.id
                ? `Starting ${PROVIDER_NAMES[provider.id]}…`
                : PROVIDER_NAMES[provider.id]}
            </span>
            <span className="text-[11px] text-coffee-400">{provider.hint}</span>
          </span>
        </button>
      ))}
    </div>
  )
}

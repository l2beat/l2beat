import { useEffect, useRef, useState } from 'react'
import { postChat } from '../../../api/api'
import type { ApiChatEvent, ApiChatProvider } from '../../../api/types'
import { Button } from '../../../components/Button'
import { Markdown } from '../../../components/Markdown'
import { TextArea } from '../../../components/TextArea'
import { cn } from '../../../utils/cn'
import { agentTabId } from '../agent/AgentBridge'
import { useChatStore } from './chatStore'

const PROVIDER_NAMES: Record<ApiChatProvider, string> = {
  claude: 'Claude Code',
  codex: 'Codex',
}

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
  const isOpen = status !== undefined && status.status !== 'closed'

  return (
    <div className="flex h-full flex-col text-coffee-200 text-xs">
      <div className="flex items-center gap-2 border-coffee-600 border-b px-2 py-1.5">
        {isOpen ? (
          <>
            <span className="font-medium">
              {PROVIDER_NAMES[status.provider]}
            </span>
            <span className="text-coffee-400">{status.status}</span>
            <div className="flex-1" />
            <Button size="small" onClick={() => send('close')}>
              Close chat
            </Button>
          </>
        ) : (
          <>
            <span className="text-coffee-400">Start a chat with</span>
            {(['claude', 'codex'] as const).map((provider) => (
              <Button
                key={provider}
                size="small"
                onClick={() => send('start', { provider })}
              >
                {PROVIDER_NAMES[provider]}
              </Button>
            ))}
          </>
        )}
      </div>
      {status?.status === 'failed' && status.error && (
        <p className="whitespace-pre-wrap px-3 py-2 text-aux-red">
          {status.error}
        </p>
      )}
      <Transcript send={send} />
      {refusal && <p className="px-3 py-1 text-aux-red">{refusal}</p>}
      {isOpen && (
        <Composer isWorking={status.status === 'working'} send={send} />
      )}
    </div>
  )
}

type Send = (
  action: 'prompt' | 'cancel' | 'permission',
  body?: Record<string, string>,
) => Promise<boolean>

function Transcript(props: { send: Send }) {
  const entries = useChatStore((state) => state.view.entries)
  const answered = useChatStore((state) => state.view.answered)
  // A closed chat cancelled what it still asked, without saying so per
  // request.
  const isOver = useChatStore((state) => {
    const status = state.view.status?.status
    return status === 'closed' || status === 'failed'
  })
  const end = useRef<HTMLDivElement>(null)
  useEffect(() => {
    end.current?.scrollIntoView({ block: 'end' })
  }, [entries])

  return (
    <div className="flex flex-1 flex-col gap-2 overflow-y-auto px-3 py-2">
      {entries.map((entry, index) => (
        <Entry
          // The transcript only grows, so a position names one entry.
          key={index}
          entry={entry}
          isAnswered={
            entry.type === 'permission' && (isOver || answered.has(entry.id))
          }
          send={props.send}
        />
      ))}
      <div ref={end} />
    </div>
  )
}

function Entry(props: {
  entry: ApiChatEvent
  isAnswered: boolean
  send: Send
}) {
  const { entry } = props
  switch (entry.type) {
    case 'user':
      return (
        <p className="self-end whitespace-pre-wrap rounded-md bg-coffee-700 px-2.5 py-1.5 text-coffee-100">
          {entry.text}
        </p>
      )
    case 'text':
      return (
        <Markdown allowHtml={false} className="text-[13px] leading-relaxed">
          {entry.text}
        </Markdown>
      )
    case 'tool':
      return (
        <p className="text-coffee-400">
          {toolMark(entry.status)} {entry.title ?? 'Tool call'}
        </p>
      )
    case 'permission':
      return (
        <PermissionCard
          entry={entry}
          isAnswered={props.isAnswered}
          send={props.send}
        />
      )
    case 'error':
      return <p className="whitespace-pre-wrap text-aux-red">{entry.message}</p>
    case 'turn-end':
      return entry.stopReason === 'cancelled' ? (
        <p className="text-coffee-400">Stopped</p>
      ) : null
    default:
      return null
  }
}

function toolMark(status: string | undefined): string {
  if (status === 'completed') return '✓'
  if (status === 'failed') return '✗'
  return '…'
}

function PermissionCard(props: {
  entry: Extract<ApiChatEvent, { type: 'permission' }>
  isAnswered: boolean
  send: Send
}) {
  return (
    <div className="flex flex-col gap-2 rounded-md border border-coffee-600 p-2">
      <p>
        The agent asks to use: <b>{props.entry.title}</b>
        {props.entry.kind && (
          <span className="text-coffee-400"> ({props.entry.kind})</span>
        )}
      </p>
      {props.entry.paths.length > 0 && (
        <p className="break-all text-coffee-300">
          {props.entry.paths.join(', ')}
        </p>
      )}
      {/* What runs, in full: the agent's title alone could hide it. */}
      {props.entry.input && (
        <pre className="max-h-60 overflow-auto whitespace-pre-wrap break-all rounded-sm bg-coffee-800 p-2 font-mono text-[11px] text-coffee-200">
          {props.entry.input}
        </pre>
      )}
      <div className="flex flex-wrap gap-1">
        {props.entry.options.map((option) => (
          <Button
            key={option.id}
            size="small"
            disabled={props.isAnswered}
            onClick={() =>
              props.send('permission', {
                id: props.entry.id,
                optionId: option.id,
              })
            }
          >
            {option.name}
          </Button>
        ))}
      </div>
    </div>
  )
}

function Composer(props: { isWorking: boolean; send: Send }) {
  const [text, setText] = useState('')
  const submit = () => {
    if (text.trim().length === 0 || props.isWorking) {
      return
    }
    // A refused message stays in the box to edit and send again.
    // Text typed while the request was on its way stays too.
    const sent = text
    void props.send('prompt', { text: sent }).then((isTaken) => {
      if (isTaken) setText((current) => (current === sent ? '' : current))
    })
  }

  return (
    <div className="flex items-end gap-2 border-coffee-600 border-t p-2">
      <TextArea
        value={text}
        placeholder="Ask about this project. Enter sends, Shift+Enter adds a line."
        className={cn('min-h-14 flex-1 resize-none')}
        onChange={(event) => setText(event.target.value)}
        onKeyDown={(event) => {
          // Keys typed here belong to the chat, not to DiscoUI's shortcuts.
          event.stopPropagation()
          if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault()
            submit()
          }
        }}
      />
      {props.isWorking ? (
        <Button size="small" onClick={() => props.send('cancel')}>
          Stop
        </Button>
      ) : (
        <Button
          size="small"
          disabled={text.trim().length === 0}
          onClick={submit}
        >
          Send
        </Button>
      )}
    </div>
  )
}

import { memo, useEffect, useRef, useState } from 'react'
import type { ApiChatEvent, ApiChatProvider } from '../../../api/types'
import { Markdown } from '../../../components/Markdown'
import { IconChevronRight } from '../../../icons/IconChevronRight'
import { IconTriangleAlert } from '../../../icons/IconTriangleAlert'
import { cn } from '../../../utils/cn'
import { useChatStore } from './chatStore'
import { type ToolEntry, toBlocks } from './chatTranscript'
import { PROVIDER_NAMES, ProviderMark } from './ProviderMark'
import { describeTool } from './toolLabels'

const BOTTOM_SLACK_PX = 40

export type Send = (
  action: 'prompt' | 'cancel' | 'permission',
  body?: Record<string, string>,
) => Promise<boolean>

export function ChatMessages(props: {
  provider: ApiChatProvider
  isWorking: boolean
  send: Send
}) {
  const entries = useChatStore((state) => state.view.entries)
  const answered = useChatStore((state) => state.view.answered)
  const status = useChatStore((state) => state.view.status?.status)
  // A closed chat cancelled what it still asked, without saying so per
  // request.
  const isOver = status === 'closed' || status === 'failed'
  const { isWorking } = props
  const blocks = toBlocks(entries)
  // New text follows only a reader already at the bottom; one scrolled up
  // to an earlier message stays there.
  const list = useRef<HTMLDivElement>(null)
  const isAtBottom = useRef(true)
  useEffect(() => {
    const element = list.current
    if (element !== null && isAtBottom.current) {
      element.scrollTop = element.scrollHeight
    }
  }, [entries, isWorking])

  return (
    <div
      ref={list}
      onScroll={(event) => {
        const element = event.currentTarget
        const below =
          element.scrollHeight - element.scrollTop - element.clientHeight
        isAtBottom.current = below < BOTTOM_SLACK_PX
      }}
      className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-3 py-3"
    >
      {blocks.map((block, index) => (
        <div key={block.key} className="flex flex-col gap-1.5">
          {block.opensAnswer && <AnswerHeader provider={props.provider} />}
          {block.type === 'activity' ? (
            <Activity
              tools={block.tools}
              isLive={isWorking && index === blocks.length - 1}
            />
          ) : (
            <Entry
              entry={block.entry}
              isAnswered={
                block.entry.type === 'permission' &&
                (isOver || answered.has(block.entry.id))
              }
              send={props.send}
            />
          )}
        </div>
      ))}
      {isWorking && !isAnswering(entries.at(-1), answered) && <Working />}
    </div>
  )
}

// A streaming answer shows itself, and a question to the researcher waits
// on them, not on the agent.
function isAnswering(
  last: ApiChatEvent | undefined,
  answered: ReadonlySet<string>,
): boolean {
  if (last?.type === 'permission') {
    return !answered.has(last.id)
  }
  return last?.type === 'text'
}

function AnswerHeader(props: { provider: ApiChatProvider }) {
  return (
    <div className="flex items-center gap-1.5 text-[11px] text-coffee-400">
      <ProviderMark provider={props.provider} className="size-3" />
      {PROVIDER_NAMES[props.provider]}
    </div>
  )
}

function Working() {
  return (
    <div
      role="status"
      className="flex items-center gap-1 text-coffee-400 text-xs"
    >
      <span className="size-1.5 animate-pulse rounded-full bg-coffee-400" />
      <span className="size-1.5 animate-pulse rounded-full bg-coffee-400 [animation-delay:150ms]" />
      <span className="size-1.5 animate-pulse rounded-full bg-coffee-400 [animation-delay:300ms]" />
      <span className="ml-1">Working</span>
    </div>
  )
}

// Only the streaming answer changes, so the others keep their rendered
// markdown instead of parsing it again on every chunk.
const Entry = memo(function Entry(props: {
  entry: Exclude<ApiChatEvent, ToolEntry>
  isAnswered: boolean
  send: Send
}) {
  const { entry } = props
  switch (entry.type) {
    case 'user':
      return (
        <p className="max-w-[85%] self-end whitespace-pre-wrap break-words rounded-lg rounded-br-sm bg-coffee-700 px-3 py-2 text-[13px] text-coffee-100 leading-relaxed">
          {entry.text}
        </p>
      )
    case 'text':
      return (
        <Markdown allowHtml={false} className="mdc-chat">
          {entry.text}
        </Markdown>
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
      return (
        <p className="flex gap-2 whitespace-pre-wrap rounded-md border border-aux-red/40 bg-aux-red/10 px-2.5 py-2 text-aux-red text-xs">
          <IconTriangleAlert className="mt-px size-3.5 shrink-0" />
          {entry.message}
        </p>
      )
    case 'turn-end':
      return entry.stopReason === 'cancelled' ? (
        <p className="text-coffee-400 text-xs">Stopped</p>
      ) : null
    default:
      return null
  }
})

// Steps show while the agent works on them, then fold into one line so the
// answer stays readable.
const Activity = memo(
  function Activity(props: { tools: ToolEntry[]; isLive: boolean }) {
    const [toggled, setToggled] = useState<boolean>()
    const isOpen = toggled ?? props.isLive
    const inDiscoUi = props.tools.filter(
      (tool) => describeTool(tool.title).isDiscoUi,
    ).length
    return (
      <div className="text-xs">
        <button
          type="button"
          aria-expanded={isOpen}
          onClick={() => setToggled(!isOpen)}
          className="flex items-center gap-1.5 text-coffee-400 hover:text-coffee-200"
        >
          <IconChevronRight
            className={cn('size-3 transition-transform', isOpen && 'rotate-90')}
          />
          {props.tools.length === 1
            ? 'Used a tool'
            : `Used ${props.tools.length} tools`}
          {inDiscoUi > 0 && (
            <span className="rounded-sm bg-autumn-300/15 px-1.5 text-[11px] text-autumn-300">
              {inDiscoUi} in DiscoUI
            </span>
          )}
        </button>
        {isOpen && (
          <ol className="mt-1.5 ml-[5px] flex flex-col gap-1 border-coffee-700 border-l pl-3">
            {props.tools.map((tool) => (
              <ToolRow key={tool.id} tool={tool} />
            ))}
          </ol>
        )}
      </div>
    )
  },
  // Each chunk of an answer builds the blocks again, with the same calls.
  (previous, next) =>
    previous.isLive === next.isLive &&
    previous.tools.length === next.tools.length &&
    previous.tools.every((tool, index) => tool === next.tools[index]),
)

function ToolRow(props: { tool: ToolEntry }) {
  const { label, isDiscoUi } = describeTool(props.tool.title)
  return (
    <li className="flex min-w-0 items-center gap-1.5">
      <ToolStatus status={props.tool.status} />
      <span
        title={props.tool.title}
        className={cn(
          'truncate',
          isDiscoUi
            ? 'text-coffee-200'
            : 'font-mono text-[11px] text-coffee-300',
        )}
      >
        {label}
      </span>
    </li>
  )
}

function ToolStatus(props: { status: ToolEntry['status'] }) {
  if (props.status === 'completed') {
    return <span className="w-3 shrink-0 text-aux-green">✓</span>
  }
  if (props.status === 'failed') {
    return <span className="w-3 shrink-0 text-aux-red">✗</span>
  }
  return (
    <span className="flex w-3 shrink-0 justify-center">
      <span className="size-1.5 animate-pulse rounded-full bg-coffee-400" />
    </span>
  )
}

function PermissionCard(props: {
  entry: Extract<ApiChatEvent, { type: 'permission' }>
  isAnswered: boolean
  send: Send
}) {
  // One answer per request: a second click could reach the server first.
  const [isChoosing, setChoosing] = useState(false)
  const { entry } = props
  return (
    <div
      className={cn(
        'flex flex-col gap-2 rounded-md border border-coffee-600 border-l-2 bg-coffee-800 p-2.5 text-xs',
        !props.isAnswered && 'border-l-aux-yellow',
      )}
    >
      <p className="text-coffee-200">
        Allow <b className="text-coffee-100">{entry.title}</b>?
        {entry.kind && (
          <span className="ml-1.5 rounded-sm bg-coffee-700 px-1 text-[11px] text-coffee-300">
            {entry.kind}
          </span>
        )}
      </p>
      {entry.paths.length > 0 && (
        <p className="break-all font-mono text-[11px] text-coffee-300">
          {entry.paths.join(', ')}
        </p>
      )}
      {/* What runs, in full: the agent's title alone could hide it. */}
      {entry.input && (
        <pre className="max-h-60 overflow-auto whitespace-pre-wrap break-all rounded-sm bg-coffee-900 p-2 font-mono text-[11px] text-coffee-200">
          {entry.input}
        </pre>
      )}
      <div className="flex flex-wrap gap-1">
        {entry.options.map((option) => (
          <button
            key={option.id}
            type="button"
            disabled={props.isAnswered || isChoosing}
            onClick={() => {
              setChoosing(true)
              void props
                .send('permission', { id: entry.id, optionId: option.id })
                .then((isTaken) => {
                  if (!isTaken) setChoosing(false)
                })
            }}
            className={cn(
              'h-6 rounded-sm border px-2 font-medium transition-colors disabled:opacity-50',
              option.kind.startsWith('allow')
                ? 'border-autumn-300 bg-autumn-300 text-black hover:bg-autumn-200 disabled:hover:bg-autumn-300'
                : 'border-coffee-500 text-coffee-200 hover:bg-coffee-700 disabled:hover:bg-transparent',
            )}
          >
            {option.name}
          </button>
        ))}
      </div>
    </div>
  )
}

import { useQuery } from '@tanstack/react-query'
import { memo, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useParams } from 'react-router'
import { toast } from 'sonner'
import { Markdown } from '../../../../components/Markdown'
import { IconChevronRight } from '../../../../icons/IconChevronRight'
import { IconSparkle } from '../../../../icons/IconSparkle'
import { cn } from '../../../../utils/cn'
import { useDockingStore } from '../../multi-view/store'
import {
  activateBoard,
  confirmLeavingDraft,
  listBoards,
  useBoardUiStore,
} from '../../panel-board/boardApi'
import {
  type ActivityStep,
  type ChatBlock,
  type ChatItem,
  toBlocks,
} from './chatState'
import { answerPermission, providerName, useChatStore } from './chatStore'
import { ProviderMark } from './ProviderMark'
import { builtBoardId, describeTool } from './toolLabels'

// Rendering follows the stream a few words at a time. Items keep their
// identity until they change, so only the block that grows renders again.
export function ChatTranscript() {
  const items = useChatStore((state) => state.items)
  const inTurn = useChatStore((state) => state.inTurn)
  const questions = items.filter((item) => item.kind === 'user').length
  const follow = useFollowBottom(questions)
  const blocks = toBlocks(items)

  return (
    <div
      ref={follow.scroller}
      onScroll={follow.onScroll}
      className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pt-4 pb-2"
    >
      <div ref={follow.content} className="flex flex-col">
        {blocks.map((block, i) => (
          <BlockView
            key={block.key}
            block={block}
            live={inTurn && i === blocks.length - 1}
          />
        ))}
        <TurnProgress />
      </div>
    </div>
  )
}

const FOLLOW_DISTANCE_PX = 48

// Keeps the newest output in view while the researcher is at the bottom.
// Growing content leaves scrollTop alone, so only scrolling up lets go, and
// asking a question catches up again.
function useFollowBottom(questions: number) {
  const scroller = useRef<HTMLDivElement>(null)
  const content = useRef<HTMLDivElement>(null)
  const following = useRef(true)
  const lastTop = useRef(0)

  useLayoutEffect(() => {
    following.current = true
    scrollToBottom(scroller.current)
  }, [questions])

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      if (following.current) scrollToBottom(scroller.current)
    })
    if (scroller.current) observer.observe(scroller.current)
    if (content.current) observer.observe(content.current)
    return () => observer.disconnect()
  }, [])

  const onScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const element = event.currentTarget
    const distance =
      element.scrollHeight - element.scrollTop - element.clientHeight
    if (distance < FOLLOW_DISTANCE_PX) {
      following.current = true
    } else if (element.scrollTop < lastTop.current) {
      following.current = false
    }
    lastTop.current = element.scrollTop
  }
  return { scroller, content, onScroll }
}

function scrollToBottom(element: HTMLElement | null) {
  if (element !== null) element.scrollTop = element.scrollHeight
}

function BlockView(props: { block: ChatBlock; live: boolean }) {
  const { block } = props
  return (
    <div className={cn(block.opensResponse ? 'mt-3' : 'mt-2.5', 'first:mt-0')}>
      {block.opensResponse && <ResponseHeader />}
      {block.kind === 'activity' ? (
        <Activity steps={block.steps} live={props.live} />
      ) : (
        <ItemView item={block.item} />
      )}
    </div>
  )
}

function ResponseHeader() {
  const provider = useChatStore((state) => state.provider)
  return (
    <div className="mb-1.5 flex items-center gap-1.5 text-[11px] text-coffee-400">
      <ProviderMark provider={provider} className="size-3" />
      {providerName(provider)}
    </div>
  )
}

const ItemView = memo(function ItemView(props: {
  item: Exclude<ChatItem, ActivityStep>
}) {
  const { item } = props
  switch (item.kind) {
    case 'user':
      return (
        <div className="mt-2 flex justify-end">
          <div className="max-w-[85%] whitespace-pre-wrap rounded-lg rounded-br-sm bg-coffee-700 px-3 py-2 text-[13px] text-coffee-200 leading-relaxed">
            {item.text}
          </div>
        </div>
      )
    case 'agent':
      return (
        <Markdown allowHtml={false} className="mdc-chat">
          {item.text}
        </Markdown>
      )
    case 'plan':
      return <PlanView entries={item.entries} />
    case 'permission':
      return <PermissionCard item={item} />
    case 'notice':
      return <Notice text={item.text} tone={item.tone} />
  }
})

// Steps show while the agent works on them, then fold into one line so
// the answer stays readable.
const Activity = memo(function Activity(props: {
  steps: ActivityStep[]
  live: boolean
}) {
  const [toggled, setToggled] = useState<boolean>()
  const open = toggled ?? props.live
  const tools = props.steps.filter((step) => step.kind === 'tool')
  const inDiscoUi = tools.filter(
    (t) => describeTool(t.title, t.dryRun).inDiscoUi,
  )
  return (
    <div className="text-xs">
      <button
        type="button"
        onClick={() => setToggled(!open)}
        className="flex items-center gap-1.5 text-coffee-400 hover:text-coffee-200"
      >
        <IconChevronRight
          className={cn('size-3 transition-transform', open && 'rotate-90')}
        />
        <span>
          {summarize(props.steps.length - tools.length, tools.length)}
        </span>
        {inDiscoUi.length > 0 && (
          <span className="flex items-center gap-1 rounded-sm bg-aux-purple/15 px-1.5 text-[#d68ae0] text-[11px]">
            <IconSparkle className="size-2.5" />
            {inDiscoUi.length} in DiscoUI
          </span>
        )}
      </button>
      {open && (
        <ol className="mt-1.5 ml-[5px] flex flex-col gap-1 border-coffee-700 border-l pl-3">
          {props.steps.map((step, i) =>
            step.kind === 'tool' ? (
              <ToolStep key={step.id} step={step} />
            ) : (
              <ThoughtStep key={`thought-${i}`} text={step.text} />
            ),
          )}
        </ol>
      )}
    </div>
  )
})

function summarize(thoughts: number, tools: number): string {
  if (tools === 0) {
    return 'Thought it through'
  }
  const steps = `${tools} ${tools === 1 ? 'step' : 'steps'}`
  return thoughts > 0 ? `Thought, then took ${steps}` : `Took ${steps}`
}

function ToolStep(props: { step: Extract<ChatItem, { kind: 'tool' }> }) {
  const { step } = props
  const [open, setOpen] = useState(false)
  const { label, inDiscoUi, verbatim } = describeTool(step.title, step.dryRun)
  const boardId =
    step.status === 'completed'
      ? builtBoardId(step.title, step.output)
      : undefined
  return (
    <li className="flex flex-wrap items-center gap-x-2">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        disabled={step.output.length === 0}
        title={step.title}
        className="flex min-w-0 flex-1 items-center gap-2 text-left disabled:cursor-default"
      >
        <StepMark status={step.status} inDiscoUi={inDiscoUi} />
        <span
          className={cn(
            'truncate',
            inDiscoUi && 'text-coffee-200',
            !inDiscoUi && 'text-coffee-400',
            verbatim && 'font-mono text-[11px]',
            step.status === 'failed' && 'text-aux-red',
          )}
        >
          {label}
        </span>
      </button>
      {boardId !== undefined && <OpenBoardButton boardId={boardId} />}
      {open && (
        <pre className="mt-1 mb-1 max-h-60 basis-full overflow-auto whitespace-pre-wrap rounded-md bg-coffee-800 px-2.5 py-2 font-mono text-[11px] text-coffee-400 leading-relaxed">
          {stripFence(step.output)}
        </pre>
      )}
    </li>
  )
}

// A board the researcher scrolled past is one click away. A closed one is
// gone from the open boards, so it has no button.
function OpenBoardButton(props: { boardId: string }) {
  const { project } = useParams()
  const revision = useBoardUiStore((state) => state.revision)
  const list = useQuery({
    queryKey: ['boards', project, revision],
    queryFn: () => listBoards(project as string),
    enabled: project !== undefined,
  })
  const isOpen = list.data?.open.some((b) => b.id === props.boardId)
  if (project === undefined || isOpen !== true) return null
  return (
    <button
      type="button"
      onClick={() => {
        if (!confirmLeavingDraft()) return
        useDockingStore.getState().ensureLeaf('board')
        activateBoard(project, props.boardId)
      }}
      className="shrink-0 text-[11px] text-aux-blue hover:underline"
    >
      Open
    </button>
  )
}

function StepMark(props: { status: string; inDiscoUi: boolean }) {
  if (props.status === 'pending' || props.status === 'in_progress') {
    return (
      <span className="size-3 shrink-0 animate-spin rounded-full border-[1.5px] border-coffee-600 border-t-coffee-200" />
    )
  }
  if (props.status === 'failed') {
    return <span className="w-3 shrink-0 text-center text-aux-red">✕</span>
  }
  if (props.inDiscoUi) {
    return <IconSparkle className="size-3 shrink-0 text-[#d68ae0]" />
  }
  return <span className="w-3 shrink-0 text-center text-coffee-600">●</span>
}

function ThoughtStep(props: { text: string }) {
  const [open, setOpen] = useState(false)
  return (
    <li>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-coffee-400 italic hover:text-coffee-200"
      >
        <span className="w-3 shrink-0 text-center not-italic">∴</span>
        Thinking
      </button>
      {open && (
        <p className="mt-1 mb-1 whitespace-pre-wrap pl-5 text-coffee-400 italic leading-relaxed">
          {props.text}
        </p>
      )}
    </li>
  )
}

// Claude wraps command output in a console fence for markdown clients.
function stripFence(output: string): string {
  const lines = output.split('\n')
  if (lines[0]?.startsWith('```') && lines[lines.length - 1] === '```') {
    return lines.slice(1, -1).join('\n')
  }
  return output
}

function PlanView(props: { entries: { content: string; status: string }[] }) {
  return (
    <div className="rounded-md border border-coffee-700 bg-coffee-800/60 px-3 py-2 text-xs">
      <div className="mb-1.5 font-bold text-[10px] text-coffee-400 uppercase tracking-wider">
        Plan
      </div>
      <ul className="flex flex-col gap-1">
        {props.entries.map((entry, i) => (
          <li key={i} className="flex items-start gap-2">
            <PlanMark status={entry.status} />
            <span
              className={cn(
                entry.status === 'completed'
                  ? 'text-coffee-400 line-through decoration-coffee-600'
                  : 'text-coffee-200',
              )}
            >
              {entry.content}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function PlanMark(props: { status: string }) {
  return (
    <span
      className={cn(
        'mt-0.5 flex size-3 shrink-0 items-center justify-center rounded-full border text-[8px]',
        props.status === 'completed' &&
          'border-aux-green bg-aux-green text-black',
        props.status === 'in_progress' && 'animate-pulse border-coffee-200',
        props.status === 'pending' && 'border-coffee-600',
      )}
    >
      {props.status === 'completed' ? '✓' : ''}
    </span>
  )
}

function PermissionCard(props: {
  item: Extract<ChatItem, { kind: 'permission' }>
}) {
  const { item } = props
  if (item.choice !== undefined) {
    return <PermissionOutcome item={item} />
  }
  return (
    <div className="rounded-md border border-aux-yellow/50 bg-aux-yellow/5 px-3 py-2.5 text-xs">
      <div className="mb-1.5 font-bold text-[10px] text-aux-yellow uppercase tracking-wider">
        Needs your permission
      </div>
      <code className="line-clamp-4 block break-all rounded-sm bg-coffee-900 px-2 py-1.5 font-mono text-[11px] text-coffee-200">
        {item.title}
      </code>
      <PermissionChoices item={item} />
    </div>
  )
}

function PermissionChoices(props: {
  item: Extract<ChatItem, { kind: 'permission' }>
}) {
  const { item } = props
  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {item.choices.map((choice) => (
        <button
          key={choice.id}
          type="button"
          title={choice.name}
          onClick={() =>
            answerPermission(item.id, choice.id).catch((error: Error) =>
              toast.error(error.message),
            )
          }
          className={cn(
            'max-w-full truncate rounded-sm px-2.5 py-1 transition-colors',
            choice.kind === 'allow_once' &&
              'bg-aux-yellow font-bold text-black hover:brightness-110',
            choice.kind === 'allow_always' &&
              'border border-aux-yellow/40 text-coffee-200 hover:border-aux-yellow',
            choice.kind.startsWith('reject') &&
              'border border-coffee-700 text-coffee-400 hover:border-coffee-600 hover:text-coffee-200',
          )}
        >
          {choice.name}
        </button>
      ))}
    </div>
  )
}

function PermissionOutcome(props: {
  item: Extract<ChatItem, { kind: 'permission' }>
}) {
  const { item } = props
  const chosen = item.choices.find((choice) => choice.id === item.choice)
  const allowed = chosen?.kind.startsWith('allow') === true
  let outcome = 'Cancelled'
  if (chosen !== undefined) {
    outcome = allowed ? 'Allowed' : 'Declined'
  }
  return (
    <div
      title={chosen?.name}
      className="flex min-w-0 items-center gap-2 text-xs"
    >
      <span
        className={cn(
          'w-3 shrink-0 text-center',
          allowed ? 'text-aux-green' : 'text-coffee-400',
        )}
      >
        {allowed ? '✓' : '✕'}
      </span>
      <span className="shrink-0 text-coffee-400">{outcome}</span>
      <code className="truncate font-mono text-[11px] text-coffee-400">
        {item.title}
      </code>
    </div>
  )
}

function Notice(props: { text: string; tone: 'info' | 'error' }) {
  if (props.tone === 'error') {
    return (
      <div className="whitespace-pre-wrap rounded-md border border-aux-red/40 bg-aux-red/5 px-3 py-2 text-aux-red text-xs">
        {props.text}
      </div>
    )
  }
  return (
    <div className="flex items-center gap-2 text-[11px] text-coffee-400">
      <span className="h-px flex-1 bg-coffee-700" />
      {props.text}
      <span className="h-px flex-1 bg-coffee-700" />
    </div>
  )
}

function TurnProgress() {
  const inTurn = useChatStore((state) => state.inTurn)
  const status = useChatStore((state) => state.status)
  const provider = useChatStore((state) => state.provider)
  const waiting = useChatStore((state) =>
    state.items.some((i) => i.kind === 'permission' && i.choice === undefined),
  )
  const seconds = useSecondsSince(inTurn)
  if (!inTurn) {
    return null
  }
  let label = 'Working'
  if (status === 'starting') {
    label = `Starting ${providerName(provider)}`
  } else if (waiting) {
    label = 'Waiting for you'
  }
  return (
    <div className="mt-3 flex items-center gap-2 text-coffee-400 text-xs">
      <span className="flex gap-0.5">
        {[0, 150, 300].map((delay) => (
          <span
            key={delay}
            style={{ animationDelay: `${delay}ms` }}
            className="size-1 animate-bounce rounded-full bg-[#d68ae0]"
          />
        ))}
      </span>
      {label}
      {seconds >= 3 && <span className="text-coffee-600">{seconds}s</span>}
    </div>
  )
}

function useSecondsSince(running: boolean): number {
  const [seconds, setSeconds] = useState(0)
  useEffect(() => {
    setSeconds(0)
    if (!running) {
      return
    }
    const started = Date.now()
    const interval = setInterval(
      () => setSeconds(Math.floor((Date.now() - started) / 1000)),
      1000,
    )
    return () => clearInterval(interval)
  }, [running])
  return seconds
}

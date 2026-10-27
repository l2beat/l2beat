import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../../../components/Popover'
import { IconArrowUp } from '../../../../icons/IconArrowUp'
import { IconChevronDown } from '../../../../icons/IconChevronDown'
import { IconPlus } from '../../../../icons/IconPlus'
import { IconStop } from '../../../../icons/IconStop'
import { cn } from '../../../../utils/cn'
import { useProjectData } from '../../hooks/useProjectData'
import { ChatTranscript } from './ChatTranscript'
import type { ConfigOption } from './chatState'
import {
  chooseProvider,
  configure,
  connectChat,
  newChat,
  PROVIDERS,
  providerName,
  sendMessage,
  startChat,
  stopTurn,
  useChatStore,
} from './chatStore'
import { ProviderMark } from './ProviderMark'

// Settings an agent offers that matter in a chat about a graph; the rest
// stay at the agent's defaults.
const SHOWN_CONFIG_CATEGORIES = ['model', 'mode', 'thought_level']

const SUGGESTIONS = [
  'What is this contract and who controls it?',
  'Show me the power structure of this project.',
  'What can be upgraded without a delay?',
]

export function ChatPanel() {
  useEffect(connectChat, [])
  useStartWhenIdle()
  const empty = useChatStore((state) => state.items.length === 0)
  const inTurn = useChatStore((state) => state.inTurn)

  // Esc stops the turn wherever in the panel the researcher clicked last, not
  // only in the composer; clicking the transcript focuses the panel itself.
  return (
    <div
      tabIndex={-1}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && inTurn) {
          stopTurn().catch(reportError)
        }
      }}
      className="flex h-full w-full flex-col bg-coffee-900 text-coffee-200 outline-hidden"
    >
      <ChatHeader />
      {empty ? <EmptyState /> : <ChatTranscript />}
      <Failure />
      <Composer />
    </div>
  )
}

// An agent waits as soon as the panel opens, so its settings are there to
// pick before the first message and the first answer comes sooner.
function useStartWhenIdle() {
  const idle = useChatStore(
    (state) => state.connected && state.replayed && state.status === 'idle',
  )
  useEffect(() => {
    if (idle) {
      startChat().catch(reportError)
    }
  }, [idle])
}

function ChatHeader() {
  const status = useChatStore((state) => state.status)
  const provider = useChatStore((state) => state.provider)
  const chosen = useChatStore((state) => state.chosenProvider)
  const title = useChatStore((state) => state.title)
  const empty = useChatStore((state) => state.items.length === 0)
  const shown = provider ?? chosen

  return (
    <div className="flex h-9 shrink-0 items-center gap-2 border-coffee-700 border-b px-3 text-xs">
      <ProviderMark
        provider={shown}
        className={cn(
          'size-3.5 shrink-0',
          (status === 'working' || status === 'starting') && 'animate-pulse',
        )}
      />
      <span className="shrink-0 font-bold">{providerName(shown)}</span>
      {title !== undefined && !empty && (
        <span className="min-w-0 truncate text-coffee-400" title={title}>
          {title}
        </span>
      )}
      <div className="flex-1" />
      <SettingsMenu />
      {!empty && (
        <button
          type="button"
          onClick={() => newChat().catch(reportError)}
          title="New chat"
          className="flex size-6 shrink-0 items-center justify-center rounded-sm text-coffee-400 hover:bg-coffee-700 hover:text-coffee-200"
        >
          <IconPlus className="size-3.5" />
        </button>
      )}
    </div>
  )
}

function SettingsMenu() {
  const config = useChatStore((state) => state.config)
  const starting = useChatStore((state) => state.status === 'starting')
  const shown = SHOWN_CONFIG_CATEGORIES.flatMap((category) =>
    config.filter((option) => option.category === category),
  )
  if (starting) {
    return <span className="animate-pulse text-coffee-400">Starting…</span>
  }
  if (shown.length === 0) {
    return null
  }
  const model = shown.find((option) => option.category === 'model')
  const summary = (model && choiceName(model)) ?? 'Settings'
  return (
    <Popover>
      <PopoverTrigger className="flex min-w-0 items-center gap-1 rounded-sm px-1.5 py-0.5 text-coffee-400 hover:bg-coffee-700 hover:text-coffee-200 focus:ring-0">
        <span className="truncate">{summary}</span>
        <IconChevronDown className="size-3 shrink-0" />
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="flex max-h-[70vh] w-64 flex-col gap-3 overflow-y-auto rounded-md border-coffee-600 p-2"
      >
        {shown.map((option) => (
          <SettingChoices key={option.id} option={option} />
        ))}
      </PopoverContent>
    </Popover>
  )
}

function SettingChoices(props: { option: ConfigOption }) {
  const { option } = props
  return (
    <div>
      <div className="mb-1 px-1.5 font-bold text-[10px] text-coffee-400 uppercase tracking-wider">
        {option.name}
      </div>
      {option.choices.map((choice) => (
        <button
          key={choice.value}
          type="button"
          onClick={() => configure(option.id, choice.value).catch(reportError)}
          className={cn(
            'flex w-full items-start gap-2 rounded-sm px-1.5 py-1 text-left text-xs hover:bg-coffee-700',
            choice.value === option.value && 'bg-coffee-800',
          )}
        >
          <span className="w-3 shrink-0 text-[#d68ae0]">
            {choice.value === option.value ? '✓' : ''}
          </span>
          <span className="flex min-w-0 flex-col">
            <span className="text-coffee-200">{choice.name}</span>
            {choice.description !== undefined && (
              <span className="text-[11px] text-coffee-400">
                {choice.description}
              </span>
            )}
          </span>
        </button>
      ))}
    </div>
  )
}

function choiceName(option: ConfigOption): string | undefined {
  return option.choices.find((choice) => choice.value === option.value)?.name
}

function EmptyState() {
  const chosen = useChatStore((state) => state.chosenProvider)
  const { project } = useProjectData()
  return (
    <div className="flex min-h-0 flex-1 flex-col justify-center overflow-y-auto px-5 py-6">
      <div className="mb-4 flex size-10 items-center justify-center rounded-lg border border-coffee-700 bg-coffee-800">
        <ProviderMark provider={chosen} className="size-5" />
      </div>
      <h2 className="font-bold text-base text-coffee-200">
        Ask about {project}
      </h2>
      <p className="mt-1 text-[13px] text-coffee-400 leading-relaxed">
        It sees what you select and answers in DiscoUI: it points at contracts
        and code, and reshapes the graph when you ask.
      </p>
      <ProviderPicker />
      <div className="mt-5 flex flex-col gap-1.5">
        {SUGGESTIONS.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => sendMessage(suggestion).catch(reportError)}
            className="group flex items-center justify-between gap-2 rounded-md border border-coffee-700 px-3 py-2 text-left text-[13px] text-coffee-200 transition-colors hover:border-coffee-600 hover:bg-coffee-800"
          >
            {suggestion}
            <span className="text-coffee-600 transition-colors group-hover:text-[#d68ae0]">
              →
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

function ProviderPicker() {
  const chosen = useChatStore((state) => state.chosenProvider)
  return (
    <div
      className="mt-4 flex w-fit gap-0.5 rounded-md bg-coffee-800 p-0.5 text-xs"
      role="radiogroup"
    >
      {PROVIDERS.map((provider) => (
        <button
          key={provider.id}
          type="button"
          role="radio"
          aria-checked={chosen === provider.id}
          onClick={() => chooseProvider(provider.id).catch(reportError)}
          className={cn(
            'flex items-center gap-1.5 rounded-sm px-2.5 py-1 transition-colors',
            chosen === provider.id
              ? 'bg-coffee-700 text-coffee-200 shadow-sm'
              : 'text-coffee-400 hover:text-coffee-200',
          )}
        >
          <ProviderMark provider={provider.id} className="size-3" />
          {provider.name}
        </button>
      ))}
    </div>
  )
}

function Failure() {
  const status = useChatStore((state) => state.status)
  const error = useChatStore((state) => state.error)
  const provider = useChatStore((state) => state.provider)
  if (status !== 'failed') {
    return null
  }
  return (
    <div className="mx-3 mb-2 shrink-0 rounded-md border border-aux-red/40 bg-aux-red/5 px-3 py-2.5 text-xs">
      <div className="font-bold text-aux-red">
        {providerName(provider)} stopped
      </div>
      <p className="mt-1 max-h-32 overflow-y-auto whitespace-pre-wrap font-mono text-[11px] text-coffee-400">
        {error ?? 'The agent exited.'}
      </p>
      <button
        type="button"
        onClick={() => startChat().catch(reportError)}
        className="mt-2 rounded-sm bg-coffee-700 px-2.5 py-1 text-coffee-200 hover:bg-coffee-600"
      >
        Start again
      </button>
    </div>
  )
}

function Composer() {
  const [text, setText] = useState('')
  const inTurn = useChatStore((state) => state.inTurn)
  const provider = useChatStore((state) => state.provider)
  const chosen = useChatStore((state) => state.chosenProvider)
  const input = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const element = input.current
    if (element !== null) {
      element.style.height = 'auto'
      element.style.height = `${element.scrollHeight}px`
    }
  }, [text])

  const send = () => {
    const message = text.trim()
    if (message.length === 0 || inTurn) {
      return
    }
    setText('')
    sendMessage(message).catch((error: Error) => {
      setText(message)
      reportError(error)
    })
  }

  return (
    <div className="shrink-0 px-3 pb-3">
      <div className="rounded-lg border border-coffee-700 bg-coffee-800 transition-colors focus-within:border-coffee-400/60">
        <SelectionChip />
        <textarea
          ref={input}
          rows={1}
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault()
              send()
            }
          }}
          placeholder={`Ask ${providerName(provider ?? chosen)}…`}
          className="block max-h-40 w-full resize-none bg-transparent px-3 py-1.5 text-[13px] text-coffee-200 leading-relaxed outline-hidden placeholder:text-coffee-600 focus-visible:outline-hidden"
        />
        <div className="flex items-center justify-between px-2 pb-2 pl-3">
          <span className="text-[11px] text-coffee-600">
            {inTurn ? 'Esc to stop' : '⏎ to send · ⇧⏎ new line'}
          </span>
          {inTurn ? (
            <button
              type="button"
              onClick={() => stopTurn().catch(reportError)}
              title="Stop (Esc)"
              className="flex size-6 items-center justify-center rounded-md bg-coffee-200 text-black hover:brightness-110"
            >
              <IconStop className="size-3" />
            </button>
          ) : (
            <button
              type="button"
              onClick={send}
              disabled={text.trim().length === 0}
              title="Send (Enter)"
              className="flex size-6 items-center justify-center rounded-md bg-aux-purple text-white transition-colors hover:brightness-110 disabled:bg-coffee-700 disabled:text-coffee-600"
            >
              <IconArrowUp className="size-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// "This" in a message means the selection, so the researcher sees what the
// agent will be told about.
function SelectionChip() {
  const { selected, selectedAddresses } = useProjectData()
  if (selected === undefined) {
    return <div className="h-2" />
  }
  const more = selectedAddresses.length - 1
  return (
    <div className="flex px-2 pt-2">
      <span
        title="Sent with your message, so you can say “this”"
        className="flex min-w-0 items-center gap-1.5 rounded-sm bg-coffee-700/70 px-1.5 py-0.5 text-[11px] text-coffee-200"
      >
        <span className="size-1.5 shrink-0 rounded-full bg-autumn-300" />
        <span className="truncate">{selected.name}</span>
        {more > 0 && <span className="text-coffee-400">+{more}</span>}
      </span>
    </div>
  )
}

function reportError(error: Error) {
  toast.error(error.message)
}

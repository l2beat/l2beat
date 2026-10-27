import { useQuery } from '@tanstack/react-query'
import { Fragment, useEffect, useRef, useState } from 'react'
import type { ApiProjectChain } from '../../../api/types'
import { IconChevronRight } from '../../../icons/IconChevronRight'
import { IconClose } from '../../../icons/IconClose'
import { cn } from '../../../utils/cn'
import { findSelected } from '../../../utils/findSelected'
import { useProjectQueryOptions } from '../hooks/projectQuery'
import { usePanelStore } from '../store/panel-store'
import { applyStep } from './AgentBridge'
import { AgentPathView } from './AgentPathView'
import { AgentViewBanner } from './AgentViewBanner'
import {
  type AgentCodeMatch,
  type AgentFocus,
  type AgentView,
  dismissAgent,
  fitGraphTo,
  useAgentStore,
} from './store'
import { useAgentViewStore } from './viewStore'

export function AgentOverlay(props: { project: string }) {
  const focus = useAgentStore((state) => state.focus)
  const view = useAgentStore((state) => state.view)
  const pending = useAgentViewStore((state) => state.pending)
  const noteRef = useReportedHeight()
  const note = focus?.project === props.project ? focus : undefined
  const banner = pending?.project === props.project ? pending : undefined
  if (note === undefined && banner === undefined) {
    return null
  }
  const header = (
    <div ref={noteRef} className="pointer-events-none flex flex-col gap-2 p-2">
      {banner && <AgentViewBanner pending={banner} />}
      {note && <AgentNote focus={note} view={view} project={props.project} />}
    </div>
  )
  if (note !== undefined && view === 'path') {
    return (
      <div className="absolute inset-0 z-30 flex flex-col bg-coffee-800">
        {header}
        <AgentPathView focus={note} />
      </div>
    )
  }
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-30">
      {header}
    </div>
  )
}

// The graph fits what the agent points at below the cards, padding included.
function useReportedHeight() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const element = ref.current
    if (element === null) {
      return
    }
    const observer = new ResizeObserver(([entry]) => {
      const size = entry?.borderBoxSize[0]
      if (size !== undefined) {
        useAgentStore.getState().setNoteHeight(size.blockSize)
      }
    })
    observer.observe(element)
    return () => {
      observer.disconnect()
      useAgentStore.getState().setNoteHeight(0)
    }
  })
  return ref
}

function AgentNote(props: {
  focus: AgentFocus
  view: AgentView
  project: string
}) {
  const { focus } = props
  const [collapsed, setCollapsed] = useState(false)
  const response = useQuery(useProjectQueryOptions(props.project))
  const entries = response.data?.entries ?? []
  const lanes = [...focus.step.paths, ...focus.step.nodes.map((id) => [id])]
  const showChains = new Set(lanes.flat().map(chainOf)).size > 1

  return (
    <div className="pointer-events-auto rounded-lg border border-coffee-700 bg-coffee-900/95 text-coffee-200 shadow-[0_16px_32px_-20px_#000000ee] backdrop-blur-sm">
      <div className="flex items-center gap-2 py-1.5 pr-1.5 pl-2">
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="flex shrink-0 items-center gap-1.5 rounded-sm bg-aux-blue/15 px-1.5 py-0.5 text-[11px] text-aux-blue hover:bg-aux-blue/25"
          title={collapsed ? 'Show the note' : 'Hide the note'}
        >
          <IconChevronRight
            className={cn(
              'size-2.5 transition-transform',
              !collapsed && 'rotate-90',
            )}
          />
          Agent
        </button>
        <StepControls focus={focus} />
        <div className="flex-1" />
        <ViewToggle view={props.view} />
        <button
          type="button"
          onClick={dismissAgent}
          className="flex size-6 shrink-0 items-center justify-center rounded-sm text-coffee-400 hover:bg-coffee-700 hover:text-coffee-200"
          title="Dismiss (Esc)"
        >
          <IconClose className="size-3" />
        </button>
      </div>
      {!collapsed && (
        <div className="flex flex-col gap-2 px-3 pb-3">
          {focus.step.note.length > 0 && (
            <p className="whitespace-pre-wrap text-[13px] leading-relaxed">
              {focus.step.note}
            </p>
          )}
          {props.view === 'graph' &&
            lanes.map((lane) => (
              <div
                key={lane.join()}
                className="flex flex-wrap items-center gap-1"
              >
                {lane.map((address, i) => (
                  <Fragment key={address}>
                    {i > 0 && <span className="text-coffee-400">→</span>}
                    <HopChip
                      address={address}
                      entries={entries}
                      showChain={showChains}
                      view={props.view}
                    />
                  </Fragment>
                ))}
              </div>
            ))}
          {focus.step.code && <CodeChip focus={focus} entries={entries} />}
        </div>
      )}
    </div>
  )
}

function StepControls(props: { focus: AgentFocus }) {
  const { stepIndex, stepCount } = props.focus
  if (stepCount < 2) {
    return null
  }
  const goToStep = useAgentStore.getState().goToStep
  return (
    <div className="flex items-center text-xs">
      <button
        type="button"
        disabled={stepIndex === 0}
        onClick={() => goToStep(stepIndex - 1)}
        className="flex size-6 items-center justify-center rounded-sm hover:bg-coffee-700 disabled:opacity-30"
        title="Previous step (←)"
      >
        ‹
      </button>
      <span className="px-0.5 text-coffee-400 tabular-nums">
        {stepIndex + 1} / {stepCount}
      </span>
      <button
        type="button"
        disabled={stepIndex === stepCount - 1}
        onClick={() => goToStep(stepIndex + 1)}
        className="flex size-6 items-center justify-center rounded-sm hover:bg-coffee-700 disabled:opacity-30"
        title="Next step (→)"
      >
        ›
      </button>
    </div>
  )
}

function ViewToggle(props: { view: AgentView }) {
  const setView = useAgentStore.getState().setView
  const options: { view: AgentView; label: string; title: string }[] = [
    { view: 'path', label: 'Path', title: 'Only what the agent points at' },
    { view: 'graph', label: 'Graph', title: 'The same, in the full graph' },
  ]
  return (
    <div className="flex gap-0.5 rounded-md bg-coffee-800 p-0.5 text-xs">
      {options.map((option) => (
        <button
          key={option.view}
          type="button"
          title={option.title}
          onClick={() => setView(option.view)}
          className={cn(
            'rounded-sm px-2 py-0.5 transition-colors',
            props.view === option.view
              ? 'bg-coffee-700 text-coffee-200 shadow-sm'
              : 'text-coffee-400 hover:text-coffee-200',
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

function HopChip(props: {
  address: string
  entries: ApiProjectChain[]
  showChain: boolean
  view: AgentView
}) {
  const name = findSelected(props.entries, props.address)?.name
  const isSelected = usePanelStore((s) => s.selected.includes(props.address))
  const onClick = () => {
    usePanelStore.getState().select([props.address])
    if (props.view === 'graph') {
      fitGraphTo(new Set([props.address]))
    }
  }
  return (
    <button
      type="button"
      onClick={onClick}
      title={props.address}
      className={cn(
        'rounded-sm border px-1.5 font-mono text-xs leading-5',
        isSelected
          ? 'border-autumn-300 text-autumn-300'
          : 'border-aux-blue/60 hover:bg-aux-blue hover:text-black',
      )}
    >
      {props.showChain && (
        <span className="text-coffee-400">{chainOf(props.address)}:</span>
      )}
      {name ?? shorten(props.address)}
    </button>
  )
}

// The snippet may be in more than one place, like a function two contracts
// implement, so the researcher can open each one.
function CodeChip(props: { focus: AgentFocus; entries: ApiProjectChain[] }) {
  const { step } = props.focus
  const code = step.code
  if (code === undefined) {
    return null
  }
  const name = findSelected(props.entries, code.address)?.name
  const open = (match: AgentCodeMatch) =>
    applyStep({ ...step, code: { ...code, offset: match.offset } })
  return (
    <div className="flex flex-wrap items-center gap-1 text-xs">
      <span className="text-coffee-400">code</span>
      <button
        type="button"
        onClick={() => open(code)}
        className="rounded-sm border border-aux-blue/60 px-1.5 font-mono leading-5 hover:bg-aux-blue hover:text-black"
      >
        {name ?? shorten(code.address)} · {placeOf(code)}
      </button>
      {code.others.length > 0 && <span className="text-coffee-400">also</span>}
      {code.others.map((match) => (
        <button
          key={match.offset}
          type="button"
          onClick={() => open(match)}
          className="rounded-sm border border-coffee-600 px-1.5 font-mono leading-5 hover:border-aux-blue"
        >
          {placeOf(match)}
        </button>
      ))}
    </div>
  )
}

function placeOf(match: AgentCodeMatch): string {
  return match.contract === undefined
    ? `line ${match.line}`
    : `${match.contract}:${match.line}`
}

function chainOf(address: string): string {
  return address.slice(0, address.indexOf(':'))
}

function shorten(address: string): string {
  return `${address.slice(0, address.indexOf(':') + 7)}…${address.slice(-4)}`
}

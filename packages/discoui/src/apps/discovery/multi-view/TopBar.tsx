import { assert } from '@l2beat/shared-pure'
import { useRef } from 'react'
import { Link } from 'react-router'
import { Button } from '../../../components/Button'
import { IS_READONLY } from '../../../config/readonly'
import { IconClose } from '../../../icons/IconClose'
import { IconGear } from '../../../icons/IconGear'
import { IconPlus } from '../../../icons/IconPlus'
import { IconRefresh } from '../../../icons/IconRefresh'
import { cn } from '../../../utils/cn'
import { type CommandName, useTerminalStore } from '../panel-terminal/store'
import { useDiscoveryCommand } from '../panel-terminal/useDiscoveryCommand'
import { Search } from '../search/Search'
import { useGlobalSettingsStore } from '../store/global-settings-store'
import { SettingsDialog } from './settings/SettingsDialog'
import {
  needsAttention,
  useFilesSyncStatus,
  useOutputsSyncStatus,
} from './settings/syncStatus'
import { addPanel, useDockingStore } from './store'

export function TopBar(props: { project: string }) {
  const layouts = useDockingStore((state) => state.layouts)
  const selectedLayout = useDockingStore((state) => state.selectedLayout)
  const loadLayout = useDockingStore((state) => state.loadLayout)
  const resetLayout = useDockingStore((state) => state.resetLayout)
  return (
    <div className="select-none grid-cols-[1fr_auto_1fr] items-center gap-3 px-2 max-md:invisible md:grid md:h-10">
      <div className="hidden min-w-0 items-center gap-2 md:flex">
        <Link to="/ui">
          <img className="relative top-[-3px] h-[20px]" src="/logo.svg" />
        </Link>
        <p className="truncate font-semibold text-coffee-100 text-sm">
          {props.project}
        </p>
        <DepthBadge />
        {IS_READONLY && (
          <p className="truncate text-coffee-400 text-xs italic">
            That's the latest state reviewed by ETHBEAT.
          </p>
        )}
      </div>
      <div className="hidden md:flex">
        <Search />
      </div>
      <div className="hidden items-center gap-3 justify-self-end md:flex">
        {!IS_READONLY && (
          <div className="flex justify-center border-coffee-600 border-r pr-3">
            <DiscoverOrStopButton project={props.project} />
          </div>
        )}
        <div className="flex justify-center gap-1">
          <div className="inline-flex h-7 items-center gap-0.5 rounded-sm border border-coffee-700 bg-coffee-900 p-0.5">
            {layouts.map((_, i) => (
              <button
                key={i}
                className={cn(
                  'flex h-full w-6 items-center justify-center rounded-xs font-medium text-xs tabular-nums transition-colors duration-100',
                  selectedLayout === i
                    ? 'bg-autumn-300 text-black'
                    : 'text-coffee-300 hover:bg-coffee-700 hover:text-coffee-100',
                )}
                onClick={() => loadLayout(i)}
                title={`Layout ${i + 1}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <Button size="small" className="h-7 gap-1" onClick={() => addPanel()}>
            <IconPlus />
            <span className="max-lg:hidden">Panel</span>
          </Button>
          <Button
            size="small"
            className="h-7 border-transparent text-coffee-300"
            onClick={() => resetLayout()}
            title="Reset to default layout"
          >
            <span>Reset</span>
          </Button>
        </div>

        {IS_READONLY ? (
          <SettingsButton needsAttention={false} />
        ) : (
          <SyncAwareSettingsButton project={props.project} />
        )}
      </div>
    </div>
  )
}

function DepthBadge() {
  const maxReachableDepth = useGlobalSettingsStore((s) => s.maxReachableDepth)
  if (maxReachableDepth === null) {
    return null
  }
  return (
    <div className="shrink-0 rounded-sm border border-aux-green/60 px-1.5 text-aux-green text-xs">
      Depth: {maxReachableDepth}
    </div>
  )
}

// Config models change on every list click, so the sync hooks stay out of the
// TopBar and rerender only this button.
function SyncAwareSettingsButton(props: { project: string }) {
  const outputs = useOutputsSyncStatus(props.project)
  const files = useFilesSyncStatus()
  return (
    <SettingsButton
      needsAttention={
        needsAttention(outputs.level) || needsAttention(files.level)
      }
    />
  )
}

function SettingsButton(props: { needsAttention: boolean }) {
  return (
    <SettingsDialog
      defaultTabId={props.needsAttention ? 'status' : 'global'}
      trigger={
        <button
          type="button"
          className="relative flex size-7 items-center justify-center rounded-sm text-coffee-300 hover:bg-coffee-700 hover:text-coffee-100"
          aria-label={
            props.needsAttention ? 'Settings, sync needs attention' : 'Settings'
          }
          title={props.needsAttention ? 'Sync needs attention' : undefined}
        >
          <IconGear />
          {props.needsAttention && (
            <span className="absolute top-1 right-1 size-1.5 rounded-full bg-aux-yellow" />
          )}
        </button>
      }
    />
  )
}

// The top bar always runs discovery in dev mode.
const TOP_BAR_DEV_MODE = true
const REPEAT_CLICK_WINDOW_MS = 500

const STOP_LABELS: Record<CommandName, string> = {
  discovery: 'Stop discovery',
  templateMatch: 'Stop template match',
  projectMatch: 'Stop project match',
  shapeDownload: 'Stop shape download',
  minterSearch: 'Stop minter search',
}

function DiscoverOrStopButton(props: { project: string }) {
  const inFlight = useTerminalStore((state) => state.command.inFlight)
  const runningCommand = useTerminalStore((state) => state.command.name)
  const { killCommand, discover } = useDiscoveryCommand()
  const lastClickAtMs = useRef(Number.NEGATIVE_INFINITY)

  function onClick() {
    const nowMs = performance.now()
    const sinceLastClickMs = nowMs - lastClickAtMs.current
    lastClickAtMs.current = nowMs
    // A double-click, a double Enter or a held Enter would stop the run the
    // first activation started.
    if (sinceLastClickMs < REPEAT_CLICK_WINDOW_MS) {
      return
    }
    if (inFlight) {
      killCommand()
    } else {
      void discover(props.project, TOP_BAR_DEV_MODE)
    }
  }

  if (inFlight) {
    assert(runningCommand !== undefined, 'A command in flight has a name')
    return (
      <Button
        size="small"
        variant="destructive"
        className="h-7 gap-1"
        onClick={onClick}
      >
        <IconClose />
        <span className="max-md:hidden">{STOP_LABELS[runningCommand]}</span>
      </Button>
    )
  }
  return (
    <Button
      size="small"
      variant="solid"
      className="h-7 gap-1"
      onClick={onClick}
    >
      <IconRefresh className="size-3" />
      <span className="max-md:hidden">Discover</span>
    </Button>
  )
}

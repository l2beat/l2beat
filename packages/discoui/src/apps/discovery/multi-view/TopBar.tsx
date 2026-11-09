import type { MouseEvent } from 'react'
import { Link } from 'react-router'
import { Button } from '../../../components/Button'
import { IS_READONLY } from '../../../config/readonly'
import { IconClose } from '../../../icons/IconClose'
import { IconGear } from '../../../icons/IconGear'
import { IconPlus } from '../../../icons/IconPlus'
import { IconRefresh } from '../../../icons/IconRefresh'
import { cn } from '../../../utils/cn'
import { useTerminalStore } from '../panel-terminal/store'
import { useDiscoveryCommand } from '../panel-terminal/useDiscoveryCommand'
import { Search } from '../search/Search'
import { SettingsDialog } from './settings/SettingsDialog'
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

        <SettingsDialog
          defaultTabId="global"
          trigger={
            <button
              type="button"
              className="flex size-7 items-center justify-center rounded-sm text-coffee-300 hover:bg-coffee-700 hover:text-coffee-100"
              aria-label="Settings"
            >
              <IconGear />
            </button>
          }
        />
      </div>
    </div>
  )
}

// The top bar always runs discovery in dev mode.
const TOP_BAR_DEV_MODE = true

function DiscoverOrStopButton(props: { project: string }) {
  const inFlight = useTerminalStore((state) => state.command.inFlight)
  const { killCommand, discover } = useDiscoveryCommand()

  function onClick(event: MouseEvent<HTMLButtonElement>) {
    // The second click of a double-click would stop the run the first one started.
    if (isRepeatClick(event)) {
      return
    }
    if (inFlight) {
      killCommand()
    } else {
      void discover(props.project, TOP_BAR_DEV_MODE)
    }
  }

  if (inFlight) {
    return (
      <Button
        size="small"
        variant="destructive"
        className="h-7 gap-1"
        onClick={onClick}
        title="Stop the running command"
      >
        <IconClose />
        <span className="max-md:hidden">Stop</span>
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

function isRepeatClick(event: MouseEvent<HTMLButtonElement>): boolean {
  return event.detail > 1
}

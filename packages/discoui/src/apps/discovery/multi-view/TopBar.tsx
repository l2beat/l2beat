import { Link } from 'react-router'
import { Button } from '../../../components/Button'
import { IS_READONLY } from '../../../config/readonly'
import { IconClose } from '../../../icons/IconClose'
import { IconPlus } from '../../../icons/IconPlus'
import { IconRefresh } from '../../../icons/IconRefresh'
import { IconSparkle } from '../../../icons/IconSparkle'
import { cn } from '../../../utils/cn'
import { useTerminalStore } from '../panel-terminal/store'
import { useDiscoveryCommand } from '../panel-terminal/useDiscoveryCommand'
import { Search } from '../search/Search'
import { SettingsDialog } from './SettingsDialog'
import { addPanel, useDockingStore } from './store'

export function TopBar(props: { project: string }) {
  const layouts = useDockingStore((state) => state.layouts)
  const selectedLayout = useDockingStore((state) => state.selectedLayout)
  const loadLayout = useDockingStore((state) => state.loadLayout)
  const ensureLeaf = useDockingStore((state) => state.ensureLeaf)
  const resetLayout = useDockingStore((state) => state.resetLayout)
  const { command } = useTerminalStore()
  const { killCommand, discover } = useDiscoveryCommand()

  // By default when using top bar
  const useDevMode = true

  return (
    <div className="select-none items-center justify-between px-2 max-md:invisible md:flex md:h-10">
      <div className="hidden items-center gap-2 md:flex">
        <Link to="/ui">
          <img className="relative top-[-3px] h-[20px]" src="/logo.svg" />
        </Link>
        <p className="font-semibold text-coffee-100 text-sm">{props.project}</p>
        <div className="border-coffee-600 border-l pl-3">
          <Search />
        </div>
      </div>
      <div className="hidden items-center gap-3 md:flex">
        {!IS_READONLY && (
          <div className="flex justify-center gap-1 border-coffee-600 border-r pr-3">
            <Button
              size="small"
              variant="solid"
              className="h-7 gap-1"
              disabled={command.inFlight}
              onClick={() => discover(props.project, useDevMode)}
            >
              <IconRefresh className="size-3" />
              <span className="max-md:hidden">Discover</span>
            </Button>
            <Button
              size="small"
              variant="destructive"
              className="h-7 gap-1"
              disabled={!command.inFlight}
              onClick={killCommand}
            >
              <IconClose />
              <span className="max-md:hidden">Kill</span>
            </Button>
            <Button
              size="small"
              className="h-7 gap-1"
              onClick={() => ensureLeaf('ai')}
              title="Chat with Claude Code or Codex about this project"
            >
              <IconSparkle className="size-3" />
              <span className="max-md:hidden">AI</span>
            </Button>
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

        <SettingsDialog />
      </div>
    </div>
  )
}

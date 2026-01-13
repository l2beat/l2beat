import clsx from 'clsx'
import { Link } from 'react-router-dom'
import { Button } from '../../../components/Button'
import { IS_READONLY } from '../../../config/readonly'
import { IconClose } from '../../../icons/IconClose'
import { IconPlus } from '../../../icons/IconPlus'
import { IconRefresh } from '../../../icons/IconRefresh'
import { useTerminalStore } from '../panel-terminal/store'
import { useDiscoveryCommand } from '../panel-terminal/useDiscoveryCommand'
import { Search } from '../search/Search'
import { SettingsDialog } from './SettingsDialog'
import { useMultiViewStore } from './store'

export function TopBar(props: { project: string }) {
  const layouts = useMultiViewStore((state) => state.layouts)
  const selectedLayout = useMultiViewStore((state) => state.selectedLayout)
  const loadLayout = useMultiViewStore((state) => state.loadLayout)
  const addPanel = useMultiViewStore((state) => state.addPanel)
  const { command } = useTerminalStore()
  const { killCommand, discover } = useDiscoveryCommand()

  // By default when using top bar
  const useDevMode = true

  return (
    <div className="flex h-10 select-none items-center justify-between px-2">
      <div className="hidden items-center gap-2 md:flex">
        <Link to="/ui">
          <img className="-top-[3px] relative h-[20px]" src="/logo.svg" />
        </Link>
        <p>{props.project}</p>
        <div className="border-coffee-400/30 border-l pl-3">
          <Search />
        </div>
      </div>
      <div className="hidden gap-3 md:flex">
        {!IS_READONLY && (
          <div className="flex justify-center gap-1 border-coffee-400/30 border-r pr-3">
            <Button
              size="small"
              className="gap-1 rounded-sm"
              disabled={command.inFlight}
              onClick={() => discover(props.project, useDevMode)}
            >
              <IconRefresh className="size-3" />
              <span className="max-md:hidden">Discover</span>
            </Button>
            <Button
              size="small"
              variant="destructive"
              className="rounded-sm"
              disabled={!command.inFlight}
              onClick={killCommand}
            >
              <IconClose />
              <span className="max-md:hidden">Kill</span>
            </Button>
          </div>
        )}
        <div className="flex justify-center gap-1">
          <div className="inline-flex items-center gap-0.5 rounded-sm border border-coffee-400 bg-coffee-800/30 p-1">
            {layouts.map((_, i) => (
              <button
                key={i}
                className={clsx(
                  'flex size-5 items-center justify-center rounded-sm font-medium text-xs transition-all duration-100',
                  selectedLayout === i
                    ? 'bg-autumn-300 text-black shadow-sm'
                    : 'text-coffee-200 hover:bg-coffee-400/50 hover:text-coffee-100',
                )}
                onClick={() => loadLayout(i)}
                title={`Layout ${i + 1}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <Button
            size="small"
            className="rounded-sm"
            onClick={() => addPanel()}
          >
            <IconPlus />
            <span className="max-lg:hidden">Panel</span>
          </Button>
        </div>

        <SettingsDialog />
      </div>
    </div>
  )
}

import clsx from 'clsx'
import { Link } from 'react-router-dom'
import { Button } from '../../../components/Button'
import { IconPlus } from '../../../icons/IconPlus'
import { Search } from '../search/Search'
import { SettingsDialog } from './SettingsDialog'
import { useMultiViewStore } from './store'

export function TopBar(props: { project: string }) {
  const layouts = useMultiViewStore((state) => state.layouts)
  const selectedLayout = useMultiViewStore((state) => state.selectedLayout)
  const loadLayout = useMultiViewStore((state) => state.loadLayout)
  const addPanel = useMultiViewStore((state) => state.addPanel)

  return (
    <div className="flex h-10 select-none items-center justify-between px-2">
      <div className="hidden items-center gap-2 md:flex">
        <Link to="/ui">
          <img className="-top-[3px] relative h-[20px]" src="/logo.svg" />
        </Link>
        <p>{props.project}</p>
      </div>
      <div className="-translate-x-1/2 absolute left-1/2 z-50">
        <Search />
      </div>
      <div className="hidden gap-2 md:flex">
        <SettingsDialog />
        <div className="inline-flex items-center gap-0.5 border border-coffee-400 bg-coffee-800/30 p-1">
          {layouts.map((_, i) => (
            <button
              key={i}
              className={clsx(
                'flex h-6 w-6 items-center justify-center font-medium text-xs transition-all duration-100 max-lg:size-5',
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
          className="hidden items-center border-coffee-200 text-sm max-lg:p-2 md:flex"
          onClick={() => addPanel()}
        >
          <IconPlus />
          <span className="max-lg:hidden">Panel</span>
        </Button>
      </div>
    </div>
  )
}

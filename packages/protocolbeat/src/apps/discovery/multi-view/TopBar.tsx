import clsx from 'clsx'
import { Link } from 'react-router-dom'
import { Search } from '../search/Search'
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
      <div className="mx-auto">
        <Search />
      </div>
      <div className="hidden gap-2 md:flex">
        <div className="grid grid-cols-6">
          {layouts.map((_, i) => (
            <button
              key={i}
              className={clsx(
                'w-4',
                selectedLayout === i && 'bg-autumn-300 text-black ',
              )}
              onClick={() => loadLayout(i)}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <button className="hidden text-sm md:block" onClick={() => addPanel()}>
          Add Panel
        </button>
      </div>
    </div>
  )
}

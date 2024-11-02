import clsx from 'clsx'
import { useMultiViewStore } from './store'

export function TopBar(props: { project: string }) {
  const layouts = useMultiViewStore((state) => state.layouts)
  const selectedLayout = useMultiViewStore((state) => state.selectedLayout)
  const loadLayout = useMultiViewStore((state) => state.loadLayout)
  const addPanel = useMultiViewStore((state) => state.addPanel)
  return (
    <div className="flex h-10 items-center justify-between px-2">
      <div className="flex items-center gap-2">
        <a href="/ui">
          <img className="-top-[3px] relative h-[20px]" src="/logo.svg"></img>
        </a>
        <p>{props.project}</p>
      </div>
      <div className="flex gap-2">
        <div className="grid grid-cols-6">
          {layouts.map((_, i) => (
            <button
              key={i}
              className={clsx(
                'w-4',
                selectedLayout === i && 'bg-sun text-black ',
              )}
              onClick={() => loadLayout(i)}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <button onClick={() => addPanel()}>Add Panel</button>
      </div>
    </div>
  )
}

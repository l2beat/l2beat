import clsx from 'clsx'
import { useMultiViewStore } from './store'

export function TopBar(props: { project: string }) {
  const layouts = useMultiViewStore((state) => state.layouts)
  const selectedLayout = useMultiViewStore((state) => state.selectedLayout)
  const loadLayout = useMultiViewStore((state) => state.loadLayout)
  const saveLayout = useMultiViewStore((state) => state.saveLayout)
  const addPanel = useMultiViewStore((state) => state.addPanel)
  return (
    <div className="flex h-10 items-center justify-between px-2">
      <div>DISCOVERY {props.project}</div>
      <div className="flex gap-2">
        <div className="grid grid-cols-6">
          {layouts.map((_, i) => (
            <button
              key={i}
              className={clsx('w-4', selectedLayout === i && 'bg-autumn')}
              onClick={() => loadLayout(i)}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <button onClick={() => saveLayout(selectedLayout)}>Save Layout</button>
        <button onClick={() => addPanel()}>Add Panel</button>
      </div>
    </div>
  )
}

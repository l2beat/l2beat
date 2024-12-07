import clsx from 'clsx'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useMultiViewStore } from './store'

export function TopBar(props: { project: string }) {
  const layouts = useMultiViewStore((state) => state.layouts)
  const selectedLayout = useMultiViewStore((state) => state.selectedLayout)
  const loadLayout = useMultiViewStore((state) => state.loadLayout)
  const addPanel = useMultiViewStore((state) => state.addPanel)
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div className="flex h-10 select-none items-center justify-between px-2">
      <div className="flex items-center gap-2">
        <Link to="/ui">
          <img className="-top-[3px] relative h-[20px]" src="/logo.svg"></img>
        </Link>
        <div className="h-10 w-[1px] bg-coffee-600" />
        <div className="flex items-center gap-1">
          <p>{props.project}</p>
          <img
            src={`https://l2beat.com/icons/${props.project}.png`}
            className="size-5"
            style={{ display: isVisible ? 'block' : 'none' }}
            onLoad={() => setIsVisible(true)}
          />
        </div>
      </div>
      <div className="flex gap-2">
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
        <button className="text-sm" onClick={() => addPanel()}>
          Add Panel
        </button>
      </div>
    </div>
  )
}

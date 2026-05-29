import { useEffect, useState } from 'react'
import { useDockingHook } from './context'
import type { DropTarget } from './types'

export function DragOverlay() {
  const useStore = useDockingHook()
  const pickedUpTab = useStore((state) => state.pickedUpTab)
  const mouse = useStore((state) => state.mouse)
  const dragHover = useStore((state) => state.dragHover)
  const config = useStore((state) => state.config)
  const [hoverRect, setHoverRect] = useState<DOMRect | null>(null)

  useEffect(() => {
    if (!dragHover) {
      setHoverRect(null)
      return
    }
    setHoverRect(computeSplitRect(dragHover))
  }, [dragHover, mouse.x, mouse.y])

  if (pickedUpTab === undefined) return null

  return (
    <>
      {hoverRect && (
        <div
          className="pointer-events-none fixed z-[999] border-2 border-coffee-200 bg-coffee-200/20"
          style={{
            left: hoverRect.left,
            top: hoverRect.top,
            width: hoverRect.width,
            height: hoverRect.height,
          }}
        />
      )}
      <div
        className="pointer-events-none fixed z-[1000] flex h-[28px] items-center gap-1.5 border border-coffee-400 bg-coffee-800 px-3 font-bold text-coffee-100 text-xs uppercase opacity-90 shadow-lg"
        style={{ left: mouse.x + 8, top: mouse.y + 8 }}
      >
        {config.renderTabLabel(pickedUpTab)}
      </div>
    </>
  )
}

function computeSplitRect(target: DropTarget): DOMRect | null {
  const body = document.querySelector<HTMLElement>(
    `[data-leaf-tab="${CSS.escape(target.tab)}"]`,
  )
  if (!body) return null
  const rect = body.getBoundingClientRect()
  const halfW = rect.width / 2
  const halfH = rect.height / 2
  if (target.edge === 'left') {
    return new DOMRect(rect.left, rect.top, halfW, rect.height)
  }
  if (target.edge === 'right') {
    return new DOMRect(rect.left + halfW, rect.top, halfW, rect.height)
  }
  if (target.edge === 'top') {
    return new DOMRect(rect.left, rect.top, rect.width, halfH)
  }
  return new DOMRect(rect.left, rect.top + halfH, rect.width, halfH)
}

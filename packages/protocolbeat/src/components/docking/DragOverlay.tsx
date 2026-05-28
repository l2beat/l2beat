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
    const rect = computeHoverRect(dragHover)
    setHoverRect(rect)
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

function computeHoverRect(target: DropTarget): DOMRect | null {
  if (target.kind === 'into-group') {
    return computeIntoGroupRect(target.groupId, target.index)
  }
  return computeSplitRect(target.groupId, target.edge)
}

function computeIntoGroupRect(groupId: string, index: number): DOMRect | null {
  const body = document.querySelector<HTMLElement>(
    `[data-group-body-id="${cssAttr(groupId)}"]`,
  )
  if (!body) return null
  const strip = document.querySelector<HTMLElement>(
    `[data-tab-strip-group-id="${cssAttr(groupId)}"]`,
  )
  if (!strip) return body.getBoundingClientRect()
  const tabs = strip.querySelectorAll<HTMLElement>('[data-tab-id]')
  if (tabs.length === 0) {
    return strip.getBoundingClientRect()
  }
  const stripRect = strip.getBoundingClientRect()
  let lineX = stripRect.left
  if (index >= tabs.length) {
    const last = tabs[tabs.length - 1]
    if (last) lineX = last.getBoundingClientRect().right
  } else {
    const target = tabs[index]
    if (target) lineX = target.getBoundingClientRect().left
  }
  const bodyRect = body.getBoundingClientRect()
  return new DOMRect(
    lineX - 2,
    stripRect.top,
    4,
    stripRect.height + bodyRect.height,
  )
}

function computeSplitRect(
  groupId: string,
  edge: 'top' | 'right' | 'bottom' | 'left',
): DOMRect | null {
  const body = document.querySelector<HTMLElement>(
    `[data-group-body-id="${cssAttr(groupId)}"]`,
  )
  if (!body) return null
  const rect = body.getBoundingClientRect()
  const halfW = rect.width / 2
  const halfH = rect.height / 2
  if (edge === 'left') {
    return new DOMRect(rect.left, rect.top, halfW, rect.height)
  }
  if (edge === 'right') {
    return new DOMRect(rect.left + halfW, rect.top, halfW, rect.height)
  }
  if (edge === 'top') {
    return new DOMRect(rect.left, rect.top, rect.width, halfH)
  }
  return new DOMRect(rect.left, rect.top + halfH, rect.width, halfH)
}

function cssAttr(value: string): string {
  return CSS.escape(value)
}

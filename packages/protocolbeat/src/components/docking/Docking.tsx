import { useEffect, useRef } from 'react'
import { type DockingHook, DockingProvider } from './context'
import { DragOverlay } from './DragOverlay'
import { LeafView } from './LeafView'
import { NodeView } from './NodeView'
import { findLeafByTab } from './tree'
import type { DropTarget, Edge, LayoutNode } from './types'

const DRAG_THRESHOLD_PX = 5

interface PendingDragState {
  tab: string
  startX: number
  startY: number
}

export function Docking(props: { useStore: DockingHook }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const useStore = props.useStore
  const tree = useStore((state) => state.tree)
  const fullScreenTab = useStore((state) => state.fullScreenTab)
  const pickedUpTab = useStore((state) => state.pickedUpTab)

  const pendingDragRef = useRef<PendingDragState | null>(null)

  useGlobalMouseHandlers({ containerRef, useStore, pendingDragRef })

  const fullScreenLeaf =
    fullScreenTab !== undefined ? findLeafByTab(tree, fullScreenTab) : undefined

  return (
    <DockingProvider value={useStore}>
      <div
        ref={containerRef}
        className="relative h-full w-full"
        data-docking-root="true"
      >
        <div className="absolute inset-0 flex flex-col">
          {fullScreenLeaf ? (
            <LeafView node={fullScreenLeaf} />
          ) : (
            <NodeView node={tree} />
          )}
        </div>
        {pickedUpTab !== undefined && <DragOverlay />}
      </div>
    </DockingProvider>
  )
}

function useGlobalMouseHandlers(args: {
  containerRef: React.RefObject<HTMLDivElement | null>
  useStore: DockingHook
  pendingDragRef: React.MutableRefObject<PendingDragState | null>
}) {
  const { containerRef, useStore, pendingDragRef } = args

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (e.button !== 0) return
      if (!containerContains(containerRef.current, e.target)) return
      const target = e.target as HTMLElement
      const handle = target.closest<HTMLElement>('[data-leaf-handle]')
      const tab = handle?.dataset.leafHandle
      if (tab) {
        pendingDragRef.current = { tab, startX: e.clientX, startY: e.clientY }
        useStore.getState().activateTab(tab)
      }
    }

    function onMouseMove(e: MouseEvent) {
      useStore.getState().setMouse(e.clientX, e.clientY)
      const pending = pendingDragRef.current
      if (pending) {
        const dx = e.clientX - pending.startX
        const dy = e.clientY - pending.startY
        if (Math.hypot(dx, dy) > DRAG_THRESHOLD_PX) {
          useStore.getState().pickUpTab(pending.tab)
          pendingDragRef.current = null
        }
      }
      const state = useStore.getState()
      if (state.pickedUpTab !== undefined) {
        const hover = hitTestDropTarget(
          e.clientX,
          e.clientY,
          state.pickedUpTab,
          state.tree,
        )
        if (!sameTarget(state.dragHover, hover)) {
          useStore.getState().setDragHover(hover)
        }
      }
    }

    function onMouseUp() {
      if (pendingDragRef.current) {
        pendingDragRef.current = null
        return
      }
      if (useStore.getState().pickedUpTab !== undefined) {
        useStore.getState().dropTab()
      }
    }

    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    return () => {
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [containerRef, useStore, pendingDragRef])
}

function containerContains(
  container: HTMLDivElement | null,
  target: EventTarget | null,
): boolean {
  if (!container || !(target instanceof Node)) return false
  return container.contains(target)
}

function hitTestDropTarget(
  x: number,
  y: number,
  draggedTab: string,
  tree: LayoutNode,
): DropTarget | undefined {
  const el = document.elementFromPoint(x, y) as HTMLElement | null
  if (!el) return undefined
  const target = el.closest<HTMLElement>('[data-leaf-tab]')
  if (!target) return undefined
  const tab = target.dataset.leafTab
  if (!tab || tab === draggedTab) return undefined
  if (!findLeafByTab(tree, tab)) return undefined
  const rect = target.getBoundingClientRect()
  const edge = pickEdge(
    (x - rect.left) / rect.width,
    (y - rect.top) / rect.height,
  )
  return { tab, edge }
}

function pickEdge(dx: number, dy: number): Edge {
  const fromLeft = dx
  const fromRight = 1 - dx
  const fromTop = dy
  const fromBottom = 1 - dy
  const min = Math.min(fromLeft, fromRight, fromTop, fromBottom)
  if (min === fromLeft) return 'left'
  if (min === fromRight) return 'right'
  if (min === fromTop) return 'top'
  return 'bottom'
}

function sameTarget(
  a: DropTarget | undefined,
  b: DropTarget | undefined,
): boolean {
  if (a === b) return true
  if (!a || !b) return false
  return a.tab === b.tab && a.edge === b.edge
}

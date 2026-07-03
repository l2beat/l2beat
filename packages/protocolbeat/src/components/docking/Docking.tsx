import { useEffect, useRef } from 'react'
import { type DockingHook, DockingProvider } from './context'
import { DragOverlay } from './DragOverlay'
import { LeafView } from './LeafView'
import { NodeView } from './NodeView'
import { findLeafByKey } from './tree'
import type { DropTarget, Edge, LayoutNode } from './types'

const DRAG_THRESHOLD_PX = 5

interface PendingDragState {
  key: string
  startX: number
  startY: number
}

export function Docking(props: { useStore: DockingHook }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const useStore = props.useStore
  const tree = useStore((state) => state.tree)
  const fullScreenKey = useStore((state) => state.fullScreenLeaf)
  const pickedUpLeaf = useStore((state) => state.pickedUpLeaf)

  const pendingDragRef = useRef<PendingDragState | null>(null)

  useGlobalMouseHandlers({ containerRef, useStore, pendingDragRef })

  const fullScreenLeaf =
    fullScreenKey !== undefined ? findLeafByKey(tree, fullScreenKey) : undefined

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
        {pickedUpLeaf !== undefined && <DragOverlay />}
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
      const key =
        target.closest<HTMLElement>('[data-leaf-key]')?.dataset.leafKey
      if (!key) return
      useStore.getState().activateLeaf(key)
      // Only the header (nested in the pane) is a drag handle; the body just
      // focuses. Interactive controls inside the header (buttons, the kind
      // switcher) never start drags, so consumers need no propagation guards.
      const isInteractive = target.closest('button, input, select, textarea, a')
      if (target.closest('[data-leaf-handle]') && !isInteractive) {
        pendingDragRef.current = { key, startX: e.clientX, startY: e.clientY }
      }
    }

    function onMouseMove(e: MouseEvent) {
      const pending = pendingDragRef.current
      if (pending) {
        const dx = e.clientX - pending.startX
        const dy = e.clientY - pending.startY
        if (Math.hypot(dx, dy) > DRAG_THRESHOLD_PX) {
          useStore.getState().pickUpLeaf(pending.key)
          pendingDragRef.current = null
        }
      }
      const state = useStore.getState()
      // Only the drag overlay reads the mouse; tracking it outside a drag
      // would run a store update on every mouse movement in the app.
      if (state.pickedUpLeaf !== undefined) {
        state.setMouse(e.clientX, e.clientY)
        const hover = hitTestDropTarget(
          e.clientX,
          e.clientY,
          state.pickedUpLeaf,
          state.tree,
        )
        if (!sameTarget(state.dragHover, hover)) {
          state.setDragHover(hover)
        }
      }
    }

    function onMouseUp() {
      if (pendingDragRef.current) {
        pendingDragRef.current = null
        return
      }
      if (useStore.getState().pickedUpLeaf !== undefined) {
        useStore.getState().dropLeaf()
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
  draggedKey: string,
  tree: LayoutNode,
): DropTarget | undefined {
  const el = document.elementFromPoint(x, y) as HTMLElement | null
  if (!el) return undefined
  const target = el.closest<HTMLElement>('[data-leaf-key]')
  if (!target) return undefined
  const key = target.dataset.leafKey
  if (!key || key === draggedKey) return undefined
  if (!findLeafByKey(tree, key)) return undefined
  const rect = target.getBoundingClientRect()
  const edge = pickEdge(
    (x - rect.left) / rect.width,
    (y - rect.top) / rect.height,
  )
  return { key, edge }
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
  return a.key === b.key && a.edge === b.edge
}

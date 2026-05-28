import { useEffect, useMemo, useRef } from 'react'
import { type DockingHook, DockingProvider } from './context'
import { DragOverlay } from './DragOverlay'
import { NodeView } from './NodeView'
import { PositionedBody } from './PositionedBody'
import { allTabs, findLeafById } from './tree'
import type { DropTarget, Edge, LayoutNode, NodeId } from './types'

const DRAG_THRESHOLD_PX = 5
const MIN_PANE_PX = 120

interface ResizingState {
  splitId: NodeId
  index: number
  splitter: HTMLElement
  isRow: boolean
}

interface PendingDragState {
  tab: string
  startX: number
  startY: number
}

export function Docking(props: { useStore: DockingHook }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const useStore = props.useStore
  const tree = useStore((state) => state.tree)
  const pickedUpTab = useStore((state) => state.pickedUpTab)

  const resizingRef = useRef<ResizingState | null>(null)
  const pendingDragRef = useRef<PendingDragState | null>(null)

  useGlobalMouseHandlers({
    containerRef,
    useStore,
    resizingRef,
    pendingDragRef,
  })

  const visibleTabs = useMemo(() => allTabs(tree), [tree])

  return (
    <DockingProvider value={useStore}>
      <div
        ref={containerRef}
        className="relative h-full w-full"
        data-docking-root="true"
      >
        <div className="absolute inset-0 flex flex-col">
          <NodeView node={tree} />
        </div>
        {visibleTabs.map((tab) => (
          <PositionedBody key={tab} tab={tab} rootRef={containerRef} />
        ))}
        {pickedUpTab !== undefined && <DragOverlay />}
      </div>
    </DockingProvider>
  )
}

function useGlobalMouseHandlers(args: {
  containerRef: React.RefObject<HTMLDivElement | null>
  useStore: DockingHook
  resizingRef: React.MutableRefObject<ResizingState | null>
  pendingDragRef: React.MutableRefObject<PendingDragState | null>
}) {
  const { containerRef, useStore, resizingRef, pendingDragRef } = args

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (e.button !== 0) return
      if (!containerContains(containerRef.current, e.target)) return
      const target = e.target as HTMLElement
      const splitter = target.closest<HTMLElement>('[data-splitter-split-id]')
      if (splitter) {
        startResize(splitter, resizingRef)
        e.preventDefault()
        return
      }
      const header = target.closest<HTMLElement>('[data-leaf-id]')
      if (header) {
        const tab = header.dataset.leafTab
        if (tab) {
          pendingDragRef.current = {
            tab,
            startX: e.clientX,
            startY: e.clientY,
          }
          useStore.getState().activateTab(tab)
        }
      }
    }

    function onMouseMove(e: MouseEvent) {
      useStore.getState().setMouse(e.clientX, e.clientY)
      if (resizingRef.current) {
        applyResize(useStore, resizingRef.current, e)
        return
      }
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
      if (resizingRef.current) {
        resizingRef.current = null
        return
      }
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
  }, [containerRef, useStore, resizingRef, pendingDragRef])
}

function containerContains(
  container: HTMLDivElement | null,
  target: EventTarget | null,
): boolean {
  if (!container || !(target instanceof Node)) return false
  return container.contains(target)
}

function startResize(
  splitter: HTMLElement,
  ref: React.MutableRefObject<ResizingState | null>,
): void {
  const splitId = splitter.dataset.splitterSplitId ?? ''
  const indexRaw = splitter.dataset.splitterIndex ?? '0'
  const index = Number.parseInt(indexRaw, 10)
  const isRow = splitter.dataset.splitterDirection === 'row'
  ref.current = { splitId, index, splitter, isRow }
}

function applyResize(
  useStore: DockingHook,
  state: ResizingState,
  e: MouseEvent,
): void {
  const before = state.splitter.previousElementSibling
  const after = state.splitter.nextElementSibling
  if (!before || !after) return
  const beforeRect = before.getBoundingClientRect()
  const afterRect = after.getBoundingClientRect()
  const min = state.isRow ? beforeRect.left : beforeRect.top
  const max = state.isRow ? afterRect.right : afterRect.bottom
  const span = max - min
  if (span <= 0) return
  const pos = state.isRow ? e.clientX : e.clientY
  const minFrac = Math.min(0.45, MIN_PANE_PX / span)
  const raw = (pos - min) / span
  const clamped = Math.max(minFrac, Math.min(1 - minFrac, raw))
  useStore.getState().resizeSplit(state.splitId, state.index, clamped)
}

function hitTestDropTarget(
  x: number,
  y: number,
  draggedTab: string,
  tree: LayoutNode,
): DropTarget | undefined {
  const el = document.elementFromPoint(x, y) as HTMLElement | null
  if (!el) return undefined
  const bodyEl = el.closest<HTMLElement>('[data-leaf-body-id]')
  const headerEl = el.closest<HTMLElement>('[data-leaf-id]')
  const target = bodyEl ?? headerEl
  if (!target) return undefined
  const leafId = bodyEl?.dataset.leafBodyId ?? headerEl?.dataset.leafId
  if (!leafId) return undefined
  const leaf = findLeafById(tree, leafId)
  if (!leaf || leaf.tab === draggedTab) return undefined
  const rect = target.getBoundingClientRect()
  const edge = pickEdge(
    (x - rect.left) / rect.width,
    (y - rect.top) / rect.height,
  )
  return { kind: 'split', leafId, edge }
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
  return a.leafId === b.leafId && a.edge === b.edge
}

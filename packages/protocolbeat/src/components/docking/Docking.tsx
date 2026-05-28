import { useEffect, useMemo, useRef } from 'react'
import { type DockingHook, DockingProvider } from './context'
import { DragOverlay } from './DragOverlay'
import { NodeView } from './NodeView'
import { findGroup } from './tree'
import type { DropTarget, Edge, LayoutNode, NodeId } from './types'

const DRAG_THRESHOLD_PX = 5
const MIN_PANE_PX = 120
const EDGE_FRACTION = 0.25

interface ResizingState {
  splitId: NodeId
  index: number
  splitter: HTMLElement
  isRow: boolean
}

interface PendingDragState {
  tabId: string
  startX: number
  startY: number
}

export function Docking(props: { useStore: DockingHook }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const useStore = props.useStore
  const fullScreenTab = useStore((state) => state.fullScreenTab)
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

  const fullScreenGroupId = useMemo(() => {
    if (fullScreenTab === undefined) return undefined
    for (const node of iterateGroups(tree)) {
      if (node.tabs.includes(fullScreenTab)) {
        return node.id
      }
    }
    return undefined
  }, [tree, fullScreenTab])

  return (
    <DockingProvider value={useStore}>
      <div
        ref={containerRef}
        className="relative flex h-full w-full flex-col"
        data-docking-root="true"
        data-fullscreen-group={fullScreenGroupId ?? ''}
      >
        <NodeView node={tree} />
        {pickedUpTab !== undefined && <DragOverlay />}
      </div>
    </DockingProvider>
  )
}

function* iterateGroups(tree: LayoutNode) {
  const stack: LayoutNode[] = [tree]
  while (stack.length > 0) {
    const node = stack.pop()
    if (!node) continue
    if (node.kind === 'group') {
      yield node
    } else {
      for (let i = node.children.length - 1; i >= 0; i--) {
        const child = node.children[i]
        if (child) stack.push(child)
      }
    }
  }
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
      const tab = target.closest<HTMLElement>('[data-tab-id]')
      if (tab) {
        pendingDragRef.current = {
          tabId: tab.dataset.tabId ?? '',
          startX: e.clientX,
          startY: e.clientY,
        }
        const groupId = tab.dataset.tabGroupId
        const tabId = tab.dataset.tabId
        if (groupId && tabId) {
          activateTabInGroup(useStore, groupId, tabId)
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
          useStore.getState().pickUpTab(pending.tabId)
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

function activateTabInGroup(
  useStore: DockingHook,
  groupId: string,
  tabId: string,
): void {
  const state = useStore.getState()
  const group = findGroup(state.tree, groupId)
  if (!group) return
  if (!group.tabs.includes(tabId)) return
  if (state.activeTab !== tabId || group.active !== tabId) {
    useStore.getState().activateTab(tabId)
  }
}

function hitTestDropTarget(
  x: number,
  y: number,
  draggedTab: string,
  tree: LayoutNode,
): DropTarget | undefined {
  const el = document.elementFromPoint(x, y) as HTMLElement | null
  if (!el) return undefined
  const tabEl = el.closest<HTMLElement>('[data-tab-id]')
  if (tabEl) return hitTab(tabEl, x)
  const stripEl = el.closest<HTMLElement>('[data-tab-strip-group-id]')
  if (stripEl) return hitStrip(stripEl, x, draggedTab, tree)
  const bodyEl = el.closest<HTMLElement>('[data-group-body-id]')
  if (bodyEl) return hitBody(bodyEl, x, y, draggedTab, tree)
  return undefined
}

function hitTab(tabEl: HTMLElement, x: number): DropTarget | undefined {
  const groupId = tabEl.dataset.tabGroupId
  if (!groupId) return undefined
  const tabs = Array.from(
    tabEl.parentElement?.querySelectorAll<HTMLElement>('[data-tab-id]') ?? [],
  )
  const idx = tabs.indexOf(tabEl)
  if (idx < 0) return undefined
  const rect = tabEl.getBoundingClientRect()
  const insertAfter = x > rect.left + rect.width / 2
  return {
    kind: 'into-group',
    groupId,
    index: insertAfter ? idx + 1 : idx,
  }
}

function hitStrip(
  stripEl: HTMLElement,
  _x: number,
  _draggedTab: string,
  tree: LayoutNode,
): DropTarget | undefined {
  const groupId = stripEl.dataset.tabStripGroupId
  if (!groupId) return undefined
  const group = findGroup(tree, groupId)
  if (!group) return undefined
  return { kind: 'into-group', groupId, index: group.tabs.length }
}

function hitBody(
  bodyEl: HTMLElement,
  x: number,
  y: number,
  _draggedTab: string,
  tree: LayoutNode,
): DropTarget | undefined {
  const groupId = bodyEl.dataset.groupBodyId
  if (!groupId) return undefined
  const rect = bodyEl.getBoundingClientRect()
  const dx = (x - rect.left) / rect.width
  const dy = (y - rect.top) / rect.height
  const edge = pickEdge(dx, dy)
  if (edge === undefined) {
    const group = findGroup(tree, groupId)
    if (!group) return undefined
    return { kind: 'into-group', groupId, index: group.tabs.length }
  }
  return { kind: 'split', groupId, edge }
}

function pickEdge(dx: number, dy: number): Edge | undefined {
  const fromLeft = dx
  const fromRight = 1 - dx
  const fromTop = dy
  const fromBottom = 1 - dy
  const min = Math.min(fromLeft, fromRight, fromTop, fromBottom)
  if (min >= EDGE_FRACTION) return undefined
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
  if (a.kind !== b.kind) return false
  if (a.kind === 'into-group' && b.kind === 'into-group') {
    return a.groupId === b.groupId && a.index === b.index
  }
  if (a.kind === 'split' && b.kind === 'split') {
    return a.groupId === b.groupId && a.edge === b.edge
  }
  return false
}

import { Fragment, useRef } from 'react'
import { useDockingHook } from './context'
import { LeafView } from './LeafView'
import type { LayoutNode, SplitNode } from './types'

// JSX naturally mirrors the tree; depth is bounded by the user's layout
// (typically 2-4 levels). This is not the kind of unbounded recursion
// AGENTS.md warns about.

const MIN_PANE_PX = 120

export function NodeView(props: { node: LayoutNode }) {
  if (props.node.kind === 'leaf') {
    return <LeafView node={props.node} />
  }
  return <SplitView node={props.node} />
}

function SplitView(props: { node: SplitNode }) {
  const isRow = props.node.direction === 'row'
  return (
    <div
      className={
        isRow ? 'flex h-full w-full flex-row' : 'flex h-full w-full flex-col'
      }
    >
      {props.node.children.map((child, i) => (
        <Fragment key={child.kind === 'leaf' ? child.tab : child.id}>
          {i > 0 && (
            <Splitter splitId={props.node.id} index={i - 1} isRow={isRow} />
          )}
          <div
            className="flex min-h-0 min-w-0 overflow-hidden"
            style={{
              flexGrow: props.node.sizes[i],
              flexShrink: props.node.sizes[i],
              flexBasis: 0,
            }}
          >
            <NodeView node={child} />
          </div>
        </Fragment>
      ))}
    </div>
  )
}

function Splitter(props: { splitId: string; index: number; isRow: boolean }) {
  const useStore = useDockingHook()
  const resizeSplit = useStore((state) => state.resizeSplit)
  const ref = useRef<HTMLDivElement>(null)

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const el = ref.current
    if (!el || !el.hasPointerCapture(e.pointerId)) return
    const before = el.previousElementSibling
    const after = el.nextElementSibling
    if (!before || !after) return
    const beforeRect = before.getBoundingClientRect()
    const afterRect = after.getBoundingClientRect()
    const min = props.isRow ? beforeRect.left : beforeRect.top
    const max = props.isRow ? afterRect.right : afterRect.bottom
    const span = max - min
    if (span <= 0) return
    const pos = props.isRow ? e.clientX : e.clientY
    const minFrac = Math.min(0.45, MIN_PANE_PX / span)
    const raw = (pos - min) / span
    const clamped = Math.max(minFrac, Math.min(1 - minFrac, raw))
    resizeSplit(props.splitId, props.index, clamped)
  }

  return (
    <div
      ref={ref}
      onPointerDown={(e) => {
        e.preventDefault()
        ref.current?.setPointerCapture(e.pointerId)
      }}
      onPointerMove={onPointerMove}
      onPointerUp={(e) => ref.current?.releasePointerCapture(e.pointerId)}
      className={
        props.isRow
          ? 'w-[6px] shrink-0 cursor-col-resize select-none bg-coffee-600 hover:bg-coffee-400'
          : 'h-[6px] shrink-0 cursor-row-resize select-none bg-coffee-600 hover:bg-coffee-400'
      }
    />
  )
}

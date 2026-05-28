import { Fragment } from 'react'
import { LeafView } from './LeafView'
import type { LayoutNode, SplitNode } from './types'

// JSX naturally mirrors the tree; depth is bounded by the user's layout
// (typically 2-4 levels). This is not the kind of unbounded recursion
// AGENTS.md warns about.

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
      data-split-id={props.node.id}
    >
      {props.node.children.map((child, i) => (
        <Fragment key={child.id}>
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
            data-node-id={child.id}
          >
            <NodeView node={child} />
          </div>
        </Fragment>
      ))}
    </div>
  )
}

function Splitter(props: { splitId: string; index: number; isRow: boolean }) {
  return (
    <div
      data-splitter-split-id={props.splitId}
      data-splitter-index={props.index}
      data-splitter-direction={props.isRow ? 'row' : 'column'}
      className={
        props.isRow
          ? 'w-[6px] shrink-0 cursor-col-resize bg-coffee-600 hover:bg-coffee-400'
          : 'h-[6px] shrink-0 cursor-row-resize bg-coffee-600 hover:bg-coffee-400'
      }
    />
  )
}

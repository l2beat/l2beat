import { type ReactNode, useMemo, useRef, useState } from 'react'
import { useResizeObserver } from '~/hooks/useResizeObserver'
import type { InteropTokenRelationsGraph } from '~/server/features/layer2s/interop/token/getInteropTokenRelationsGraph'
import { cn } from '~/utils/cn'
import { edgeKey, getActiveBacking } from './graphSelectors'
import { layoutRelationsGraph } from './layoutRelationsGraph'
import {
  RelationsEdgeBadge,
  RelationsEdgeMarkers,
  RelationsEdgePath,
} from './RelationsEdges'
import { getNodeSize, RelationsNode } from './RelationsNode'
import { useRelationsCamera } from './relationsCamera'
import { routeRelationsEdges } from './routeRelationsEdges'
import { useDragToPan } from './useDragToPan'

const ZOOM_STEP = 1.25
const DOT_GRID_STEP = 24

interface Props {
  graph: InteropTokenRelationsGraph
  unconnectedIds: ReadonlySet<string>
  selectedNodeId: string | undefined
  onSelectNode: (id: string | undefined) => void
  onExpand?: () => void
  className?: string
}

export function RelationsDiagram({
  graph,
  unconnectedIds,
  selectedNodeId,
  onSelectNode,
  onExpand,
  className,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const size = useResizeObserver({ ref: containerRef })
  const viewport = { width: size.width ?? 960, height: size.height ?? 520 }

  const layout = useMemo(() => {
    const items = graph.nodes.map((node) => ({
      id: node.id,
      volume: node.volume,
      ...getNodeSize(node),
    }))
    return layoutRelationsGraph(
      items.filter((item) => !unconnectedIds.has(item.id)),
      graph.edges,
      items.filter((item) => unconnectedIds.has(item.id)),
    )
  }, [graph, unconnectedIds])
  const paths = useMemo(
    () => routeRelationsEdges(graph.edges, layout),
    [graph.edges, layout],
  )

  // Open on the busiest source so the first thing seen is where backing starts.
  const focusX = useMemo(() => {
    const top = graph.nodes
      .filter((node) => layout.rowOf.get(node.id) === 0)
      .toSorted((a, b) => (b.volume ?? -1) - (a.volume ?? -1))[0]
    const box = top && layout.boxes.get(top.id)
    return box ? box.x + box.width / 2 : undefined
  }, [graph.nodes, layout])
  const { camera, setCamera, zoomBy, reset } = useRelationsCamera(
    layout,
    viewport,
    focusX,
    containerRef,
  )
  const pan = useDragToPan(camera, setCamera)

  const [hoveredId, setHoveredId] = useState<string>()
  const activeId = hoveredId ?? selectedNodeId
  const active = useMemo(
    () => (activeId ? getActiveBacking(graph.edges, activeId) : undefined),
    [graph.edges, activeId],
  )
  const sourceIds = useMemo(() => {
    const backed = new Set(graph.edges.map((edge) => edge.to))
    return new Set(
      graph.edges.map((edge) => edge.from).filter((id) => !backed.has(id)),
    )
  }, [graph.edges])

  const transform = `translate(${camera.x}px, ${camera.y}px) scale(${camera.k})`
  const dotGrid = {
    backgroundImage:
      'radial-gradient(var(--color-divider) 1px, transparent 1px)',
    backgroundSize: `${DOT_GRID_STEP * camera.k}px ${DOT_GRID_STEP * camera.k}px`,
    backgroundPosition: `${camera.x}px ${camera.y}px`,
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative touch-none select-none overflow-hidden rounded-lg border border-divider bg-background',
        className,
      )}
      style={dotGrid}
      {...pan.handlers}
      onClick={() => {
        if (!pan.consumeSuppressedClick()) onSelectNode(undefined)
      }}
    >
      <svg className="absolute inset-0 size-full" aria-hidden>
        <RelationsEdgeMarkers />
        <g transform={`translate(${camera.x}, ${camera.y}) scale(${camera.k})`}>
          {layout.unconnectedDividerY !== undefined && (
            <line
              x1={0}
              x2={layout.width}
              y1={layout.unconnectedDividerY}
              y2={layout.unconnectedDividerY}
              className="stroke-divider"
              strokeDasharray="2 6"
            />
          )}
          {graph.edges.map((edge) => {
            const path = paths.get(edgeKey(edge))
            if (!path) return null
            const isHighlighted = active?.edgeKeys.has(edgeKey(edge)) ?? false
            return (
              <RelationsEdgePath
                key={edgeKey(edge)}
                path={path}
                isHighlighted={isHighlighted}
                isDimmed={active !== undefined && !isHighlighted}
              />
            )
          })}
        </g>
      </svg>

      <div
        className="absolute top-0 left-0 origin-top-left"
        style={{ transform }}
      >
        {graph.nodes.map((node) => {
          const box = layout.boxes.get(node.id)
          if (!box) return null
          return (
            <RelationsNode
              key={node.id}
              node={node}
              box={box}
              isSelected={selectedNodeId === node.id}
              isDimmed={active !== undefined && !active.nodeIds.has(node.id)}
              isUnconnected={unconnectedIds.has(node.id)}
              isSource={sourceIds.has(node.id)}
              onSelect={onSelectNode}
              onHover={setHoveredId}
            />
          )
        })}
        {graph.edges.map((edge) => {
          const path = paths.get(edgeKey(edge))
          if (!path) return null
          return (
            <RelationsEdgeBadge
              key={edgeKey(edge)}
              edge={edge}
              at={path}
              isDimmed={
                active !== undefined && !active.edgeKeys.has(edgeKey(edge))
              }
            />
          )
        })}
      </div>

      <p className="absolute bottom-3 left-3 rounded-md border border-divider bg-surface-primary px-2 py-1 text-label-value-12 text-secondary">
        Past 24h crosschain volume
      </p>
      <div className="absolute right-3 bottom-3 flex flex-col gap-1">
        <ControlButton label="Zoom in" onClick={() => zoomBy(ZOOM_STEP)}>
          <Glyph d="M5 12h14M12 5v14" />
        </ControlButton>
        <ControlButton label="Zoom out" onClick={() => zoomBy(1 / ZOOM_STEP)}>
          <Glyph d="M5 12h14" />
        </ControlButton>
        <ControlButton label="Reset view" onClick={reset}>
          <Glyph d="M20 12a8 8 0 1 1-2.3-5.7M20 4v5h-5" />
        </ControlButton>
        {onExpand && (
          <ControlButton label="Open larger view" onClick={onExpand}>
            <Glyph d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
          </ControlButton>
        )}
      </div>
    </div>
  )
}

function ControlButton({
  label,
  onClick,
  children,
}: {
  label: string
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={(event) => {
        event.stopPropagation()
        onClick()
      }}
      className="flex size-7 items-center justify-center rounded-md border border-divider bg-surface-primary text-secondary hover:bg-surface-tertiary hover:text-primary"
    >
      {children}
    </button>
  )
}

function Glyph({ d }: { d: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d={d} />
    </svg>
  )
}

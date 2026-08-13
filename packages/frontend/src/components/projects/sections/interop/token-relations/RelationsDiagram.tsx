import { useCallback, useMemo, useRef, useState } from 'react'
import { useBreakpoint } from '~/hooks/useBreakpoint'
import { useResizeObserver } from '~/hooks/useResizeObserver'
import type { InteropTokenRelationsGraph } from '~/server/features/scaling/interop/token/getInteropTokenRelationsGraph'
import { cn } from '~/utils/cn'
import { RelationsDetails } from './RelationsDetails'
import {
  ARROW_MARKER_ACTIVE_ID,
  ARROW_MARKER_ID,
  RelationsEdge,
  RelationsEdgeBridges,
} from './RelationsEdge'
import {
  getRelationsNodeHeight,
  getRelationsNodeWidth,
  RelationsNode,
} from './RelationsNode'
import { useRelationsCamera } from './useRelationsCamera'
import {
  getWrappedEdgeGeometry,
  getWrappedSourceLanes,
  getWrappedTargetPorts,
  layoutWrappedRelationsGraph,
  wrappedEdgeKey,
} from './wrappedLayout'

const DESKTOP_HEIGHT = 520
const MOBILE_HEIGHT = 380
// Below this a pointer press counts as a click, not a drag. Without the slack,
// the hand-jitter in any real click cancels the selection.
const CLICK_SLOP = 4

interface Props {
  graph: InteropTokenRelationsGraph
  selectedNodeId: string | undefined
  onSelectNode: (nodeId: string | undefined) => void
  /** Omitted inside the larger view, which is already expanded. */
  onExpand?: () => void
  heightOverride?: number
}

export function RelationsDiagram({
  graph: fullGraph,
  selectedNodeId,
  onSelectNode,
  onExpand,
  heightOverride,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { width } = useResizeObserver({ ref: containerRef })
  const breakpoint = useBreakpoint()
  const isSmallScreen = breakpoint === 'xs' || breakpoint === 'sm'
  const height =
    heightOverride ?? (isSmallScreen ? MOBILE_HEIGHT : DESKTOP_HEIGHT)
  const viewport = useMemo(
    () => ({ width: width ?? 960, height }),
    [width, height],
  )

  // On by default: the relations are the picture, and a token can drag a whole
  // sidebar of untouched deployments along behind them.
  const [hideUnconnected, setHideUnconnected] = useState(true)
  const hasUnconnected = fullGraph.unconnectedNodeIds.length > 0
  const isEverythingUnconnected =
    fullGraph.unconnectedNodeIds.length === fullGraph.nodes.length
  const graph = useMemo(() => {
    // Nothing to hide, or hiding would leave an empty diagram.
    if (!hideUnconnected || !hasUnconnected || isEverythingUnconnected) {
      return fullGraph
    }
    const hidden = new Set(fullGraph.unconnectedNodeIds)
    return {
      ...fullGraph,
      nodes: fullGraph.nodes.filter((node) => !hidden.has(node.id)),
      unconnectedNodeIds: [],
    }
  }, [fullGraph, hideUnconnected, hasUnconnected, isEverythingUnconnected])

  const [hoveredId, setHoveredId] = useState<string | undefined>(undefined)
  const [dragged, setDragged] = useState<
    ReadonlyMap<string, { x: number; y: number }>
  >(() => new Map())

  const sizeOverrides = useMemo(() => {
    const heights = new Map<string, number>()
    const widths = new Map<string, number>()
    for (const node of graph.nodes) {
      if (node.deployments.length <= 1) continue
      heights.set(node.id, getRelationsNodeHeight(node))
      widths.set(node.id, getRelationsNodeWidth(node))
    }
    return { heights, widths }
  }, [graph.nodes])

  const layout = useMemo(
    () =>
      layoutWrappedRelationsGraph(
        graph.nodes,
        graph.edges,
        graph.unconnectedNodeIds,
        sizeOverrides.heights,
        sizeOverrides.widths,
      ),
    [graph, sizeOverrides],
  )

  const boxes = useMemo(() => {
    const moved = new Map(layout.boxes)
    for (const [id, position] of dragged) {
      const box = moved.get(id)
      if (box) moved.set(id, { ...box, ...position })
    }
    return moved
  }, [layout.boxes, dragged])

  const content = useMemo(
    () => ({ width: layout.width, height: layout.height }),
    [layout.width, layout.height],
  )
  const initialFocus = useMemo(() => {
    const primarySource = graph.nodes
      .filter((node) => layout.layerOf.get(node.id) === 0)
      .toSorted(
        (a, b) =>
          (b.volume ?? -1) - (a.volume ?? -1) || a.id.localeCompare(b.id),
      )[0]
    if (!primarySource) return undefined
    const box = layout.boxes.get(primarySource.id)
    if (!box) return undefined
    return { x: box.x + box.width / 2, y: box.y }
  }, [graph.nodes, layout])
  const camera = useRelationsCamera(content, viewport, 'width', initialFocus)

  const activeId = hoveredId ?? selectedNodeId
  const neighbours = useMemo(() => {
    if (!activeId) return undefined
    const ids = new Set([activeId])
    for (const edge of graph.edges) {
      if (edge.from === activeId) ids.add(edge.to)
      if (edge.to === activeId) ids.add(edge.from)
    }
    return ids
  }, [activeId, graph.edges])

  const sourceIds = useMemo(() => {
    const incomingIds = new Set(graph.edges.map((edge) => edge.to))
    return new Set(
      graph.edges.map((edge) => edge.from).filter((id) => !incomingIds.has(id)),
    )
  }, [graph.edges])

  const targetPorts = useMemo(
    () => getWrappedTargetPorts(graph.edges, boxes),
    [boxes, graph.edges],
  )
  const sourceLanes = useMemo(
    () => getWrappedSourceLanes(graph.edges),
    [graph.edges],
  )
  const edgeGeometries = useMemo(() => {
    const result = new Map<string, ReturnType<typeof getWrappedEdgeGeometry>>()
    for (const edge of graph.edges) {
      const from = boxes.get(edge.from)
      const to = boxes.get(edge.to)
      if (!from || !to) continue
      result.set(
        wrappedEdgeKey(edge),
        getWrappedEdgeGeometry({
          from,
          to,
          sourceRow: layout.rowOf.get(edge.from) ?? 0,
          targetRow: layout.rowOf.get(edge.to) ?? 0,
          targetPort: targetPorts.get(wrappedEdgeKey(edge)) ?? 0.5,
          sourceLane: sourceLanes.get(edge.from) ?? 0,
          worldWidth: layout.width,
        }),
      )
    }
    return result
  }, [boxes, graph.edges, layout, sourceLanes, targetPorts])

  const svgRef = useRef<SVGSVGElement>(null)
  /**
   * Selection is resolved on pointer-up rather than from a click handler: while
   * the svg holds pointer capture for panning, the browser retargets `click` to
   * the svg, so a handler on a node or a connection never hears it.
   */
  const gesture = useRef<
    | ({ start: { x: number; y: number }; moved: boolean } & (
        | { type: 'pan' }
        | { type: 'node'; id: string; offset: { x: number; y: number } }
      ))
    | undefined
  >(undefined)

  const localPoint = useCallback((event: React.PointerEvent) => {
    const rect = svgRef.current?.getBoundingClientRect()
    return {
      x: event.clientX - (rect?.left ?? 0),
      y: event.clientY - (rect?.top ?? 0),
    }
  }, [])

  const onBackgroundPointerDown = useCallback(
    (event: React.PointerEvent<SVGSVGElement>) => {
      if (gesture.current) return
      gesture.current = { type: 'pan', start: localPoint(event), moved: false }
      event.currentTarget.setPointerCapture(event.pointerId)
      camera.startPan(localPoint(event))
    },
    [camera, localPoint],
  )

  const onNodePointerDown = useCallback(
    (nodeId: string) => (event: React.PointerEvent<SVGGElement>) => {
      // Claim the gesture so the background handler leaves panning alone.
      event.stopPropagation()
      const box = boxes.get(nodeId)
      if (!box) return
      const world = camera.toWorld(localPoint(event))
      gesture.current = {
        type: 'node',
        id: nodeId,
        offset: { x: world.x - box.x, y: world.y - box.y },
        start: localPoint(event),
        moved: false,
      }
      svgRef.current?.setPointerCapture(event.pointerId)
    },
    [boxes, camera, localPoint],
  )

  const onPointerMove = useCallback(
    (event: React.PointerEvent<SVGSVGElement>) => {
      const active = gesture.current
      if (!active) return
      const point = localPoint(event)
      if (
        Math.abs(point.x - active.start.x) > CLICK_SLOP ||
        Math.abs(point.y - active.start.y) > CLICK_SLOP
      ) {
        active.moved = true
      }
      if (!active.moved) return
      if (active.type === 'pan') {
        camera.pan(point)
        return
      }
      if (active.type !== 'node') return
      const world = camera.toWorld(point)
      setDragged((previous) =>
        new Map(previous).set(active.id, {
          x: world.x - active.offset.x,
          y: world.y - active.offset.y,
        }),
      )
    },
    [camera, localPoint],
  )

  const onPointerUp = useCallback(
    (event: React.PointerEvent<SVGSVGElement>) => {
      const active = gesture.current
      gesture.current = undefined
      camera.endPan()
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId)
      }
      if (!active || active.moved) return
      if (active.type === 'pan') {
        onSelectNode(undefined)
        return
      }
      onSelectNode(active.id)
    },
    [camera, onSelectNode],
  )

  // Only a pinch (which arrives as ctrl+wheel) or a held modifier zooms. A
  // bare wheel must keep scrolling the page — the diagram sits mid-article,
  // and trapping the scroll there would strand the reader.
  const onWheel = useCallback(
    (event: React.WheelEvent<SVGSVGElement>) => {
      if (!event.ctrlKey && !event.metaKey) return
      event.preventDefault()
      const rect = svgRef.current?.getBoundingClientRect()
      camera.zoomBy(event.deltaY < 0 ? 1.15 : 1 / 1.15, {
        x: event.clientX - (rect?.left ?? 0),
        y: event.clientY - (rect?.top ?? 0),
      })
    },
    [camera],
  )

  const unconnected = useMemo(
    () => new Set(graph.unconnectedNodeIds),
    [graph.unconnectedNodeIds],
  )

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-lg border border-divider bg-surface-secondary"
      style={{ height }}
    >
      <svg
        ref={svgRef}
        width="100%"
        height={height}
        className="touch-none select-none"
        onPointerDown={onBackgroundPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onWheel={onWheel}
        role="img"
        aria-label="Diagram of how this token's deployments back one another"
      >
        <defs>
          {/* markerUnits="userSpaceOnUse" keeps the head a fixed size instead
              of scaling with the stroke, so direction stays legible. */}
          <marker
            id={ARROW_MARKER_ID}
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="11"
            markerHeight="11"
            markerUnits="userSpaceOnUse"
            orient="auto-start-reverse"
          >
            <path
              d="M 0 0 L 10 5 L 0 10 z"
              className="fill-primary"
              fillOpacity={0.55}
            />
          </marker>
          <marker
            id={ARROW_MARKER_ACTIVE_ID}
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="13"
            markerHeight="13"
            markerUnits="userSpaceOnUse"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" className="fill-brand" />
          </marker>
        </defs>

        <g
          transform={`translate(${camera.camera.x}, ${camera.camera.y}) scale(${camera.camera.k})`}
        >
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
            const geometry = edgeGeometries.get(wrappedEdgeKey(edge))
            if (!geometry) return null
            const touchesActive = activeId === edge.from || activeId === edge.to
            return (
              <RelationsEdge
                key={wrappedEdgeKey(edge)}
                geometry={geometry}
                isDimmed={activeId !== undefined && !touchesActive}
                isHighlighted={touchesActive}
              />
            )
          })}

          {/* Badges are a separate foreground layer. If each edge paints its
              badge immediately after its path, a later edge can cross a badge
              that was already drawn. */}
          {graph.edges.map((edge) => {
            const geometry = edgeGeometries.get(wrappedEdgeKey(edge))
            if (!geometry) return null
            const touchesActive = activeId === edge.from || activeId === edge.to
            return (
              <RelationsEdgeBridges
                key={`bridges-${wrappedEdgeKey(edge)}`}
                edge={edge}
                geometry={geometry}
                isDimmed={activeId !== undefined && !touchesActive}
              />
            )
          })}

          {graph.nodes.map((node) => {
            const box = boxes.get(node.id)
            if (!box) return null
            return (
              <RelationsNode
                key={node.id}
                node={node}
                box={box}
                isSource={sourceIds.has(node.id)}
                isSelected={selectedNodeId === node.id}
                isDimmed={neighbours !== undefined && !neighbours.has(node.id)}
                isUnconnected={unconnected.has(node.id)}
                onPointerDown={onNodePointerDown(node.id)}
                onHoverChange={(hovered) =>
                  setHoveredId(hovered ? node.id : undefined)
                }
              />
            )
          })}
        </g>
      </svg>

      {hasUnconnected && !isEverythingUnconnected && (
        <label
          className={cn(
            'absolute top-3 left-3 flex cursor-pointer items-center gap-2 rounded-md',
            'border border-divider bg-surface-primary px-2 py-1',
            'font-medium text-label-value-12 text-secondary hover:text-primary',
          )}
        >
          <input
            type="checkbox"
            className="cursor-pointer accent-brand"
            checked={hideUnconnected}
            onChange={(event) => {
              setHideUnconnected(event.target.checked)
              // The panel must not outlive the node it describes.
              if (
                event.target.checked &&
                selectedNodeId !== undefined &&
                fullGraph.unconnectedNodeIds.includes(selectedNodeId)
              ) {
                onSelectNode(undefined)
              }
            }}
          />
          Hide deployments with no relations
        </label>
      )}

      {selectedNodeId && (
        <div className="absolute top-3 right-3 bottom-3 w-[min(88%,320px)]">
          <RelationsDetails
            graph={graph}
            nodeId={selectedNodeId}
            onClose={() => onSelectNode(undefined)}
          />
        </div>
      )}

      <div
        className={cn(
          'absolute bottom-3 flex flex-col gap-1',
          // Steps aside so the panel does not sit on top of the controls.
          selectedNodeId ? 'right-[min(88%,320px)] mr-5' : 'right-3',
        )}
      >
        <ZoomButton label="Zoom in" onClick={() => camera.zoomBy(1.25)}>
          +
        </ZoomButton>
        <ZoomButton label="Zoom out" onClick={() => camera.zoomBy(1 / 1.25)}>
          −
        </ZoomButton>
        <ZoomButton
          label="Reset view"
          onClick={() => {
            camera.reset()
            setDragged(new Map())
          }}
        >
          ⟲
        </ZoomButton>
        {onExpand && (
          <ZoomButton label="Open larger view" onClick={onExpand}>
            ⤢
          </ZoomButton>
        )}
      </div>
    </div>
  )
}

function ZoomButton({
  label,
  onClick,
  children,
}: {
  label: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={cn(
        'flex size-7 items-center justify-center rounded-md border border-divider',
        'bg-surface-primary font-bold text-label-value-14 text-secondary',
        'hover:bg-surface-tertiary hover:text-primary',
      )}
    >
      {children}
    </button>
  )
}

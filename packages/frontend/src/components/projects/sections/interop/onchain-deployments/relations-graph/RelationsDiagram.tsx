import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  centerCamera,
  fitWidthCamera,
  revealCamera,
  type Size,
} from '~/components/pan-zoom/camera'
import { CameraWorld, PanZoomFrame } from '~/components/pan-zoom/PanZoomFrame'
import { usePanZoom } from '~/components/pan-zoom/usePanZoom'
import {
  ControlButton,
  EXPAND_GLYPH,
  Glyph,
  ZoomControls,
} from '~/components/pan-zoom/ZoomControls'
import type { InteropTokenRelationsGraph } from '~/server/features/layer2s/interop/token/getInteropTokenRelationsGraph'
import { DOT_SEPARATOR } from '~/utils/dotSeparator'
import { DiagramWatermark } from './DiagramWatermark'
import { edgeKey, getActiveBacking } from './graphSelectors'
import { layoutRelationsGraph } from './layoutRelationsGraph'
import { getRelationsNodeSize } from './nodeSize'
import {
  RelationsEdgeBadge,
  RelationsEdgeMarkers,
  RelationsEdgePath,
} from './RelationsEdges'
import { RelationsNode } from './RelationsNode'
import { routeRelationsEdges } from './routeRelationsEdges'

/** Space kept between a revealed node and the edge it was moved clear of. */
const REVEAL_MARGIN = 24
const INITIAL_VIEWPORT = { width: 960, height: 520 }

interface Props {
  graph: InteropTokenRelationsGraph
  unconnectedIds: ReadonlySet<string>
  selectedNodeId: string | undefined
  onSelectNode: (id: string | undefined) => void
  onExpand?: () => void
  /**
   * Fills a view with no page left to scroll, so a bare wheel and one finger
   * pan it. Otherwise they scroll the page, and touch pans with two fingers.
   */
  fillsView?: boolean
  /** Centres the selected node, e.g. once a details panel has shrunk the diagram. */
  centersSelection?: boolean
  /** Pixels of the right edge that a details panel covers; the selected node is kept clear of them. */
  coveredRight?: number
  /** Drawn over the frame, outside its pan and click handling (e.g. a details panel). */
  overlay?: ReactNode
  className?: string
}

export function RelationsDiagram({
  graph,
  unconnectedIds,
  selectedNodeId,
  onSelectNode,
  onExpand,
  fillsView = false,
  centersSelection = false,
  coveredRight = 0,
  overlay,
  className,
}: Props) {
  const layout = useMemo(() => {
    const items = graph.nodes.map((node) => ({
      id: node.id,
      volume: node.volume,
      ...getRelationsNodeSize(node.deployments.length),
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
  const fitTo = useCallback(
    (viewport: Size) => fitWidthCamera(layout, viewport, focusX),
    [layout, focusX],
  )
  const panZoom = usePanZoom({
    content: layout,
    fitTo,
    fillsView,
    initialViewport: INITIAL_VIEWPORT,
  })
  const { camera } = panZoom
  const { width: viewportWidth, height: viewportHeight } = panZoom.viewport
  // Brings a newly selected node into view. Re-runs once the viewport
  // settles, so it lands right in the diagram's final size.
  useEffect(() => {
    const box = selectedNodeId && layout.boxes.get(selectedNodeId)
    if (!box) return
    if (centersSelection) {
      const middle = { x: box.x + box.width / 2, y: box.y + box.height / 2 }
      camera.glideTo(
        centerCamera(camera.get(), middle, {
          width: viewportWidth,
          height: viewportHeight,
        }),
      )
    } else if (coveredRight > 0) {
      const uncovered = {
        x: 0,
        y: 0,
        width: viewportWidth - coveredRight,
        height: viewportHeight,
      }
      camera.glideTo(revealCamera(camera.get(), box, uncovered, REVEAL_MARGIN))
    }
  }, [
    centersSelection,
    coveredRight,
    selectedNodeId,
    layout,
    camera,
    viewportWidth,
    viewportHeight,
  ])

  const [hoveredId, setHoveredId] = useState<string>()
  const activeId = hoveredId ?? selectedNodeId
  const active = useMemo(
    () => (activeId ? getActiveBacking(graph.edges, activeId) : undefined),
    [graph.edges, activeId],
  )
  const sourceIds = useMemo(() => {
    const backed = new Set(graph.edges.map((edge) => edge.backed))
    return new Set(
      graph.edges.map((edge) => edge.backer).filter((id) => !backed.has(id)),
    )
  }, [graph.edges])

  return (
    // Fills a flex-column parent; a no-op in block flow.
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="relative flex min-h-0 flex-1 flex-col">
        <PanZoomFrame
          panZoom={panZoom}
          className={className}
          onClick={() => {
            if (!panZoom.consumeSuppressedClick()) onSelectNode(undefined)
          }}
        >
          {/* The camera moves the grid and the world by writing their transforms,
              so React never re-renders the diagram for a pan or a pinch. */}
          <div
            ref={panZoom.gridRef}
            className="pointer-events-none absolute will-change-transform"
            style={{
              backgroundImage:
                'radial-gradient(var(--color-divider) 1px, transparent 1px)',
              ...panZoom.initialStyles.grid,
            }}
            aria-hidden
          />
          <DiagramWatermark />
          <CameraWorld panZoom={panZoom}>
            <svg
              width={layout.width}
              height={layout.height}
              className="absolute top-0 left-0 overflow-visible"
              aria-hidden
            >
              <RelationsEdgeMarkers />
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
                const isHighlighted =
                  active?.edgeKeys.has(edgeKey(edge)) ?? false
                return (
                  <RelationsEdgePath
                    key={edgeKey(edge)}
                    path={path}
                    isHighlighted={isHighlighted}
                    isDimmed={active !== undefined && !isHighlighted}
                  />
                )
              })}
            </svg>
            {graph.nodes.map((node) => {
              const box = layout.boxes.get(node.id)
              if (!box) return null
              return (
                <RelationsNode
                  key={node.id}
                  node={node}
                  box={box}
                  isSelected={selectedNodeId === node.id}
                  isDimmed={
                    active !== undefined && !active.nodeIds.has(node.id)
                  }
                  isUnconnected={unconnectedIds.has(node.id)}
                  isSource={sourceIds.has(node.id)}
                  // A touch drag that starts on a node may still end in a click on it.
                  onSelect={(id) => {
                    if (!panZoom.consumeSuppressedClick()) onSelectNode(id)
                  }}
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
                  position={path}
                  isDimmed={
                    active !== undefined && !active.edgeKeys.has(edgeKey(edge))
                  }
                />
              )
            })}
          </CameraWorld>
        </PanZoomFrame>
        {overlay}
      </div>
      {/* Under the frame, not over it, so neither covers a node. */}
      <div className="mt-2 flex items-center justify-between gap-3">
        <DiagramCaption fillsView={fillsView} />
        <ZoomControls camera={camera} className="static shrink-0 flex-row">
          {onExpand && (
            <ControlButton label="Open larger view" onClick={onExpand}>
              <Glyph d={EXPAND_GLYPH} />
            </ControlButton>
          )}
        </ZoomControls>
      </div>
    </div>
  )
}

/** What the diagram measures and how to move it. */
function DiagramCaption({ fillsView }: { fillsView: boolean }) {
  return (
    <p className="text-label-value-12 text-secondary leading-4">
      Past 24h cross-chain volume
      {DOT_SEPARATOR}
      <span className="[@media(pointer:coarse)]:hidden">
        {fillsView
          ? 'Scroll or drag to move the diagram'
          : 'Drag to move, Ctrl + scroll to zoom'}
      </span>
      <span className="hidden [@media(pointer:coarse)]:inline">
        {fillsView
          ? 'Drag to move, pinch to zoom'
          : 'Use two fingers to move or zoom'}
      </span>
    </p>
  )
}

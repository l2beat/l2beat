import * as d3 from 'd3'
import { useEffect, useMemo, useRef, useState } from 'react'
import { cn } from '~/utils/cn'
import {
  drawRelationGraph,
  NODE_RING_RADIUS,
  nodeVisualScreenScale,
  type RelationGraphTheme,
} from './relationGraphCanvas'
import {
  findDraggableNodeAt,
  nodeDraggingIsEnabled,
} from './relationGraphInteraction'
import {
  getRelationGraphFocus,
  type RelationGraph,
  type RelationGraphSelection,
  relationDirectionLabel,
  relationIsDirectional,
  relationTypeLabel,
} from './relationGraphModel'
import {
  buildRelationGraphScene,
  findLinkAt,
  findNodeAt,
  type SceneLink,
  type SceneNode,
} from './relationGraphScene'

/**
 * Renders the relations graph onto a canvas (see relationGraphCanvas.ts for
 * why not SVG) and owns all interaction: the d3-zoom camera, node dragging,
 * hover, clicks, and the tooltip. Rendering state lives in refs and every
 * change just schedules a redraw — React re-renders only for the tooltip.
 */

const SEARCH_ZOOM_SCALE = 2
const SEARCH_ZOOM_DURATION_MS = 300
const DETAILS_PANEL_MAX_WIDTH = 440
const DETAILS_PANEL_WIDTH_RATIO = 0.92
const MAX_ZOOM_SCALE = 8
const FIT_VIEW_PADDING = 32
/** Pointer slack: how far from a link a click still selects it, screen px. */
const LINK_HIT_TOLERANCE = 7
/** Tiny nodes stay clickable when zoomed far out. */
const MIN_NODE_HIT_RADIUS = 8

interface NodeDrag {
  node: SceneNode
  /** World-space offset from the pointer to the node center at grab time. */
  offsetX: number
  offsetY: number
  moved: boolean
}

export function TokenRelationsGraph({
  graph,
  selection,
  zoomTarget,
  highlightAnomalies,
  deletedRelationIds,
  onSelectionChange,
  onLayoutComplete,
}: {
  graph: RelationGraph
  selection: RelationGraphSelection | undefined
  zoomTarget: { nodeId: string } | undefined
  highlightAnomalies: boolean
  deletedRelationIds: ReadonlySet<string>
  onSelectionChange: (selection: RelationGraphSelection | undefined) => void
  /** Called after the blocking scene build whenever `graph` changes. */
  onLayoutComplete?: () => void
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const requestDrawRef = useRef<(() => void) | undefined>(undefined)
  const zoomToNodeRef = useRef<((nodeId: string) => void) | undefined>(
    undefined,
  )
  const onSelectionChangeRef = useRef(onSelectionChange)
  const [tooltip, setTooltip] = useState<string>()

  const focus = useMemo(
    () => getRelationGraphFocus(graph, selection, deletedRelationIds),
    [graph, selection, deletedRelationIds],
  )
  // The draw loop reads the latest style inputs through a ref so that the
  // canvas lifecycle effect does not have to re-run on every style change.
  const styleStateRef = useRef({
    deletedRelationIds,
    focus,
    highlightAnomalies,
    selection,
  })

  const onLayoutCompleteRef = useRef(onLayoutComplete)

  useEffect(() => {
    onSelectionChangeRef.current = onSelectionChange
  }, [onSelectionChange])

  useEffect(() => {
    onLayoutCompleteRef.current = onLayoutComplete
  }, [onLayoutComplete])

  useEffect(() => {
    styleStateRef.current = {
      deletedRelationIds,
      focus,
      highlightAnomalies,
      selection,
    }
    requestDrawRef.current?.()
  }, [deletedRelationIds, focus, highlightAnomalies, selection])

  useEffect(() => {
    // Rebound consts so the narrowed types carry into the closures below.
    const canvasElement = canvasRef.current
    const contextOrNull = canvasElement?.getContext('2d')
    if (!canvasElement) return
    if (!contextOrNull) throw new Error('Canvas 2d rendering is unavailable')
    const canvas = canvasElement
    const context = contextOrNull

    const scene = buildRelationGraphScene(graph)
    const theme = resolveTheme(canvas)
    let cameraTransform = d3.zoomIdentity
    let cameraInitialized = false
    let hovered: RelationGraphSelection | undefined
    let drag: NodeDrag | undefined
    let suppressNextClick = false
    let width = 0
    let height = 0
    let pixelRatio = 1
    let frame: number | undefined
    canvas.style.cursor = 'grab'

    function draw() {
      if (width === 0 || height === 0) return
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
      drawRelationGraph(context, scene, {
        width,
        height,
        camera: cameraTransform,
        hovered,
        theme,
        ...styleStateRef.current,
      })
    }

    function requestDraw() {
      if (frame !== undefined) return
      frame = requestAnimationFrame(() => {
        frame = undefined
        draw()
      })
    }
    requestDrawRef.current = requestDraw

    function eventPoint(event: Event): [number, number] {
      // d3.pointer reads clientX/clientY, which a TouchEvent itself lacks —
      // it expects the individual Touch, as d3-zoom passes internally.
      const source =
        'changedTouches' in event
          ? (event as TouchEvent).changedTouches[0]
          : event
      return d3.pointer(source, canvas)
    }

    function toWorld(pointer: [number, number]): [number, number] {
      return cameraTransform.invert(pointer)
    }

    function pickNode(pointer: [number, number]) {
      const [x, y] = toWorld(pointer)
      const scale = cameraTransform.k
      const radius = Math.max(
        NODE_RING_RADIUS * nodeVisualScreenScale(scale),
        MIN_NODE_HIT_RADIUS,
      )
      return findNodeAt(scene, x, y, radius / scale)
    }

    function pickDraggableNode(pointer: [number, number]) {
      const [x, y] = toWorld(pointer)
      const scale = cameraTransform.k
      const radius = Math.max(
        NODE_RING_RADIUS * nodeVisualScreenScale(scale),
        MIN_NODE_HIT_RADIUS,
      )
      return findDraggableNodeAt(scene, x, y, radius / scale, scale)
    }

    function pickLink(pointer: [number, number]) {
      const [x, y] = toWorld(pointer)
      const scale = cameraTransform.k
      return findLinkAt(
        scene,
        x,
        y,
        LINK_HIT_TOLERANCE / scale,
        styleStateRef.current.deletedRelationIds,
      )
    }

    function updateCursor() {
      canvas.style.cursor = drag ? 'grabbing' : hovered ? 'pointer' : 'grab'
    }

    function positionTooltip(pointer: [number, number]) {
      const element = tooltipRef.current
      if (!element) return
      const flipX = pointer[0] > width * 0.6
      const flipY = pointer[1] > height * 0.7
      const x = pointer[0] + (flipX ? -14 : 14)
      const y = pointer[1] + (flipY ? -14 : 14)
      element.style.transform =
        `translate(${x}px, ${y}px)` +
        ` translate(${flipX ? '-100%' : '0px'}, ${flipY ? '-100%' : '0px'})`
    }

    function setHovered(next: RelationGraphSelection | undefined) {
      if (hovered?.type === next?.type && hovered?.id === next?.id) return
      hovered = next
      updateCursor()
      requestDraw()
    }

    function refreshHover(pointer: [number, number]) {
      positionTooltip(pointer)
      if (drag) return
      const node = pickNode(pointer)
      const link = node === undefined ? pickLink(pointer) : undefined
      setHovered(
        node
          ? { type: 'node', id: node.data.id }
          : link
            ? { type: 'relation', id: link.id }
            : undefined,
      )
      setTooltip(
        node ? nodeTooltip(node) : link ? linkTooltip(link) : undefined,
      )
    }

    function clearHover() {
      setHovered(undefined)
      setTooltip(undefined)
    }

    const zoom = d3
      .zoom<HTMLCanvasElement, unknown>()
      .scaleExtent([0.1, MAX_ZOOM_SCALE])
      // Reject pan gestures that grab a node — those are node drags. Wheel
      // and double-click zooming stay untouched.
      .filter((event: MouseEvent | TouchEvent) => {
        const allowed =
          (!event.ctrlKey || event.type === 'wheel') &&
          !('button' in event && event.button)
        if (event.type !== 'mousedown' && event.type !== 'touchstart') {
          return allowed
        }
        // No pan while a node drag is active (a later touch joining it) or
        // when the gesture itself grabs a node (the primary pointer).
        return (
          allowed && !drag && pickDraggableNode(eventPoint(event)) === undefined
        )
      })
      .on('start', (event: d3.D3ZoomEvent<HTMLCanvasElement, unknown>) => {
        if (
          event.sourceEvent &&
          (!hovered || !nodeDraggingIsEnabled(cameraTransform.k))
        ) {
          canvas.style.cursor = 'grabbing'
        }
      })
      .on('zoom', (event: d3.D3ZoomEvent<HTMLCanvasElement, unknown>) => {
        cameraTransform = event.transform
        // The world moves under a stationary pointer, so what is hovered can
        // change without a pointer event.
        if (event.sourceEvent instanceof Event) {
          refreshHover(eventPoint(event.sourceEvent))
        }
        requestDraw()
      })
      .on('end', () => updateCursor())

    const canvasSelection = d3.select(canvas)
    canvasSelection
      .call(zoom)
      .on('pointerdown.graph', (event: PointerEvent) => {
        suppressNextClick = false
        if (!event.isPrimary || event.button !== 0) return
        const node = pickDraggableNode(eventPoint(event))
        if (node === undefined) return
        const [x, y] = toWorld(eventPoint(event))
        drag = { node, offsetX: node.x - x, offsetY: node.y - y, moved: false }
        canvas.setPointerCapture(event.pointerId)
        // Also stops the compatibility mousedown, so d3-zoom cannot start a
        // competing pan on mouse devices; the zoom filter covers touch.
        event.preventDefault()
        updateCursor()
      })
      .on('pointermove.graph', (event: PointerEvent) => {
        const pointer = eventPoint(event)
        if (drag) {
          drag.moved = true
          const [x, y] = toWorld(pointer)
          drag.node.x = x + drag.offsetX
          drag.node.y = y + drag.offsetY
          positionTooltip(pointer)
          requestDraw()
          return
        }
        refreshHover(pointer)
      })
      .on('pointerup.graph pointercancel.graph', (event: PointerEvent) => {
        if (!drag) return
        // A canceled gesture emits no click, so it must not arm suppression.
        suppressNextClick = drag.moved && event.type === 'pointerup'
        drag = undefined
        updateCursor()
        refreshHover(eventPoint(event))
      })
      .on('pointerleave.graph', () => {
        if (!drag) clearHover()
      })
      .on('click.graph', (event: MouseEvent) => {
        if (suppressNextClick) {
          suppressNextClick = false
          return
        }
        const pointer = eventPoint(event)
        const node = pickNode(pointer)
        if (node !== undefined) {
          onSelectionChangeRef.current({ type: 'node', id: node.data.id })
          return
        }
        const link = pickLink(pointer)
        onSelectionChangeRef.current(
          link ? { type: 'relation', id: link.id } : undefined,
        )
      })

    function resize(nextWidth: number, nextHeight: number) {
      width = nextWidth
      height = nextHeight
      pixelRatio = window.devicePixelRatio || 1
      canvas.width = Math.max(1, Math.round(width * pixelRatio))
      canvas.height = Math.max(1, Math.round(height * pixelRatio))
      if (width === 0 || height === 0) return
      if (cameraInitialized) {
        // Synchronous, not scheduled: ResizeObserver runs before paint, so
        // drawing now avoids a blank frame while the container is resized.
        draw()
      } else {
        cameraInitialized = true
        initializeCamera()
      }
    }

    // Runs once, at the first real size: fits the whole graph into view and
    // enables programmatic zooming. Later resizes keep the camera in place.
    function initializeCamera() {
      const fitScale = Math.max(
        Math.min(
          (width - FIT_VIEW_PADDING) / scene.width,
          (height - FIT_VIEW_PADDING) / scene.height,
          1,
        ),
        0.05,
      )
      zoom.scaleExtent([Math.min(fitScale / 2, 0.1), MAX_ZOOM_SCALE])
      canvasSelection.call(
        zoom.transform,
        d3.zoomIdentity
          .translate(
            (width - scene.width * fitScale) / 2,
            (height - scene.height * fitScale) / 2,
          )
          .scale(fitScale),
      )

      zoomToNodeRef.current = (nodeId) => {
        const node = scene.nodeById.get(nodeId)
        if (node === undefined) {
          throw new Error(`Cannot zoom to missing graph node ${nodeId}`)
        }
        // Center within the part of the viewport the details panel leaves
        // visible — selecting a search result always opens the panel.
        const detailsPanelWidth = Math.min(
          width * DETAILS_PANEL_WIDTH_RATIO,
          DETAILS_PANEL_MAX_WIDTH,
        )
        clearHover()
        canvasSelection
          .transition()
          .duration(SEARCH_ZOOM_DURATION_MS)
          .call(
            zoom.transform,
            d3.zoomIdentity
              .translate(
                (width - detailsPanelWidth) / 2 - node.x * SEARCH_ZOOM_SCALE,
                height / 2 - node.y * SEARCH_ZOOM_SCALE,
              )
              .scale(SEARCH_ZOOM_SCALE),
          )
      }
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (!entry) return
      resize(entry.contentRect.width, entry.contentRect.height)
    })
    observer.observe(canvas)

    // The scene build above is the multi-second blocking part; from here on
    // the graph only waits for cheap resize/draw callbacks.
    onLayoutCompleteRef.current?.()

    return () => {
      if (frame !== undefined) cancelAnimationFrame(frame)
      observer.disconnect()
      canvasSelection.interrupt()
      canvasSelection.on('.zoom', null).on('.graph', null)
      requestDrawRef.current = undefined
      zoomToNodeRef.current = undefined
      setTooltip(undefined)
    }
  }, [graph])

  useEffect(() => {
    if (zoomTarget === undefined) return
    const zoomToNode = zoomToNodeRef.current
    if (zoomToNode === undefined) {
      throw new Error('Relation graph zoom is not initialized')
    }
    zoomToNode(zoomTarget.nodeId)
  }, [zoomTarget])

  return (
    <div className="relative h-full w-full overflow-hidden">
      <canvas
        ref={canvasRef}
        className="block h-full w-full touch-none bg-background text-foreground"
      />
      <div
        ref={tooltipRef}
        className={cn(
          'pointer-events-none absolute top-0 left-0 z-10 w-max',
          'whitespace-pre-line rounded-md border bg-background px-2.5 py-1.5 text-xs shadow-md',
          tooltip === undefined && 'hidden',
        )}
      >
        {tooltip}
      </div>
    </div>
  )
}

/**
 * The canvas cannot use CSS variables, so the theme is read off the canvas
 * element (which carries the background/foreground classes) once per mount.
 */
function resolveTheme(canvas: HTMLCanvasElement): RelationGraphTheme {
  const style = getComputedStyle(canvas)
  return {
    background: style.backgroundColor,
    foreground: style.color,
    fontFamily: style.fontFamily,
  }
}

function nodeTooltip(node: SceneNode) {
  const { data } = node
  return [
    `${node.label} on ${data.chain}`,
    data.address,
    !data.isDeployed
      ? 'Missing deployed token'
      : data.hasRelations
        ? 'Deployed token exists'
        : 'No observed relations — placed by its abstract token assignment',
  ].join('\n')
}

function linkTooltip(link: SceneLink) {
  const arrow = relationIsDirectional(link.relation) ? '→' : '↔'
  return [
    `${endpointName(link.source)} ${arrow} ${endpointName(link.target)}`,
    `${relationTypeLabel(link.relation)} via ${link.relation.plugin}`,
    relationDirectionLabel(link.relation),
  ].join('\n')
}

function endpointName(node: SceneNode) {
  return `${node.label} (${node.data.chain})`
}

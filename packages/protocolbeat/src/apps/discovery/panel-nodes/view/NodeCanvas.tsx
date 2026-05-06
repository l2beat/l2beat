import { type RefObject, useEffect, useRef } from 'react'
import colors from '../../../../oklchColors.json'
import type { Node, State } from '../store/State'
import { useStore } from '../store/store'
import {
  FIELD_HEIGHT,
  HEADER_HEIGHT,
  HIDDEN_FIELDS_FOOTER_HEIGHT,
} from '../store/utils/constants'
import { getColor } from './colors/colors'
import { oklchColorToCSS } from './colors/oklch'
import {
  getNodeRadius,
  getNodeTitlePaint,
  isFullHeightNode,
} from './nodeStyles'

const COFFEE_400 = oklchColorToCSS(colors.coffee['400'])
const COFFEE_200 = oklchColorToCSS(colors.coffee['200'])
const AUTUMN_300 = oklchColorToCSS(colors.autumn['300'])
const CONNECTION_DEFAULT = COFFEE_400
const CONNECTION_DIMMED = withAlpha(COFFEE_400, 0.3)
const CONNECTION_HIGHLIGHT = AUTUMN_300
const SELECTED_OUTLINE = AUTUMN_300
const FIELD_HIGHLIGHT_BG = AUTUMN_300
const FIELD_DOT_DEFAULT = COFFEE_400
const NODE_BG = oklchColorToCSS(colors.black)
const TEXT_DARK = COFFEE_200
const TEXT_LIGHT = oklchColorToCSS(colors.black)

// Use the same palette the IconInitial component renders so canvas dots match
// the DOM ones exactly.
const DOT_INITIAL = oklchColorToCSS(colors.aux.green)
const DOT_TEMPLATE = oklchColorToCSS(colors.aux.orange)
const DOT_RADIUS = 4
const DOT_SLOT_WIDTH = 16 // matches the 16x16 IconInitial SVG box

// Below these thresholds the renderer drops detail. Mirrors what DOM-based
// virtualization can't do at all: nodes that the user can't read just become
// rectangles, then dots.
const LOD_FIELDS_AT_SCALE = 0.5
const LOD_NAME_AT_SCALE = 0.2
const LOD_DOTS_AT_SCALE = 0.08

interface Props {
  containerRef: RefObject<HTMLDivElement | null>
}

export function NodeCanvas({ containerRef }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let dirty = true
    let dpr = window.devicePixelRatio || 1
    let cssWidth = 0
    let cssHeight = 0

    const resize = () => {
      const rect = container.getBoundingClientRect()
      dpr = window.devicePixelRatio || 1
      cssWidth = rect.width
      cssHeight = rect.height
      canvas.width = Math.round(cssWidth * dpr)
      canvas.height = Math.round(cssHeight * dpr)
      canvas.style.width = `${cssWidth}px`
      canvas.style.height = `${cssHeight}px`
      dirty = true
    }
    resize()

    const ro = new ResizeObserver(resize)
    ro.observe(container)

    const unsub = useStore.subscribe(() => {
      dirty = true
    })

    const tick = () => {
      if (dirty) {
        render(ctx, useStore.getState(), cssWidth, cssHeight, dpr)
        dirty = false
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      unsub()
    }
  }, [containerRef])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      // Canvas itself is purely visual; pointer handling lives on the
      // container so the existing event plumbing keeps working unchanged.
    />
  )
}

function render(
  ctx: CanvasRenderingContext2D,
  state: State,
  cssWidth: number,
  cssHeight: number,
  dpr: number,
) {
  // Reset to identity so we can clear in pixel space, then apply world->screen.
  // Clear (not fill) so the underlying ScalableView grid + container bg show
  // through and we keep the same infinite-grid look as the DOM renderer.
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.clearRect(0, 0, cssWidth * dpr, cssHeight * dpr)

  const { offsetX, offsetY, scale } = state.transform
  // World coordinates map through `scale * dpr` and the CSS-pixel offset.
  ctx.setTransform(scale * dpr, 0, 0, scale * dpr, offsetX * dpr, offsetY * dpr)

  // Viewport AABB in world coordinates (for culling).
  const viewLeft = -offsetX / scale
  const viewTop = -offsetY / scale
  const viewRight = viewLeft + cssWidth / scale
  const viewBottom = viewTop + cssHeight / scale

  const hiddenSet = new Set(state.hidden)
  const selectedSet = new Set(state.selected)
  const visibleById = new Map<string, Node>()
  for (const node of state.nodes) {
    if (hiddenSet.has(node.id)) continue
    visibleById.set(node.id, node)
  }

  // --- Connections (drawn under nodes) -------------------------------------
  drawConnections(
    ctx,
    visibleById,
    hiddenSet,
    selectedSet,
    viewLeft,
    viewTop,
    viewRight,
    viewBottom,
  )

  const t = true

  // --- Nodes ---------------------------------------------------------------
  if (scale < LOD_DOTS_AT_SCALE && !t) {
    drawNodeDots(ctx, visibleById, viewLeft, viewTop, viewRight, viewBottom)
    return
  }

  for (const node of visibleById.values()) {
    if (!aabbIntersects(node.box, viewLeft, viewTop, viewRight, viewBottom)) {
      continue
    }
    drawNode(ctx, node, selectedSet, hiddenSet, scale)
  }
}

function drawConnections(
  ctx: CanvasRenderingContext2D,
  visibleById: Map<string, Node>,
  hiddenSet: Set<string>,
  selectedSet: Set<string>,
  viewLeft: number,
  viewTop: number,
  viewRight: number,
  viewBottom: number,
) {
  // Stroke widths are in world units; the ctx transform multiplies them by
  // scale, matching SVG's default stroke-width behavior — strokes get thinner
  // as the user zooms out, which is what the previous DOM renderer did.
  const baseWidth = 2
  const highlightedWidth = 3
  const dashLen = 5
  const hasSelection = selectedSet.size > 0

  ctx.lineCap = 'round'

  // Group strokes by style so we minimize state changes.
  // Cheap to do in JS; expensive to skip.
  type Edge = {
    fromX: number
    fromY: number
    toX: number
    toY: number
    cax: number
    cbx: number
    isHighlighted: boolean
    isDashed: boolean
    isDimmed: boolean
  }
  const edges: Edge[] = []

  for (const node of visibleById.values()) {
    const nodeSelected = selectedSet.has(node.id)
    const hiddenFields =
      node.hiddenFields.length > 0 ? new Set(node.hiddenFields) : undefined
    for (const field of node.fields) {
      if (hiddenFields?.has(field.name)) continue
      if (hiddenSet.has(field.target)) continue
      const targetNode = visibleById.get(field.target)
      if (!targetNode) continue

      const from = field.connection.from
      const to = field.connection.to

      // Bezier control points are at +/- 50 in world space.
      const cax = from.x + (from.direction === 'left' ? -50 : 50)
      const cbx = to.x + (to.direction === 'left' ? -50 : 50)

      // Cull edges that are clearly outside the viewport. Cheap AABB on the
      // bezier hull (endpoints + control points).
      const minX = Math.min(from.x, to.x, cax, cbx)
      const maxX = Math.max(from.x, to.x, cax, cbx)
      const minY = Math.min(from.y, to.y)
      const maxY = Math.max(from.y, to.y)
      if (maxX < viewLeft || minX > viewRight) continue
      if (maxY < viewTop || minY > viewBottom) continue

      const isHighlighted = nodeSelected || selectedSet.has(field.target)
      const isDashed =
        targetNode.addressType === 'EOA' ||
        targetNode.addressType === 'EOAPermissioned'
      const isDimmed = hasSelection && !isHighlighted

      edges.push({
        fromX: from.x,
        fromY: from.y,
        toX: to.x,
        toY: to.y,
        cax,
        cbx,
        isHighlighted,
        isDashed,
        isDimmed,
      })
    }
  }

  // Order: dimmed first, default next, highlighted last so it ends up on top.
  edges.sort((a, b) => {
    if (a.isHighlighted !== b.isHighlighted) return a.isHighlighted ? 1 : -1
    if (a.isDimmed !== b.isDimmed) return a.isDimmed ? -1 : 1
    return 0
  })

  let lastStroke = ''
  let lastWidth = 0
  let lastDashed: boolean | undefined

  for (const e of edges) {
    const stroke = e.isHighlighted
      ? CONNECTION_HIGHLIGHT
      : e.isDimmed
        ? CONNECTION_DIMMED
        : CONNECTION_DEFAULT
    const width = e.isHighlighted ? highlightedWidth : baseWidth

    if (stroke !== lastStroke) {
      ctx.strokeStyle = stroke
      lastStroke = stroke
    }
    if (width !== lastWidth) {
      ctx.lineWidth = width
      lastWidth = width
    }
    if (e.isDashed !== lastDashed) {
      ctx.setLineDash(e.isDashed ? [dashLen, dashLen] : [])
      lastDashed = e.isDashed
    }

    ctx.beginPath()
    ctx.moveTo(e.fromX, e.fromY)
    ctx.bezierCurveTo(e.cax, e.fromY, e.cbx, e.toY, e.toX, e.toY)
    ctx.stroke()
  }

  ctx.setLineDash([])
}

function drawNode(
  ctx: CanvasRenderingContext2D,
  node: Node,
  selectedSet: Set<string>,
  hiddenSet: Set<string>,
  scale: number,
) {
  const { x, y, width } = node.box
  const isSelected = selectedSet.has(node.id)

  const hiddenFields =
    node.hiddenFields.length > 0 ? new Set(node.hiddenFields) : undefined
  const visibleFieldCount = node.fields.length - node.hiddenFields.length
  const fullHeight = isFullHeightNode(node)
  const headerH = fullHeight ? HEADER_HEIGHT : HEADER_HEIGHT - 4

  const totalHeight = node.box.height
  const nodeRadius = getNodeRadius(node)
  const titlePaint = getNodeTitlePaint(node)

  // Body
  ctx.fillStyle = NODE_BG
  roundedRect(ctx, x, y, width, totalHeight, nodeRadius)
  ctx.fill()

  // Header
  ctx.fillStyle = getHeaderFillStyle(ctx, x, y, width, headerH, titlePaint)
  roundedRectCorners(
    ctx,
    x,
    y,
    width,
    headerH,
    fullHeight
      ? {
          topLeft: nodeRadius,
          topRight: nodeRadius,
          bottomRight: nodeRadius,
          bottomLeft: nodeRadius,
        }
      : {
          topLeft: nodeRadius,
          topRight: nodeRadius,
          bottomRight: 0,
          bottomLeft: 0,
        },
  )
  ctx.fill()

  // Selection outline (drawn on the outside, in world space).
  if (isSelected) {
    const o = 2
    ctx.lineWidth = 4
    ctx.lineJoin = 'round'
    ctx.strokeStyle = SELECTED_OUTLINE
    roundedRect(
      ctx,
      x - o,
      y - o,
      width + o * 2,
      totalHeight + o * 2,
      nodeRadius + o,
    )
    ctx.stroke()
  }

  const t = false

  if (scale < LOD_NAME_AT_SCALE && t) {
    return
  }

  // Header right-side dots: matches the IconInitial layout in the DOM
  // renderer — green for isInitial, orange for hasTemplate, both flush against
  // the right padding, side by side when both are present.
  const dots: string[] = []
  if (node.isInitial) dots.push(DOT_INITIAL)
  if (node.hasTemplate) dots.push(DOT_TEMPLATE)
  const dotsRightEdge = x + width - 8 // matches the px-2 right padding
  const dotsAreaWidth = dots.length * DOT_SLOT_WIDTH
  // Reserve dots area + a 4px gap (gap-1) from the title when any dot is shown.
  const titleReservedRight = dots.length > 0 ? dotsAreaWidth + 4 : 0

  // Title text. Truncate against header width minus padding and dot area.
  ctx.fillStyle = titlePaint.isDark ? TEXT_DARK : TEXT_LIGHT
  ctx.font = '500 14px ui-sans-serif, system-ui, sans-serif'
  ctx.textBaseline = 'middle'
  ctx.textAlign = 'left'
  const titlePadX = 8
  const titleMaxWidth = width - titlePadX * 2 - titleReservedRight
  const truncatedName = truncate(ctx, node.name, titleMaxWidth)
  ctx.fillText(truncatedName, x + titlePadX, y + headerH / 2 + 0.5)

  if (dots.length > 0) {
    const dotCenterY = y + headerH / 2
    for (let i = 0; i < dots.length; i++) {
      // Right-align: i=0 sits leftmost when there are two dots.
      const slotsFromRight = dots.length - 1 - i
      const dotCenterX =
        dotsRightEdge - slotsFromRight * DOT_SLOT_WIDTH - DOT_SLOT_WIDTH / 2
      ctx.fillStyle = dots[i] as string
      ctx.beginPath()
      ctx.arc(dotCenterX, dotCenterY, DOT_RADIUS, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  if ((scale < LOD_FIELDS_AT_SCALE || visibleFieldCount === 0) && t) {
    return
  }

  // Fields
  ctx.font = '12px ui-monospace, SFMono-Regular, Menlo, monospace'
  let visibleIndex = 0
  for (const field of node.fields) {
    if (hiddenFields?.has(field.name)) continue

    const rowY = y + HEADER_HEIGHT + visibleIndex * FIELD_HEIGHT
    const rowCenterY = rowY + FIELD_HEIGHT / 2

    const isHighlighted = selectedSet.has(field.target)
    const targetHidden = hiddenSet.has(field.target)

    if (isHighlighted) {
      ctx.fillStyle = FIELD_HIGHLIGHT_BG
      // Pill-ish — close enough at this scale.
      const pillX = x + 4
      const pillY = rowY + 1
      const pillW = width - 8
      const pillH = FIELD_HEIGHT - 2
      const r = pillH / 2
      roundedRect(ctx, pillX, pillY, pillW, pillH, r)
      ctx.fill()
      ctx.fillStyle = TEXT_LIGHT
    } else {
      ctx.fillStyle = TEXT_DARK
    }

    const truncated = truncate(ctx, field.name, width - 16)
    ctx.fillText(truncated, x + 8, rowCenterY)

    if (!targetHidden) {
      const fromDirection = field.connection.from.direction
      const dotX = fromDirection === 'left' ? x : x + width
      ctx.fillStyle =
        isHighlighted || isSelected ? SELECTED_OUTLINE : FIELD_DOT_DEFAULT
      ctx.beginPath()
      ctx.arc(dotX, rowCenterY, 5, 0, Math.PI * 2)
      ctx.fill()
    }

    visibleIndex++
  }

  // "+N hidden field(s)" footer.
  if (node.hiddenFields.length > 0) {
    ctx.fillStyle = withAlpha(COFFEE_200, 0.4)
    ctx.font = 'italic 11px ui-sans-serif, system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(
      `+${node.hiddenFields.length} hidden field${
        node.hiddenFields.length > 1 ? 's' : ''
      }`,
      x + width / 2,
      y + totalHeight - HIDDEN_FIELDS_FOOTER_HEIGHT / 2,
    )
    ctx.textAlign = 'left'
  }
}

function drawNodeDots(
  ctx: CanvasRenderingContext2D,
  visibleById: Map<string, Node>,
  viewLeft: number,
  viewTop: number,
  viewRight: number,
  viewBottom: number,
) {
  // Lowest LOD: just colored squares so the user can still see the shape of
  // the graph at extreme zoom-out.
  for (const node of visibleById.values()) {
    if (!aabbIntersects(node.box, viewLeft, viewTop, viewRight, viewBottom)) {
      continue
    }
    const { color } = getColor(node)
    ctx.fillStyle = color
    ctx.fillRect(node.box.x, node.box.y, node.box.width, node.box.height)
  }
}

function aabbIntersects(
  box: { x: number; y: number; width: number; height: number },
  left: number,
  top: number,
  right: number,
  bottom: number,
): boolean {
  if (box.x + box.width < left) return false
  if (box.x > right) return false
  if (box.y + box.height < top) return false
  if (box.y > bottom) return false
  return true
}

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  roundedRectCorners(ctx, x, y, w, h, {
    topLeft: r,
    topRight: r,
    bottomRight: r,
    bottomLeft: r,
  })
}

function roundedRectCorners(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  radii: {
    topLeft: number
    topRight: number
    bottomRight: number
    bottomLeft: number
  },
) {
  const topLeft = Math.min(radii.topLeft, w / 2, h / 2)
  const topRight = Math.min(radii.topRight, w / 2, h / 2)
  const bottomRight = Math.min(radii.bottomRight, w / 2, h / 2)
  const bottomLeft = Math.min(radii.bottomLeft, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + topLeft, y)
  ctx.lineTo(x + w - topRight, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + topRight)
  ctx.lineTo(x + w, y + h - bottomRight)
  ctx.quadraticCurveTo(x + w, y + h, x + w - bottomRight, y + h)
  ctx.lineTo(x + bottomLeft, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - bottomLeft)
  ctx.lineTo(x, y + topLeft)
  ctx.quadraticCurveTo(x, y, x + topLeft, y)
  ctx.closePath()
}

function getHeaderFillStyle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  titlePaint: ReturnType<typeof getNodeTitlePaint>,
): string | CanvasGradient {
  if (!titlePaint.contrastColor) {
    return titlePaint.baseColor
  }

  const centerX = x + width / 2
  const centerY = y + height / 2
  const maxRadius = Math.max(
    titlePaint.ringSize,
    Math.hypot(width / 2, height / 2),
  )
  const gradient = ctx.createRadialGradient(
    centerX,
    centerY,
    0,
    centerX,
    centerY,
    maxRadius,
  )
  const epsilon = Math.min(titlePaint.ringSize / maxRadius / 100, 0.0001)

  for (let radius = 0; radius < maxRadius; radius += titlePaint.ringSize) {
    const start = radius / maxRadius
    const end = Math.min((radius + titlePaint.ringSize) / maxRadius, 1)
    gradient.addColorStop(start, titlePaint.contrastColor)
    gradient.addColorStop(Math.max(start, end - epsilon), titlePaint.baseColor)
    if (end < 1) {
      gradient.addColorStop(end, titlePaint.contrastColor)
    }
  }
  gradient.addColorStop(1, titlePaint.baseColor)

  return gradient
}

function withAlpha(rgb: string, alpha: number): string {
  return rgb.replace('rgb(', 'rgba(').replace(')', `, ${alpha})`)
}

function truncate(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string {
  if (ctx.measureText(text).width <= maxWidth) return text
  const ellipsis = '…'
  const ellipsisWidth = ctx.measureText(ellipsis).width
  if (ellipsisWidth >= maxWidth) return ''
  let lo = 0
  let hi = text.length
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1
    if (ctx.measureText(text.slice(0, mid)).width + ellipsisWidth <= maxWidth) {
      lo = mid
    } else {
      hi = mid - 1
    }
  }
  return text.slice(0, lo) + ellipsis
}

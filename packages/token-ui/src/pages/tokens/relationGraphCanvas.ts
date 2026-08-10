import {
  getClusterLabelOpacity,
  getNodeVisualScale,
  nodeColor,
  RELATION_COLORS,
  type RelationGraphFocus,
  type RelationGraphRelation,
  type RelationGraphSelection,
  relationColor,
  relationIsDirectional,
} from './relationGraphModel'
import {
  type LinkGeometry,
  linkGeometry,
  linkTangent,
  pointOnLink,
  type RelationGraphScene,
  type SceneLink,
  type SceneNode,
} from './relationGraphScene'

/**
 * Immediate-mode renderer for the relations graph. Every frame redraws the
 * scene from scratch onto a canvas, which is what keeps zooming fluid: the
 * cost of a frame is a few thousand cheap draw calls on the visible elements,
 * not a re-rasterization of a retained SVG tree.
 *
 * Two rules keep frames cheap at any camera position:
 * - viewport culling: elements outside the screen (plus a margin for labels)
 *   are skipped entirely;
 * - zoom thresholds: text and arrows are only drawn at zoom levels where they
 *   are legible, so a zoomed-out view is just dots and lines.
 *
 * Everything is drawn in screen space with sizes in CSS pixels, so strokes
 * and text stay crisp and constant-size across zoom levels by construction.
 */
export interface RelationGraphViewState {
  /** Viewport size in CSS pixels. */
  width: number
  height: number
  camera: RelationGraphCamera
  hovered: RelationGraphSelection | undefined
  selection: RelationGraphSelection | undefined
  focus: RelationGraphFocus | undefined
  highlightAnomalies: boolean
  deletedRelationIds: ReadonlySet<string>
  theme: RelationGraphTheme
}

/** world * k + offset = screen. Structurally satisfied by d3.ZoomTransform. */
export interface RelationGraphCamera {
  x: number
  y: number
  k: number
}

/** Colors resolved to concrete values — canvas cannot read CSS variables. */
export interface RelationGraphTheme {
  background: string
  foreground: string
  fontFamily: string
}

type StyleInputs = Pick<
  RelationGraphViewState,
  'focus' | 'highlightAnomalies' | 'hovered' | 'selection'
>

const NODE_RADIUS = 7
const NODE_HOVER_RADIUS = 8.5
export const NODE_RING_RADIUS = 12
const NODE_LABEL_FONT_SIZE = 11
const NODE_CHAIN_LABEL_FONT_SIZE = 9
/** The chain subtitle keeps the old label position, directly above the node. */
const NODE_CHAIN_LABEL_OFFSET_Y = -12
/** Below this on-screen font size node labels are illegible — skip them. */
const NODE_LABEL_MIN_FONT_SIZE = 8
const RELATION_LABEL_MIN_SCALE = 2.5
const RELATION_LABEL_FONT_SIZE = 10
const RELATION_LABEL_OFFSET_Y = -5
const CLUSTER_LABEL_FONT_SIZE = 16
/**
 * Zoomed in past this scale the cluster label grows with the world, so it
 * keeps reading as a heading over the cluster instead of blending in with the
 * node labels, which max out at a smaller constant size.
 */
const CLUSTER_LABEL_GROWTH_START_SCALE = 0.7
const CLUSTER_LABEL_MAX_GROWTH = 3
/**
 * Screen distance from the topmost node's center up to the cluster label.
 * Scaled like node geometry, it clears the node disc and its label (which
 * both scale the same way) at every zoom level.
 */
const CLUSTER_LABEL_CLEARANCE = 34
/** Where along a directional link its arrow sits. */
const ARROW_POSITION = 0.65
const ARROW_LENGTH = 6
/** Below this zoom an arrow would be under ~2px on screen — skip it. */
const ARROW_MIN_SCALE = 0.35
/**
 * Extra screen pixels around the viewport that still draw, so labels hanging
 * off a just-offscreen element do not pop in and out at the edges.
 */
const CULL_MARGIN = 80

export function drawRelationGraph(
  ctx: CanvasRenderingContext2D,
  scene: RelationGraphScene,
  view: RelationGraphViewState,
): void {
  ctx.clearRect(0, 0, view.width, view.height)
  drawLinks(ctx, scene, view)
  if (view.camera.k > RELATION_LABEL_MIN_SCALE) {
    drawRelationLabels(ctx, scene, view)
  }
  drawNodes(ctx, scene, view)
  drawNodeLabels(ctx, scene, view)
  drawClusterLabels(ctx, scene, view)
  ctx.globalAlpha = 1
}

function drawLinks(
  ctx: CanvasRenderingContext2D,
  scene: RelationGraphScene,
  view: RelationGraphViewState,
) {
  const { camera } = view
  const drawArrows = camera.k >= ARROW_MIN_SCALE
  const arrowLength = ARROW_LENGTH * Math.min(camera.k, 1)
  ctx.lineCap = 'round'
  for (const link of scene.links) {
    if (view.deletedRelationIds.has(link.id)) continue
    const geometry = screenLinkGeometry(link, camera)
    if (isOutsideViewport(geometry, view)) continue

    const style = getLinkStyle(link, view)
    ctx.globalAlpha = style.opacity
    ctx.strokeStyle = style.color
    ctx.lineWidth = style.width
    ctx.beginPath()
    ctx.moveTo(geometry.sx, geometry.sy)
    ctx.quadraticCurveTo(geometry.cx, geometry.cy, geometry.tx, geometry.ty)
    ctx.stroke()

    if (drawArrows && relationIsDirectional(link.relation)) {
      drawArrow(ctx, geometry, arrowLength, style.color)
    }
  }
  ctx.globalAlpha = 1
}

function drawArrow(
  ctx: CanvasRenderingContext2D,
  geometry: LinkGeometry,
  length: number,
  color: string,
) {
  const point = pointOnLink(geometry, ARROW_POSITION)
  const direction = linkTangent(geometry, ARROW_POSITION)
  // The anchor point sits 80% along the arrow, like the SVG marker this
  // replaces, so the visible triangle straddles the line the same way.
  const tipX = point.x + direction.x * length * 0.2
  const tipY = point.y + direction.y * length * 0.2
  const backX = point.x - direction.x * length * 0.8
  const backY = point.y - direction.y * length * 0.8
  const halfWidth = length / 2
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.moveTo(tipX, tipY)
  ctx.lineTo(backX - direction.y * halfWidth, backY + direction.x * halfWidth)
  ctx.lineTo(backX + direction.y * halfWidth, backY - direction.x * halfWidth)
  ctx.closePath()
  ctx.fill()
}

function drawRelationLabels(
  ctx: CanvasRenderingContext2D,
  scene: RelationGraphScene,
  view: RelationGraphViewState,
) {
  const { theme } = view
  ctx.font = `600 ${RELATION_LABEL_FONT_SIZE}px ${theme.fontFamily}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.lineJoin = 'round'
  ctx.lineWidth = 3
  ctx.strokeStyle = theme.background
  for (const link of scene.links) {
    if (view.deletedRelationIds.has(link.id)) continue
    const geometry = screenLinkGeometry(link, view.camera)
    if (isOutsideViewport(geometry, view)) continue

    const style = getLinkStyle(link, view)
    const anchor = pointOnLink(geometry, 0.5)
    ctx.globalAlpha = Math.min(style.opacity, 0.8)
    ctx.fillStyle = style.color
    ctx.strokeText(
      link.relation.plugin,
      anchor.x,
      anchor.y + RELATION_LABEL_OFFSET_Y,
    )
    ctx.fillText(
      link.relation.plugin,
      anchor.x,
      anchor.y + RELATION_LABEL_OFFSET_Y,
    )
  }
  ctx.globalAlpha = 1
}

function drawNodes(
  ctx: CanvasRenderingContext2D,
  scene: RelationGraphScene,
  view: RelationGraphViewState,
) {
  const { camera, focus, hovered, selection, theme } = view
  const visualScale = nodeVisualScreenScale(camera.k)
  for (const node of scene.nodes) {
    const x = node.x * camera.k + camera.x
    const y = node.y * camera.k + camera.y
    if (isPointOutsideViewport(x, y, view)) continue

    const id = node.data.id
    const groupAlpha = focus === undefined || focus.nodeIds.has(id) ? 1 : 0.12
    const isHovered = hovered?.type === 'node' && hovered.id === id
    const isSelected = selection?.type === 'node' && selection.id === id
    const color = nodeColor(node.data)

    const ringOpacity = getNodeRingOpacity(node, view)
    if (ringOpacity > 0) {
      ctx.globalAlpha = groupAlpha * ringOpacity
      ctx.strokeStyle = color
      ctx.lineWidth = (isSelected ? 3.5 : 2.5) * visualScale
      ctx.beginPath()
      ctx.arc(x, y, NODE_RING_RADIUS * visualScale, 0, 2 * Math.PI)
      ctx.stroke()
    }

    ctx.globalAlpha = groupAlpha
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(
      x,
      y,
      (isHovered ? NODE_HOVER_RADIUS : NODE_RADIUS) * visualScale,
      0,
      2 * Math.PI,
    )
    ctx.fill()
    ctx.strokeStyle = theme.background
    ctx.lineWidth = 2 * visualScale
    ctx.stroke()
  }
  ctx.globalAlpha = 1
}

function drawNodeLabels(
  ctx: CanvasRenderingContext2D,
  scene: RelationGraphScene,
  view: RelationGraphViewState,
) {
  const { camera, focus, hovered, theme } = view
  const visualScale = nodeVisualScreenScale(camera.k)
  const fontSize = NODE_LABEL_FONT_SIZE * visualScale
  // Zoomed out, labels are only kept for the hovered and focused nodes — a
  // handful — clamped up to stay legible; cluster labels carry that view.
  const showAll = fontSize >= NODE_LABEL_MIN_FONT_SIZE
  if (!showAll && hovered === undefined && focus === undefined) return

  // Focused labels remain legible even when the graph is zoomed far out. Use
  // the same minimum scale for their offsets so the two lines do not overlap.
  const labelScale = Math.max(
    visualScale,
    NODE_LABEL_MIN_FONT_SIZE / NODE_LABEL_FONT_SIZE,
  )
  const chainFontSize = Math.max(
    NODE_CHAIN_LABEL_FONT_SIZE * visualScale,
    NODE_LABEL_MIN_FONT_SIZE,
  )
  const chainLabelOffsetY = NODE_CHAIN_LABEL_OFFSET_Y * labelScale
  const symbolLabelOffsetY = chainLabelOffsetY - chainFontSize - labelScale

  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'
  ctx.lineJoin = 'round'
  ctx.lineWidth = Math.max(3 * labelScale, 2)
  ctx.strokeStyle = theme.background
  ctx.fillStyle = theme.foreground

  drawNodeLabelLine(
    ctx,
    scene,
    view,
    showAll,
    `600 ${Math.max(fontSize, NODE_LABEL_MIN_FONT_SIZE)}px ${theme.fontFamily}`,
    symbolLabelOffsetY,
    (node) => node.label,
    1,
  )
  drawNodeLabelLine(
    ctx,
    scene,
    view,
    showAll,
    `500 ${chainFontSize}px ${theme.fontFamily}`,
    chainLabelOffsetY,
    (node) => node.data.chain,
    0.8,
  )
  ctx.globalAlpha = 1
}

function drawNodeLabelLine(
  ctx: CanvasRenderingContext2D,
  scene: RelationGraphScene,
  view: RelationGraphViewState,
  showAll: boolean,
  font: string,
  offsetY: number,
  text: (node: SceneNode) => string,
  opacity: number,
) {
  const { camera, focus, hovered } = view
  ctx.font = font
  for (const node of scene.nodes) {
    const id = node.data.id
    const emphasized =
      (hovered?.type === 'node' && hovered.id === id) ||
      focus?.nodeIds.has(id) === true
    if (!showAll && !emphasized) continue
    const x = node.x * camera.k + camera.x
    const y = node.y * camera.k + camera.y
    if (isPointOutsideViewport(x, y, view)) continue

    const focusOpacity = focus === undefined || focus.nodeIds.has(id) ? 1 : 0.12
    ctx.globalAlpha = focusOpacity * opacity
    const labelY = y + offsetY
    const label = text(node)
    ctx.strokeText(label, x, labelY)
    ctx.fillText(label, x, labelY)
  }
}

function drawClusterLabels(
  ctx: CanvasRenderingContext2D,
  scene: RelationGraphScene,
  view: RelationGraphViewState,
) {
  const { camera, theme } = view
  const opacity = getClusterLabelOpacity(camera.k)
  if (opacity === 0) return

  const clearance = CLUSTER_LABEL_CLEARANCE * nodeVisualScreenScale(camera.k)
  const fontSize =
    CLUSTER_LABEL_FONT_SIZE *
    Math.min(
      Math.max(camera.k / CLUSTER_LABEL_GROWTH_START_SCALE, 1),
      CLUSTER_LABEL_MAX_GROWTH,
    )
  ctx.font = `700 ${fontSize}px ${theme.fontFamily}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'bottom'
  ctx.lineJoin = 'round'
  ctx.lineWidth = fontSize / 4
  ctx.strokeStyle = theme.background
  ctx.fillStyle = theme.foreground
  ctx.globalAlpha = opacity
  for (const label of scene.clusterLabels) {
    // The label hangs above the cluster — horizontally centered, just clear
    // of the topmost node — so it never covers what it names.
    let sumX = 0
    let topY = Number.POSITIVE_INFINITY
    for (const node of label.nodes) {
      sumX += node.x
      topY = Math.min(topY, node.y)
    }
    const x = (sumX / label.nodes.length) * camera.k + camera.x
    const y = topY * camera.k + camera.y - clearance
    if (isPointOutsideViewport(x, y, view)) continue

    ctx.strokeText(label.text, x, y)
    ctx.fillText(label.text, x, y)
  }
  ctx.globalAlpha = 1
}

export interface LinkStyle {
  color: string
  opacity: number
  width: number
}

export function getLinkStyle(link: SceneLink, view: StyleInputs): LinkStyle {
  const { focus, highlightAnomalies } = view
  const isHovered = isLinkHovered(link, view.hovered)
  const inFocus = focus?.relationIds.has(link.id) === true
  return {
    color: displayedRelationColor(link.relation, highlightAnomalies),
    opacity: getLinkOpacity(link, view, isHovered, inFocus),
    width: isHovered
      ? 3
      : inFocus
        ? 2.8
        : highlightAnomalies && link.relation.isConflict
          ? 2.2
          : 1.4,
  }
}

function getLinkOpacity(
  link: SceneLink,
  view: StyleInputs,
  isHovered: boolean,
  inFocus: boolean,
) {
  if (isHovered || inFocus) return 0.95
  if (view.focus !== undefined) return 0.08
  if (view.highlightAnomalies) {
    return link.relation.isConflict ? 0.95 : 0.22
  }
  return 0.55
}

/** Hovering a node lights up its incident links as well. */
function isLinkHovered(
  link: SceneLink,
  hovered: RelationGraphSelection | undefined,
) {
  if (hovered?.type === 'relation') return link.id === hovered.id
  if (hovered?.type === 'node') {
    return (
      link.source.data.id === hovered.id || link.target.data.id === hovered.id
    )
  }
  return false
}

function displayedRelationColor(
  relation: RelationGraphRelation,
  highlightAnomalies: boolean,
) {
  if (!highlightAnomalies) return relationColor(relation)
  return relation.isConflict ? RELATION_COLORS.conflict : RELATION_COLORS.muted
}

export function getNodeRingOpacity(node: SceneNode, view: StyleInputs): number {
  const id = node.data.id
  const { focus, hovered, selection } = view
  if (hovered?.type === 'node' && hovered.id === id) return 0.8
  if (selection?.type === 'node' && selection.id === id) return 1
  if (selection?.type === 'relation' && focus?.nodeIds.has(id) === true) {
    return 0.7
  }
  return 0
}

/**
 * On-screen size multiplier for node geometry: nodes scale with the world
 * until 1.2x zoom and keep a constant screen size beyond it.
 */
export function nodeVisualScreenScale(scale: number) {
  return scale * getNodeVisualScale(scale)
}

function screenLinkGeometry(
  link: SceneLink,
  camera: RelationGraphCamera,
): LinkGeometry {
  const geometry = linkGeometry(link)
  const { x, y, k } = camera
  return {
    sx: geometry.sx * k + x,
    sy: geometry.sy * k + y,
    cx: geometry.cx * k + x,
    cy: geometry.cy * k + y,
    tx: geometry.tx * k + x,
    ty: geometry.ty * k + y,
  }
}

function isOutsideViewport(
  geometry: LinkGeometry,
  view: RelationGraphViewState,
) {
  return (
    Math.max(geometry.sx, geometry.cx, geometry.tx) < -CULL_MARGIN ||
    Math.min(geometry.sx, geometry.cx, geometry.tx) >
      view.width + CULL_MARGIN ||
    Math.max(geometry.sy, geometry.cy, geometry.ty) < -CULL_MARGIN ||
    Math.min(geometry.sy, geometry.cy, geometry.ty) > view.height + CULL_MARGIN
  )
}

function isPointOutsideViewport(
  x: number,
  y: number,
  view: RelationGraphViewState,
) {
  return (
    x < -CULL_MARGIN ||
    x > view.width + CULL_MARGIN ||
    y < -CULL_MARGIN ||
    y > view.height + CULL_MARGIN
  )
}

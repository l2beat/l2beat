import * as d3 from 'd3'
import { type RefObject, useEffect, useMemo, useRef, useState } from 'react'
import {
  type LayoutLink,
  type LayoutNode,
  layoutRelationGraph,
} from './relationGraphLayout'
import {
  getClusterLabelStyle,
  getRelationGraphFocus,
  mostCommonDeployedSymbol,
  nodeColor,
  nodeLabel,
  RELATION_COLORS,
  type RelationGraph,
  type RelationGraphFocus,
  type RelationGraphRelation,
  type RelationGraphSelection,
  relationColor,
  relationId,
  relationTypeLabel,
  sourceId,
  targetId,
  unorderedPairKey,
} from './relationGraphModel'

type NodeDatum = RelationGraph['nodes'][number] & LayoutNode
type VisualLink = LayoutLink<NodeDatum> & {
  relation: RelationGraphRelation
  curve: number
}

type HoveredItem = RelationGraphSelection | undefined

const SEARCH_ZOOM_SCALE = 2
const SEARCH_ZOOM_DURATION_MS = 300
const DETAILS_PANEL_MAX_WIDTH = 440
const DETAILS_PANEL_WIDTH_RATIO = 0.92

interface GraphStyleState {
  focus: RelationGraphFocus | undefined
  highlightAnomalies: boolean
  hovered: HoveredItem
  selection: RelationGraphSelection | undefined
}

export function TokenRelationsGraph({
  graph,
  selection,
  zoomTarget,
  highlightAnomalies,
  onSelectionChange,
}: {
  graph: RelationGraph
  selection: RelationGraphSelection | undefined
  zoomTarget: { nodeId: string } | undefined
  highlightAnomalies: boolean
  onSelectionChange: (selection: RelationGraphSelection | undefined) => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const zoomToNodeRef = useRef<((nodeId: string) => void) | undefined>(
    undefined,
  )
  const onSelectionChangeRef = useRef(onSelectionChange)
  const [hovered, setHovered] = useState<HoveredItem>()
  const size = useElementSize(containerRef)
  // Hover styling touches every SVG node and edge. Build the selected
  // neighborhood only when the selection changes so that pass stays linear.
  const focus = useMemo(
    () => getRelationGraphFocus(graph, selection),
    [graph, selection],
  )
  const styleStateRef = useRef<GraphStyleState>({
    focus,
    highlightAnomalies,
    hovered,
    selection,
  })
  styleStateRef.current = {
    focus,
    highlightAnomalies,
    hovered,
    selection,
  }

  useEffect(() => {
    onSelectionChangeRef.current = onSelectionChange
  }, [onSelectionChange])

  useEffect(() => {
    const svgElement = svgRef.current
    if (!svgElement || size.width === 0 || size.height === 0) return

    const nodes = graph.nodes.map((node): NodeDatum => ({ ...node }))
    const nodeById = new Map(nodes.map((node) => [node.id, node]))
    const visualLinks = buildVisualLinks(graph.relations, nodeById)
    const layout = layoutRelationGraph(nodes, buildSimulationLinks(visualLinks))
    const clusterLabelData = layout.clusters.flatMap((cluster) => {
      const text = mostCommonDeployedSymbol(cluster.nodes)
      return text === undefined ? [] : [{ nodes: cluster.nodes, text }]
    })

    const svg = d3.select(svgElement)
    svg.selectAll('*').remove()
    svg.attr('viewBox', `0 0 ${size.width} ${size.height}`)

    appendArrowMarkers(svg)

    const background = svg
      .append('rect')
      .attr('width', size.width)
      .attr('height', size.height)
      .attr('fill', 'transparent')
      .attr('cursor', 'grab')
      .on('click', () => onSelectionChangeRef.current(undefined))

    const layer = svg.append('g')
    const linksLayer = layer.append('g')
    const nodesLayer = layer.append('g')
    const clusterLabelsLayer = layer.append('g')

    const links = linksLayer
      .selectAll<SVGPathElement, VisualLink>('path.relation-link')
      .data(visualLinks, (link) => relationId(link.relation))
      .join('path')
      .attr('class', 'relation-link')
      .attr('fill', 'none')
      .attr('stroke', (link) => relationColor(link.relation))
      .attr('stroke-linecap', 'round')
      .attr('stroke-width', 1.4)
      .attr('opacity', 0.55)
      .attr('marker-end', (link) => markerUrl(link.relation, false))

    links.append('title').text((link) => {
      const relation = link.relation
      return `${relation.tokenFromChain}:${relation.tokenFromAddress} -> ${relation.tokenToChain}:${relation.tokenToAddress}\n${relationTypeLabel(relation)} via ${relation.plugin}`
    })

    const linkHits = linksLayer
      .selectAll<SVGPathElement, VisualLink>('path.relation-hit')
      .data(visualLinks, (link) => relationId(link.relation))
      .join('path')
      .attr('class', 'relation-hit')
      .attr('fill', 'none')
      .attr('stroke', 'transparent')
      .attr('stroke-width', 14)
      .attr('pointer-events', 'stroke')
      .attr('cursor', 'pointer')
      .on('mouseenter', (_, link) =>
        setHovered({ type: 'relation', id: relationId(link.relation) }),
      )
      .on('mouseleave', () => setHovered(undefined))
      .on('click', (event, link) => {
        event.stopPropagation()
        onSelectionChangeRef.current({
          type: 'relation',
          id: relationId(link.relation),
        })
      })

    const clusterLabels = clusterLabelsLayer
      .selectAll<SVGTextElement, (typeof clusterLabelData)[number]>('text')
      .data(clusterLabelData)
      .join('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('paint-order', 'stroke')
      .attr('stroke', 'var(--background)')
      .attr('fill', 'var(--foreground)')
      .attr('font-weight', 700)
      .attr('letter-spacing', '0.08em')
      .attr('pointer-events', 'none')
      .text((label) => label.text)

    const node = nodesLayer
      .selectAll<SVGGElement, NodeDatum>('g.relation-node')
      .data(nodes, (node) => node.id)
      .join('g')
      .attr('class', 'relation-node')
      .attr('cursor', 'pointer')
      .on('mouseenter', (_, node) => setHovered({ type: 'node', id: node.id }))
      .on('mouseleave', () => setHovered(undefined))
      .on('click', (event, node) => {
        event.stopPropagation()
        onSelectionChangeRef.current({ type: 'node', id: node.id })
      })

    node
      .append('circle')
      .attr('class', 'node-ring')
      .attr('r', nodeRadius() + 5)
      .attr('fill', 'none')
      .attr('stroke', (node) => nodeColor(node))
      .attr('stroke-width', 2.5)
      .attr('opacity', 0)

    node
      .append('circle')
      .attr('class', 'node-core')
      .attr('r', nodeRadius())
      .attr('fill', (node) => nodeColor(node))
      .attr('stroke', 'var(--background)')
      .attr('stroke-width', 2)

    node
      .append('text')
      .attr('class', 'node-label')
      .attr('x', 0)
      .attr('y', -12)
      .attr('text-anchor', 'middle')
      .attr('paint-order', 'stroke')
      .attr('stroke', 'var(--background)')
      .attr('stroke-width', 3)
      .attr('fill', 'var(--foreground)')
      .attr('font-size', 11)
      .attr('font-weight', 600)
      .attr('pointer-events', 'none')
      .text(nodeLabel)

    node
      .append('title')
      .text(
        (node) =>
          `${nodeLabel(node)} on ${node.chain}\n${node.chain}:${node.address}\n${node.isDeployed ? 'Deployed token exists' : 'Missing deployed token'}`,
      )

    function redraw() {
      links.attr('d', linkPath)
      linkHits.attr('d', linkPath)
      node.attr('transform', (node) => `translate(${node.x},${node.y})`)
      clusterLabels
        .attr('x', (label) => clusterCenter(label.nodes).x)
        .attr('y', (label) => clusterCenter(label.nodes).y)
    }
    redraw()

    const fitScale = Math.min(
      (size.width - 32) / layout.width,
      (size.height - 32) / layout.height,
      1,
    )
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([Math.min(fitScale / 2, 0.1), 8])
      .on('start', () => background.attr('cursor', 'grabbing'))
      .on('zoom', (event) => {
        layer.attr('transform', event.transform.toString())
        updateClusterLabelScale(clusterLabels, event.transform.k)
      })
      .on('end', () => background.attr('cursor', 'grab'))
    svg.call(zoom)

    const initialTransform = d3.zoomIdentity
      .translate(
        (size.width - layout.width * fitScale) / 2,
        (size.height - layout.height * fitScale) / 2,
      )
      .scale(fitScale)
    svg.call(zoom.transform, initialTransform)

    zoomToNodeRef.current = (nodeId) => {
      const target = nodeById.get(nodeId)
      if (target === undefined) {
        throw new Error(`Cannot zoom to missing graph node ${nodeId}`)
      }
      if (target.x === undefined || target.y === undefined) {
        throw new Error(`Graph node ${nodeId} has no layout position`)
      }

      const detailsPanelWidth = Math.min(
        size.width * DETAILS_PANEL_WIDTH_RATIO,
        DETAILS_PANEL_MAX_WIDTH,
      )
      const visibleCenterX = (size.width - detailsPanelWidth) / 2
      const transform = d3.zoomIdentity
        .translate(
          visibleCenterX - target.x * SEARCH_ZOOM_SCALE,
          size.height / 2 - target.y * SEARCH_ZOOM_SCALE,
        )
        .scale(SEARCH_ZOOM_SCALE)
      svg
        .transition()
        .duration(SEARCH_ZOOM_DURATION_MS)
        .call(zoom.transform, transform)
    }

    node.call(
      d3
        .drag<SVGGElement, NodeDatum>()
        .on('start', (event) => {
          d3.select(event.sourceEvent.currentTarget).attr('cursor', 'grabbing')
        })
        .on('drag', (event, node) => {
          node.x = event.x
          node.y = event.y
          redraw()
        })
        .on('end', (event) => {
          d3.select(event.sourceEvent.currentTarget).attr('cursor', 'pointer')
        }),
    )
    updateGraphStyles(svgElement, styleStateRef.current)
    return () => {
      svg.interrupt()
      zoomToNodeRef.current = undefined
    }
  }, [graph, size.height, size.width])

  useEffect(() => {
    if (zoomTarget === undefined) return
    const zoomToNode = zoomToNodeRef.current
    if (zoomToNode === undefined) {
      throw new Error('Relation graph zoom is not initialized')
    }
    zoomToNode(zoomTarget.nodeId)
  }, [zoomTarget])

  useEffect(() => {
    const svgElement = svgRef.current
    if (!svgElement) return
    updateGraphStyles(svgElement, {
      focus,
      highlightAnomalies,
      hovered,
      selection,
    })
  }, [focus, highlightAnomalies, hovered, selection])

  return (
    <div ref={containerRef} className="h-full w-full">
      <svg ref={svgRef} className="h-full w-full" />
    </div>
  )
}

function updateGraphStyles(
  svgElement: SVGSVGElement,
  { focus, highlightAnomalies, hovered, selection }: GraphStyleState,
) {
  const svg = d3.select(svgElement)
  const links = svg.selectAll<SVGPathElement, VisualLink>('.relation-link')
  const nodes = svg.selectAll<SVGGElement, NodeDatum>('.relation-node')
  const hasSelection = focus !== undefined

  links
    .attr('stroke', (link) =>
      highlightAnomalies
        ? link.relation.isConflict
          ? RELATION_COLORS.conflict
          : RELATION_COLORS.muted
        : relationColor(link.relation),
    )
    .attr('marker-end', (link) => markerUrl(link.relation, highlightAnomalies))
    .attr('opacity', (link) => {
      const isHovered = isLinkActive(link, hovered)
      const isSelected = focus?.relationIds.has(relationId(link.relation))
      if (isHovered || isSelected) return 0.95
      if (hasSelection) return 0.08
      if (highlightAnomalies) {
        return link.relation.isConflict ? 0.95 : 0.22
      }
      return 0.55
    })
    .attr('stroke-width', (link) => {
      if (isLinkActive(link, hovered)) return 3
      if (focus?.relationIds.has(relationId(link.relation))) return 2.8
      if (highlightAnomalies && link.relation.isConflict) return 2.2
      return 1.4
    })

  nodes
    .attr('opacity', (node) =>
      focus === undefined || focus.nodeIds.has(node.id) ? 1 : 0.12,
    )
    .select<SVGCircleElement>('.node-ring')
    .attr('opacity', (node) => {
      if (hovered?.type === 'node' && hovered.id === node.id) return 0.8
      if (selection?.type === 'node' && selection.id === node.id) return 1
      if (selection?.type === 'relation' && focus?.nodeIds.has(node.id)) {
        return 0.7
      }
      return 0
    })
    .attr('stroke-width', (node) =>
      selection?.type === 'node' && selection.id === node.id ? 3.5 : 2.5,
    )

  nodes
    .select<SVGCircleElement>('.node-core')
    .attr('r', (node) =>
      hovered?.type === 'node' && hovered.id === node.id
        ? nodeRadius() + 1.5
        : nodeRadius(),
    )
}

function appendArrowMarkers(
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
) {
  const markers = [
    { id: 'relation-arrow-burn-and-mint', color: RELATION_COLORS.burnAndMint },
    { id: 'relation-arrow-lock-and-mint', color: RELATION_COLORS.lockAndMint },
    { id: 'relation-arrow-conflict', color: RELATION_COLORS.conflict },
    { id: 'relation-arrow-muted', color: RELATION_COLORS.muted },
  ]

  svg
    .append('defs')
    .selectAll('marker')
    .data(markers)
    .join('marker')
    .attr('id', (marker) => marker.id)
    .attr('viewBox', '0 0 10 10')
    .attr('refX', 8)
    .attr('refY', 5)
    .attr('markerWidth', 6)
    .attr('markerHeight', 6)
    .attr('orient', 'auto')
    .append('path')
    .attr('d', 'M 0 0 L 10 5 L 0 10 z')
    .attr('fill', (marker) => marker.color)
}

function markerUrl(
  relation: RelationGraphRelation,
  highlightAnomalies: boolean,
) {
  if (highlightAnomalies) {
    return relation.isConflict
      ? 'url(#relation-arrow-conflict)'
      : 'url(#relation-arrow-muted)'
  }
  switch (relation.bridgeType) {
    case 'burnAndMint':
      return 'url(#relation-arrow-burn-and-mint)'
    case 'lockAndMint':
      return 'url(#relation-arrow-lock-and-mint)'
    default:
      throw new Error(
        `Unexpected bridge type in relations graph: ${relation.bridgeType}`,
      )
  }
}

function updateClusterLabelScale(
  labels: d3.Selection<
    SVGTextElement,
    { nodes: NodeDatum[]; text: string },
    SVGGElement,
    unknown
  >,
  scale: number,
) {
  const style = getClusterLabelStyle(scale)
  labels
    .attr('font-size', style.fontSize)
    .attr('stroke-width', style.strokeWidth)
    .attr('opacity', style.opacity)
}

function clusterCenter(nodes: NodeDatum[]) {
  return {
    x: d3.mean(nodes, (node) => node.x ?? 0) ?? 0,
    y: d3.mean(nodes, (node) => node.y ?? 0) ?? 0,
  }
}

function useElementSize<T extends HTMLElement>(ref: RefObject<T | null>) {
  const [size, setSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    if (!ref.current) return

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (!entry) return

      setSize({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      })
    })
    observer.observe(ref.current)

    return () => observer.disconnect()
  }, [ref])

  return size
}

function buildVisualLinks(
  relations: RelationGraphRelation[],
  nodeById: Map<string, NodeDatum>,
): VisualLink[] {
  const relationGroups = new Map<string, RelationGraphRelation[]>()
  for (const relation of relations) {
    const key = unorderedPairKey(sourceId(relation), targetId(relation))
    const group = relationGroups.get(key)
    if (group === undefined) {
      relationGroups.set(key, [relation])
    } else {
      group.push(relation)
    }
  }

  return relations.map((relation) => {
    const source = nodeById.get(sourceId(relation))
    const target = nodeById.get(targetId(relation))
    if (source === undefined || target === undefined) {
      throw new Error('Relation graph contains an unknown endpoint')
    }

    const group = relationGroups.get(
      unorderedPairKey(sourceId(relation), targetId(relation)),
    )
    if (group === undefined) {
      throw new Error('Relation graph contains an ungrouped relation')
    }
    const index = group.findIndex(
      (entry) => relationId(entry) === relationId(relation),
    )
    if (index === -1) {
      throw new Error('Relation graph group does not contain relation')
    }
    const direction = source.id < target.id ? 1 : -1
    const curve = (index - (group.length - 1) / 2) * 16 * direction

    return { source, target, relation, curve }
  })
}

function buildSimulationLinks(visualLinks: VisualLink[]) {
  const links = new Map<string, LayoutLink<NodeDatum>>()
  for (const link of visualLinks) {
    links.set(unorderedPairKey(link.source.id, link.target.id), {
      source: link.source,
      target: link.target,
    })
  }
  return [...links.values()]
}

function linkPath(link: VisualLink) {
  const sourceX = link.source.x ?? 0
  const sourceY = link.source.y ?? 0
  const targetX = link.target.x ?? 0
  const targetY = link.target.y ?? 0
  const dx = targetX - sourceX
  const dy = targetY - sourceY
  const distance = Math.sqrt(dx * dx + dy * dy)
  if (distance === 0) return `M${sourceX},${sourceY}`

  const ux = dx / distance
  const uy = dy / distance
  const sx = sourceX + ux * (nodeRadius() + 2)
  const sy = sourceY + uy * (nodeRadius() + 2)
  const tx = targetX - ux * (nodeRadius() + 7)
  const ty = targetY - uy * (nodeRadius() + 7)

  if (link.curve === 0) {
    return `M${sx},${sy} L${tx},${ty}`
  }

  const nx = -uy
  const ny = ux
  const mx = (sx + tx) / 2 + nx * link.curve
  const my = (sy + ty) / 2 + ny * link.curve

  return `M${sx},${sy} Q${mx},${my} ${tx},${ty}`
}

function nodeRadius() {
  return 7
}

function isLinkActive(
  link: VisualLink,
  selection: RelationGraphSelection | undefined,
) {
  if (selection?.type === 'relation') {
    return relationId(link.relation) === selection.id
  }
  if (selection?.type === 'node') {
    return link.source.id === selection.id || link.target.id === selection.id
  }
  return false
}

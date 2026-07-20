import type { RouterOutputs } from '@l2beat/token-backend'
import { useQuery } from '@tanstack/react-query'
import * as d3 from 'd3'
import { type RefObject, useEffect, useRef, useState } from 'react'
import { LoadingState } from '~/components/LoadingState'
import { AppLayout } from '~/layouts/AppLayout'
import { useTRPC } from '~/react-query/trpc'
import {
  type LayoutLink,
  type LayoutNode,
  layoutRelationGraph,
} from './relationGraphLayout'

type Graph = RouterOutputs['deployedTokens']['getRelationsGraph']
type Relation = Graph['relations'][number]
type NodeDatum = Graph['nodes'][number] & LayoutNode
type VisualLink = LayoutLink<NodeDatum> & {
  relation: Relation
  curve: number
}

export function TokenRelationsGraphPage() {
  const trpc = useTRPC()
  const { data, isLoading } = useQuery(
    trpc.deployedTokens.getRelationsGraph.queryOptions(),
  )

  return (
    <AppLayout className="min-h-svh">
      <div className="flex h-[calc(100vh-1rem)] flex-col gap-3">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="font-semibold text-xl">Token Relations Graph</h1>
            <div className="text-muted-foreground text-sm">
              {data
                ? `${data.nodes.length} deployed tokens, ${data.relations.length} relations`
                : 'Loading graph data'}
            </div>
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-hidden rounded-md border bg-background">
          {isLoading || data === undefined ? (
            <LoadingState className="h-full" />
          ) : data.nodes.length === 0 ? (
            <div className="grid h-full place-items-center text-muted-foreground text-sm">
              No token relations.
            </div>
          ) : (
            <TokenRelationsGraph graph={data} />
          )}
        </div>
      </div>
    </AppLayout>
  )
}

function TokenRelationsGraph({ graph }: { graph: Graph }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const size = useElementSize(containerRef)

  useEffect(() => {
    if (!svgRef.current || size.width === 0 || size.height === 0) return

    const nodes = graph.nodes.map((node): NodeDatum => ({ ...node }))
    const nodeById = new Map(nodes.map((node) => [node.id, node]))
    const visualLinks = buildVisualLinks(graph.relations, nodeById)
    const simulationLinks = buildSimulationLinks(visualLinks)
    const layout = layoutRelationGraph(nodes, simulationLinks)
    const chainColor = d3
      .scaleOrdinal<string, string>(d3.schemeTableau10)
      .domain([...new Set(nodes.map((node) => node.chain))].sort())

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()
    svg.attr('viewBox', `0 0 ${size.width} ${size.height}`)

    const layer = svg.append('g')
    const linksLayer = layer.append('g')
    const nodesLayer = layer.append('g')

    svg
      .append('defs')
      .selectAll('marker')
      .data([
        { id: 'token-relation-arrow', color: 'var(--muted-foreground)' },
        { id: 'token-relation-conflict-arrow', color: 'var(--destructive)' },
      ])
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

    const fitScale = Math.min(
      (size.width - 32) / layout.width,
      (size.height - 32) / layout.height,
      1,
    )
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([Math.min(fitScale / 2, 0.1), 8])
      .on('zoom', (event) => {
        layer.attr('transform', event.transform.toString())
      })
    svg.call(zoom)

    const links = linksLayer
      .selectAll<SVGPathElement, VisualLink>('path')
      .data(visualLinks, (link) => relationId(link.relation))
      .join('path')
      .attr('fill', 'none')
      .attr('stroke', (link) =>
        link.relation.isConflict
          ? 'var(--destructive)'
          : 'var(--muted-foreground)',
      )
      .attr('stroke-opacity', (link) => (link.relation.isConflict ? 0.9 : 0.45))
      .attr('stroke-width', (link) => (link.relation.isConflict ? 2 : 1.2))
      .attr('marker-end', (link) =>
        link.relation.isConflict
          ? 'url(#token-relation-conflict-arrow)'
          : 'url(#token-relation-arrow)',
      )

    links.append('title').text((link) => {
      const relation = link.relation
      return `${formatEndpoint(relation.tokenFromChain, relation.tokenFromAddress)} -> ${formatEndpoint(relation.tokenToChain, relation.tokenToAddress)} via ${relation.plugin} (${relation.bridgeType})${relation.isConflict ? '\nConflict: endpoints belong to different abstract tokens' : ''}`
    })

    const node = nodesLayer
      .selectAll<SVGGElement, NodeDatum>('g')
      .data(nodes, (node) => node.id)
      .join('g')
      .attr('cursor', 'grab')

    node
      .append('circle')
      .attr('r', nodeRadius())
      .attr('fill', (node) => chainColor(node.chain))
      .attr('stroke', 'var(--background)')
      .attr('stroke-width', 2)

    node
      .append('text')
      .attr('x', 0)
      .attr('y', -12)
      .attr('text-anchor', 'middle')
      .attr('paint-order', 'stroke')
      .attr('stroke', 'var(--background)')
      .attr('stroke-width', 3)
      .attr('fill', 'var(--foreground)')
      .attr('font-size', 11)
      .attr('font-weight', 600)
      .text((node) => node.symbol)

    node
      .append('title')
      .text(
        (node) =>
          `${node.symbol} on ${node.chain}\n${formatEndpoint(node.chain, node.address)}`,
      )

    function redraw() {
      links.attr('d', linkPath)
      node.attr('transform', (node) => `translate(${node.x},${node.y})`)
    }
    redraw()

    const initialTransform = d3.zoomIdentity
      .translate(
        (size.width - layout.width * fitScale) / 2,
        (size.height - layout.height * fitScale) / 2,
      )
      .scale(fitScale)
    svg.call(zoom.transform, initialTransform)

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
          d3.select(event.sourceEvent.currentTarget).attr('cursor', 'grab')
        }),
    )
  }, [graph, size.height, size.width])

  return (
    <div ref={containerRef} className="h-full w-full">
      <svg ref={svgRef} className="h-full w-full" />
    </div>
  )
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
  relations: Relation[],
  nodeById: Map<string, NodeDatum>,
): VisualLink[] {
  const relationGroups = new Map<string, Relation[]>()
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
    const curve = (index - (group.length - 1) / 2) * 16

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

function relationId(relation: Relation) {
  return [
    relation.tokenFromChain,
    relation.tokenFromAddress,
    relation.tokenToChain,
    relation.tokenToAddress,
    relation.plugin,
    relation.bridgeType,
  ].join(':')
}

function sourceId(relation: Relation) {
  return tokenId(relation.tokenFromChain, relation.tokenFromAddress)
}

function targetId(relation: Relation) {
  return tokenId(relation.tokenToChain, relation.tokenToAddress)
}

function tokenId(chain: string, address: string) {
  return `${chain}:${address.toLowerCase()}`
}

function unorderedPairKey(a: string, b: string) {
  return a < b ? `${a}|${b}` : `${b}|${a}`
}

function formatEndpoint(chain: string, address: string) {
  return `${chain}:${address}`
}

import type { RouterOutputs } from '@l2beat/token-backend'
import { useQuery } from '@tanstack/react-query'
import * as d3 from 'd3'
import { type RefObject, useEffect, useRef, useState } from 'react'
import { LoadingState } from '~/components/LoadingState'
import { AppLayout } from '~/layouts/AppLayout'
import { useTRPC } from '~/react-query/trpc'

type Graph = RouterOutputs['deployedTokens']['getRelationsGraph']
type Relation = Graph['relations'][number]
type NodeDatum = Graph['nodes'][number] & d3.SimulationNodeDatum
type VisualLink = {
  source: NodeDatum
  target: NodeDatum
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
      .append('marker')
      .attr('id', 'token-relation-arrow')
      .attr('viewBox', '0 0 10 10')
      .attr('refX', 8)
      .attr('refY', 5)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M 0 0 L 10 5 L 0 10 z')
      .attr('fill', 'var(--muted-foreground)')

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 8])
      .on('zoom', (event) => {
        layer.attr('transform', event.transform.toString())
      })
    svg.call(zoom)

    const links = linksLayer
      .selectAll<SVGPathElement, VisualLink>('path')
      .data(visualLinks, (link) => relationId(link.relation))
      .join('path')
      .attr('fill', 'none')
      .attr('stroke', 'var(--muted-foreground)')
      .attr('stroke-opacity', 0.45)
      .attr('stroke-width', 1.2)
      .attr('marker-end', 'url(#token-relation-arrow)')

    links.append('title').text((link) => {
      const relation = link.relation
      return `${formatEndpoint(relation.tokenFromChain, relation.tokenFromAddress)} -> ${formatEndpoint(relation.tokenToChain, relation.tokenToAddress)} via ${relation.plugin}`
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

    const simulation = d3
      .forceSimulation(nodes)
      .force(
        'link',
        d3
          .forceLink<NodeDatum, d3.SimulationLinkDatum<NodeDatum>>(
            simulationLinks,
          )
          .id((node) => node.id)
          .distance(100)
          .strength(0.45),
      )
      .force('charge', d3.forceManyBody().strength(-130))
      .force('center', d3.forceCenter(size.width / 2, size.height / 2))
      .force('collision', d3.forceCollide<NodeDatum>().radius(26))
      .on('tick', () => {
        links.attr('d', linkPath)
        node.attr('transform', (node) => `translate(${node.x},${node.y})`)
      })

    node.call(
      d3
        .drag<SVGGElement, NodeDatum>()
        .on('start', (event, node) => {
          if (!event.active) simulation.alphaTarget(0.3).restart()
          node.fx = node.x
          node.fy = node.y
        })
        .on('drag', (event, node) => {
          node.fx = event.x
          node.fy = event.y
        })
        .on('end', (event, node) => {
          if (!event.active) simulation.alphaTarget(0)
          node.fx = null
          node.fy = null
        }),
    )

    return () => {
      simulation.stop()
    }
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
    relationGroups.set(key, [...(relationGroups.get(key) ?? []), relation])
  }

  return relations.map((relation) => {
    const group =
      relationGroups.get(
        unorderedPairKey(sourceId(relation), targetId(relation)),
      ) ?? []
    const index = group.findIndex(
      (entry) => relationId(entry) === relationId(relation),
    )
    const curve = (index - (group.length - 1) / 2) * 16

    return {
      source: nodeById.get(sourceId(relation))!,
      target: nodeById.get(targetId(relation))!,
      relation,
      curve,
    }
  })
}

function buildSimulationLinks(visualLinks: VisualLink[]) {
  const links = new Map<string, d3.SimulationLinkDatum<NodeDatum>>()
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
    String(relation.sourceWasBurned),
    String(relation.destinationWasMinted),
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

import { useMemo } from 'react'
import {
  GROUP_NODE_HEIGHT,
  layoutRelationsGraph,
  NODE_HEIGHT,
  NODE_WIDTH,
} from '~/components/projects/sections/interop/token-relations/layout'
import type { TokenGraphTileGraph } from '~/server/features/tokens/buildTokenGraphTiles'

const VIEW_HEIGHT = 132
const DOT = 7
const GROUP_DOT = 11

/**
 * A card-sized read of a token's structure: dots for deployments, lines for
 * what backs what, laid out by the very same function as the full diagram so
 * the two never disagree about shape. Static on purpose — panning, zooming and
 * detail belong to the full view a click away.
 */
export function TokenGraphTileDiagram({
  graph,
}: {
  graph: TokenGraphTileGraph
}) {
  const layout = useMemo(() => {
    // Deployments nothing connects to are left out of the card. On a token like
    // USDC they are 43 of 68 nodes and would squash the structure into a corner
    // — and the caption underneath already gives the full totals.
    const unconnected = new Set(graph.unconnectedNodeIds)
    const connected = graph.nodes.filter((node) => !unconnected.has(node.id))
    // The layout wants the full node shape; a tile only knows chain counts.
    const nodes = connected.map((node) => ({
      id: node.id,
      bridges: [],
      // Cards have no per-deployment volume, so ordering falls back to node id.
      volume: null,
      deployments: node.chains.map((chain) => ({
        chain,
        chainName: chain,
        iconUrl: undefined,
        address: '',
        symbol: '',
        explorerUrl: undefined,
        volume: null,
      })),
    }))
    const edges = graph.edges.map((edge) => ({ ...edge, bridges: [] }))
    return layoutRelationsGraph(nodes, edges, [])
  }, [graph])

  if (layout.width === 0 || layout.height === 0) return null

  const centres = new Map(
    [...layout.boxes].map(([id, box]) => [
      id,
      { x: box.x + box.width / 2, y: box.y + box.height / 2 },
    ]),
  )
  // Pad by half a node so the outermost dots are not clipped by the viewBox.
  const pad = { x: NODE_WIDTH / 2, y: GROUP_NODE_HEIGHT / 2 }

  return (
    <svg
      viewBox={`${-pad.x} ${-pad.y} ${layout.width + pad.x * 2} ${layout.height + pad.y * 2}`}
      height={VIEW_HEIGHT}
      width="100%"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="How this token's deployments back one another"
    >
      {graph.edges.map((edge) => {
        const from = centres.get(edge.from)
        const to = centres.get(edge.to)
        if (!from || !to) return null
        return (
          <line
            key={`${edge.from}->${edge.to}-${edge.kind}`}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            className="stroke-primary"
            strokeOpacity={0.4}
            strokeWidth={NODE_HEIGHT / 16}
            strokeDasharray={edge.kind === 'related' ? '10 8' : undefined}
          />
        )
      })}
      {graph.nodes.map((node) => {
        const centre = centres.get(node.id)
        if (!centre) return null
        const isGroup = node.chains.length > 1
        return (
          <circle
            key={node.id}
            cx={centre.x}
            cy={centre.y}
            r={(isGroup ? GROUP_DOT : DOT) * 2.2}
            className="fill-brand stroke-brand"
            fillOpacity={isGroup ? 0.9 : 0.55}
            strokeWidth={NODE_HEIGHT / 16}
          />
        )
      })}
    </svg>
  )
}

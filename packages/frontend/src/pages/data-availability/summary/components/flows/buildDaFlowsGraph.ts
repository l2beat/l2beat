import type {
  FlowsGraphData,
  FlowsGraphNode,
} from '~/pages/interop/components/flows/graph/types'
import type { DaFlowsProject } from '~/server/features/data-availability/flows/getDaFlowsProjects'

export const OTHERS_ID = 'others'
const OTHERS_COLOR = '#8A8F9C'

export interface DaFlowsPoster {
  id: string
  name: string
  iconUrl: string | undefined
  href: string | undefined
  posted: number
  share: number
}

export interface DaFlowsGraph {
  /** The DA layer first, then the posters shown on the ring */
  nodes: FlowsGraphNode[]
  data: FlowsGraphData
  /** Every poster, largest first. Not limited to the ones on the ring */
  posters: DaFlowsPoster[]
  totalPosted: number
}

/**
 * Turns bytes posted per project into a hub graph: the DA layer in the
 * middle, the largest posters around it, each sending its bytes inwards.
 * The ring holds `maxNodes` bubbles, so posters that do not fit are summed
 * into a single "Others" bubble rather than dropped — the total stays whole.
 */
export function buildDaFlowsGraph(
  daLayer: DaFlowsProject,
  projects: DaFlowsProject[],
  posted: Record<string, number>,
  maxNodes: number,
): DaFlowsGraph {
  const known = new Map(projects.map((p) => [p.id, p]))
  const totalPosted = Object.values(posted).reduce((sum, v) => sum + v, 0)

  const posters: DaFlowsPoster[] = Object.entries(posted)
    .filter(([, value]) => value > 0)
    .map(([id, value]) => {
      const project = known.get(id)
      return {
        id,
        name: project?.name ?? id,
        iconUrl: project?.iconUrl,
        href: project?.href,
        posted: value,
        share: totalPosted > 0 ? value / totalPosted : 0,
      }
    })
    .sort((a, b) => b.posted - a.posted)

  // Only projects we can name and draw get a bubble of their own
  const drawable = posters.filter((p) => known.has(p.id))
  const onRing =
    drawable.length === posters.length && posters.length <= maxNodes
      ? drawable
      : drawable.slice(0, maxNodes - 1)
  const onRingIds = new Set(onRing.map((p) => p.id))
  const rest = posters.filter((p) => !onRingIds.has(p.id))
  const restPosted = rest.reduce((sum, p) => sum + p.posted, 0)

  const ring: { node: FlowsGraphNode; posted: number }[] = onRing.map((p) => {
    const project = known.get(p.id)
    return {
      node: {
        id: p.id,
        name: p.name,
        iconUrl: project?.iconUrl ?? '',
        color: project?.color ?? OTHERS_COLOR,
      },
      posted: p.posted,
    }
  })
  if (rest.length > 0) {
    ring.push({
      node: {
        id: OTHERS_ID,
        name: 'Others',
        iconUrl: getCountIcon(rest.length),
        color: OTHERS_COLOR,
      },
      posted: restPosted,
    })
  }

  return {
    nodes: [
      {
        id: daLayer.id,
        name: daLayer.name,
        iconUrl: daLayer.iconUrl,
        color: daLayer.color,
      },
      ...ring.map((r) => r.node),
    ],
    data: {
      flows: ring.map((r) => ({
        srcChain: r.node.id,
        dstChain: daLayer.id,
        volume: r.posted,
      })),
      chainData: [
        { chainId: daLayer.id, totalVolume: totalPosted, netFlow: totalPosted },
        ...ring.map((r) => ({
          chainId: r.node.id,
          totalVolume: r.posted,
          netFlow: -r.posted,
        })),
      ],
    },
    posters,
    totalPosted,
  }
}

/** The bubble draws an image, so the count is handed over as one */
function getCountIcon(count: number): string {
  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">' +
    `<text x="16" y="17" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif" font-size="13" font-weight="700" fill="${OTHERS_COLOR}">+${count}</text>` +
    '</svg>'
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

import {
  forceCenter,
  forceLink,
  forceManyBody,
  forceSimulation,
  type SimulationNodeDatum,
} from 'd3-force'
import { useEffect, useState } from 'react'
import { cn } from '../../../../utils/cn'
import type { Node } from '../store/State'
import { useStore } from '../store/store'
import { centerLocationsInViewport } from '../store/utils/centerLocationsInViewport'
import type { NodeLocations } from '../store/utils/storage'
import { ControlButton } from './ControlButton'
import { IconControlCluster } from './icons/IconControlCluster'

// d3 assumes each node is a single point (no width and height),
// so we scale the coordinates of the simulation to move the nodes
// further apart and not overlap
const SIM_SCALE = 10

interface SimulationNode extends SimulationNodeDatum {
  id: string
  x: number
  y: number
  node: Node
}

export function ClusterLayoutButton({ className }: { className?: string }) {
  const nodes = useStore((state) => state.nodes)
  const hiddenNodes = useStore((state) => state.hidden)
  const selected = useStore((state) => state.selected)
  const visibleNodes = nodes.filter((node) => !hiddenNodes.includes(node.id))
  const simulationNodes =
    selected.length === 0
      ? visibleNodes
      : visibleNodes.filter((node) => selected.includes(node.id))

  const layout = useStore((state) => state.layout)
  const [updatingLayout, setUpdatingLayout] = useState<boolean>(false)

  const draw = () => {
    if (!updatingLayout) return

    const { left, top } = getAnchorPoints(
      simulationNodes,
      selected.length === 0,
    )

    // NaN tells d3 to assign its deterministic phyllotaxis seed. Seeding
    // from current positions makes repeated presses non-idempotent:
    // disconnected components repel each other further on every run.
    const simNodes: SimulationNode[] = simulationNodes.map((node) => ({
      id: node.id,
      x: Number.NaN,
      y: Number.NaN,
      node,
    }))

    const topLevelByAddress = new Map<string, string>()
    for (const node of simulationNodes) {
      registerAddresses(node.id, node, topLevelByAddress)
    }

    const links = simulationNodes
      .flatMap((node) =>
        node.fields.map((field) => ({
          source: node.id,
          target: topLevelByAddress.get(field.target) ?? field.target,
        })),
      )
      .filter((l) => simNodes.some((sn) => sn.id === l.target))

    const simulation = forceSimulation(simNodes)
      .force(
        'link',
        forceLink(links).id((d) => (d as SimulationNode).id),
      )
      .force('charge', forceManyBody())
      .force('center', forceCenter(0, 0))
      .on('end', ended)
      .tick(300) // NOTE(radomski): Manually step the simulation by 300 steps, otherwise by default only a single step is done per animation frame

    function ended() {
      const nodeLocations: NodeLocations = {}
      const { minY, minX } = simNodes.reduce(
        (a, b) => ({
          minY: Math.min(a.minY, b.y),
          minX: Math.min(a.minX, b.x),
        }),
        { minY: Number.POSITIVE_INFINITY, minX: Number.POSITIVE_INFINITY },
      )

      simNodes.forEach((simNode) => {
        nodeLocations[simNode.id] = {
          x: (simNode.x - minX) * SIM_SCALE + left,
          y: (simNode.y - minY) * SIM_SCALE + top,
        }
      })
      if (selected.length === 0) {
        const { transform, viewportContainer } = useStore.getState()
        layout(
          centerLocationsInViewport(
            nodeLocations,
            simulationNodes,
            transform,
            viewportContainer,
          ),
        )
      } else {
        layout(nodeLocations)
      }
      simulation.stop()
      setUpdatingLayout(false)
    }
  }

  useEffect(() => {
    draw()
  }, [updatingLayout])

  return (
    <ControlButton
      disabled={updatingLayout}
      onClick={() => setUpdatingLayout(true)}
      className={cn('px-3 py-2.5', className)}
    >
      <span className="flex items-center justify-center gap-2 text-center text-coffee-100">
        <IconControlCluster />
      </span>
    </ControlButton>
  )
}

function registerAddresses(
  topLevelId: string,
  node: Node,
  byAddress: Map<string, string>,
): void {
  byAddress.set(node.id, topLevelId)
  for (const subnode of node.subnodes) {
    registerAddresses(topLevelId, subnode, byAddress)
  }
}

function getAnchorPoints(
  nodes: readonly Node[],
  freshLayout: boolean,
): { top: number; left: number } {
  if (freshLayout) {
    return { top: 0, left: 0 }
  }

  const top = nodes
    .map((node) => node.box.y)
    .reduce((a, b) => Math.min(a, b), Number.POSITIVE_INFINITY)
  const left = nodes
    .map((node) => node.box.x)
    .reduce((a, b) => Math.min(a, b), Number.POSITIVE_INFINITY)

  return { top, left }
}

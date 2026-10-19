import { cn } from '../../../../utils/cn'
import { useStore } from '../store/store'
import { centerLocationsInViewport } from '../store/utils/centerLocationsInViewport'
import { clusterLayout } from '../store/utils/clusterLayout'
import { getGraphProjection } from '../store/utils/graphProjection'
import { containerBoxes } from '../store/utils/renderGraph'
import { ControlButton } from './ControlButton'
import { IconControlCluster } from './icons/IconControlCluster'

export function ClusterLayoutButton({ className }: { className?: string }) {
  const nodes = useStore((state) => state.nodes)
  const layout = useStore((state) => state.layout)
  const selected = useStore((state) => state.selected)
  const considerAllNodes = selected.length === 0
  const footprints = containerBoxes(nodes)
  const projection = getGraphProjection(nodes)
  const visibleNodes = nodes
    .filter(
      (node) =>
        !projection.hiddenNodeIds.has(node.id) &&
        (considerAllNodes || selected.includes(node.id)),
    )
    .map((node) => {
      const box = footprints.get(node.id)
      return box ? { ...node, box } : node
    })

  return (
    <ControlButton
      onClick={() => {
        let locations = clusterLayout(
          visibleNodes,
          considerAllNodes,
          projection.visibleEdges,
        )
        if (considerAllNodes) {
          const { transform, viewportContainer } = useStore.getState()
          locations = centerLocationsInViewport(
            locations,
            visibleNodes,
            transform,
            viewportContainer,
          )
        }
        layout(locations)
      }}
      className={cn('px-3 py-2.5', className)}
    >
      <span className="flex items-center justify-center gap-2 text-center text-coffee-100">
        <IconControlCluster />
      </span>
    </ControlButton>
  )
}

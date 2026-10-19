import { useStore } from '../../store/store'
import { centerLocationsInViewport } from '../../store/utils/centerLocationsInViewport'
import { clusterLayout } from '../../store/utils/clusterLayout'
import { getGraphProjection } from '../../store/utils/graphProjection'
import { containerBoxes } from '../../store/utils/renderGraph'
import { IconControlCluster } from '../icons/IconControlCluster'
import { ToolbarButton } from '../ToolbarButton'

export function ClusterLayoutButton() {
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
    <ToolbarButton
      label="Cluster layout"
      description="Arranges the selected nodes, or every visible node when nothing is selected."
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
    >
      <IconControlCluster />
    </ToolbarButton>
  )
}

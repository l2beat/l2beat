import type { Node } from '../../store/State'
import { useStore } from '../../store/store'
import { centerLocationsInViewport } from '../../store/utils/centerLocationsInViewport'
import { clusterLayout } from '../../store/utils/clusterLayout'
import {
  type GraphEdge,
  getGraphProjection,
} from '../../store/utils/graphProjection'
import { containerBoxes } from '../../store/utils/renderGraph'
import { stackAutoLayout } from '../../store/utils/stackLayout'
import type { NodeLocations } from '../../store/utils/storage'
import { IconControlCluster } from '../icons/IconControlCluster'
import { IconControlStack } from '../icons/IconControlStack'
import { ToolbarMenu } from '../ToolbarMenu'

type AutoLayout = (
  nodes: readonly Node[],
  freshLayout: boolean,
  visibleEdges: readonly GraphEdge[],
) => NodeLocations

export function AutoLayoutMenu() {
  return (
    <ToolbarMenu
      label="Layout"
      description="Arranges the selected nodes, or every visible node when nothing is selected."
      sections={[
        [
          {
            label: 'Stack',
            icon: <IconControlStack />,
            onSelect: () => applyAutoLayout(stackAutoLayout),
          },
          {
            label: 'Cluster',
            icon: <IconControlCluster />,
            onSelect: () => applyAutoLayout(clusterLayout),
          },
        ],
      ]}
    />
  )
}

function applyAutoLayout(autoLayout: AutoLayout) {
  const state = useStore.getState()
  const freshLayout = state.selected.length === 0
  const selected = new Set(state.selected)
  const projection = getGraphProjection(state.nodes)
  const footprints = containerBoxes(state.nodes)
  const nodes = state.nodes
    .filter(
      (node) =>
        !projection.hiddenNodeIds.has(node.id) &&
        (freshLayout || selected.has(node.id)),
    )
    .map((node) => {
      const box = footprints.get(node.id)
      return box ? { ...node, box } : node
    })

  const locations = autoLayout(nodes, freshLayout, projection.visibleEdges)
  if (freshLayout) {
    state.layout(
      centerLocationsInViewport(
        locations,
        nodes,
        state.transform,
        state.viewportContainer,
      ),
    )
  } else {
    state.layout(locations)
  }
}

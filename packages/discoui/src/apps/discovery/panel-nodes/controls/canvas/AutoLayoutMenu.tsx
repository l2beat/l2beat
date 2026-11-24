import type { Node } from '../../store/State'
import { useStore } from '../../store/store'
import { centerLocationsInViewport } from '../../store/utils/centerLocationsInViewport'
import { clusterLayout } from '../../store/utils/clusterLayout'
import { flowLayout } from '../../store/utils/flowLayout'
import {
  type GraphEdge,
  getGraphProjection,
} from '../../store/utils/graphProjection'
import { perimeterLayout } from '../../store/utils/perimeterLayout'
import { containerBoxes } from '../../store/utils/renderGraph'
import { countCriticalLeaves } from '../../store/utils/securityPerimeter'
import { stackAutoLayout } from '../../store/utils/stackLayout'
import type { NodeLocations } from '../../store/utils/storage'
import { IconControlCluster } from '../icons/IconControlCluster'
import { IconControlFlow } from '../icons/IconControlFlow'
import { IconControlPerimeter } from '../icons/IconControlPerimeter'
import { IconControlStack } from '../icons/IconControlStack'
import { ToolbarMenu } from '../ToolbarMenu'

type AutoLayout = (
  nodes: readonly Node[],
  freshLayout: boolean,
  visibleEdges: readonly GraphEdge[],
  hidden?: ReadonlySet<string>,
) => NodeLocations

export function AutoLayoutMenu() {
  const nodes = useStore((state) => state.nodes)
  const projection = getGraphProjection(nodes)
  const criticalCount = countCriticalLeaves(nodes, projection.hiddenNodeIds)

  return (
    <ToolbarMenu
      label="Layout"
      icon={<IconControlFlow />}
      description="Arranges the selected nodes, or every visible node when nothing is selected."
      sections={[
        [
          {
            label: 'Flow',
            icon: <IconControlFlow />,
            onSelect: () => applyAutoLayout(flowLayout),
          },
          {
            label: 'Perimeter',
            icon: <IconControlPerimeter />,
            count: criticalCount > 0 ? criticalCount : undefined,
            disabled: criticalCount === 0,
            onSelect: () => {
              useStore
                .getState()
                .setPreferences({ showSecurityPerimeter: true })
              applyAutoLayout(perimeterLayout)
            },
          },
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

  const locations = autoLayout(
    nodes,
    freshLayout,
    projection.visibleEdges,
    projection.hiddenNodeIds,
  )
  if (freshLayout && autoLayout === perimeterLayout) {
    state.layout(locations, { focusPerimeter: true })
  } else if (freshLayout) {
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

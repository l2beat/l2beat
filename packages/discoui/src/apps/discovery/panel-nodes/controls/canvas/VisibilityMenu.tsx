import { useStore } from '../../store/store'
import {
  getGraphProjection,
  isHideable,
} from '../../store/utils/graphProjection'
import { IconControlEye } from '../icons/IconControlEye'
import { IconControlEyeOff } from '../icons/IconControlEyeOff'
import { ToolbarMenu } from '../ToolbarMenu'

export function VisibilityMenu() {
  const nodes = useStore((state) => state.nodes)
  const showHidden = useStore((state) => state.showHidden)
  const hideUnreachable = useStore((state) => state.hideUnreachable)
  const projection = getGraphProjection(nodes)

  const visibleUnreachableCount = projection.leafNodes.filter(
    (node) =>
      !node.isReachable &&
      !projection.hiddenNodeIds.has(node.id) &&
      isHideable(projection, node),
  ).length

  return (
    <ToolbarMenu
      label="Visibility"
      description="Hide or show nodes and fields across the whole graph."
      sections={[
        [
          {
            label: 'Show all hidden fields',
            icon: <IconControlEye />,
            count: projection.hiddenFieldCount,
            disabled: projection.hiddenFieldCount === 0,
            onSelect: showHidden,
          },
          {
            label: 'Hide unreachable nodes',
            icon: <IconControlEyeOff />,
            count: visibleUnreachableCount,
            disabled: visibleUnreachableCount === 0,
            onSelect: hideUnreachable,
          },
        ],
      ]}
    />
  )
}

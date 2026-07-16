import { IconEyeClosed } from '../../../../icons/IconEyeClosed'
import { useStore } from '../store/store'
import { getGraphProjection } from '../store/utils/graphProjection'
import { ControlDropdownButton } from './ControlDropdownButton'

export function HideNodesButton({ className }: { className?: string }) {
  const nodes = useStore((state) => state.nodes)
  const hideUnreachable = useStore((state) => state.hideUnreachable)
  const projection = getGraphProjection(nodes)

  const visibleUnreachableCount = projection.leafNodes.filter(
    (node) => !node.isReachable && !projection.hiddenNodeIdSet.has(node.id),
  ).length

  return (
    <ControlDropdownButton
      label="Hide"
      icon={<IconEyeClosed />}
      disabled={visibleUnreachableCount === 0}
      className={className}
      options={[
        {
          label: 'Unreachable',
          count: visibleUnreachableCount,
          onSelect: hideUnreachable,
          disabled: visibleUnreachableCount === 0,
          icon: <IconEyeClosed />,
        },
      ]}
    />
  )
}

import { IconEyeClosed } from '../../../../icons/IconEyeClosed'
import { useStore } from '../store/store'
import { getHiddenNodeIds, getLeafNodes } from '../store/utils/nodeVisibility'
import { ControlDropdownButton } from './ControlDropdownButton'

export function HideNodesButton({ className }: { className?: string }) {
  const nodes = useStore((state) => state.nodes)
  const hideUnreachable = useStore((state) => state.hideUnreachable)
  const hiddenNodes = new Set(getHiddenNodeIds(nodes))

  const visibleUnreachableCount = getLeafNodes(nodes).filter(
    (node) => !node.isReachable && !hiddenNodes.has(node.id),
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

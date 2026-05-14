import { IconEyeClosed } from '../../../../icons/IconEyeClosed'
import { useStore } from '../store/store'
import { ControlDropdownButton } from './ControlDropdownButton'

export function HideNodesButton({ className }: { className?: string }) {
  const nodes = useStore((state) => state.nodes)
  const hiddenNodes = useStore((state) => state.hidden)
  const hideUnreachable = useStore((state) => state.hideUnreachable)

  const visibleUnreachableCount = nodes.filter(
    (node) => !node.isReachable && !hiddenNodes.includes(node.id),
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

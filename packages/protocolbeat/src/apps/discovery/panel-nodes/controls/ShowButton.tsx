import { useStore } from '../store/store'
import { ControlDropdownButton } from './ControlDropdownButton'
import { IconControlEye } from './icons/IconControlEye'

export function ShowButton({ className }: { className?: string }) {
  const hiddenCount = useStore((state) => state.hidden.length)
  const nodes = useStore((state) => state.nodes)
  const hiddenNodes = useStore((state) => state.hidden)
  const showHidden = useStore((state) => state.showHidden)
  const showUnreachable = useStore((state) => state.showUnreachable)

  const hiddenUnreachableCount = nodes.filter(
    (node) =>
      node.addressType !== 'Unknown' &&
      !node.isReachable &&
      hiddenNodes.includes(node.id),
  ).length

  return (
    <ControlDropdownButton
      label="Show"
      icon={<IconControlEye />}
      disabled={hiddenCount === 0 && hiddenUnreachableCount === 0}
      className={className}
      options={[
        {
          label: 'All',
          count: hiddenCount,
          onSelect: showHidden,
          disabled: hiddenCount === 0,
        },
        {
          label: 'Unreachable',
          count: hiddenUnreachableCount,
          onSelect: showUnreachable,
          disabled: hiddenUnreachableCount === 0,
          icon: <IconControlEye />,
        },
      ]}
    />
  )
}

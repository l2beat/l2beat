import { IconEyeClosed } from '../../../../icons/IconEyeClosed'
import { useStore } from '../store/store'
import { ControlDropdownButton } from './ControlDropdownButton'

export function HideNodesButton({ className }: { className?: string }) {
  const nodes = useStore((state) => state.nodes)
  const hiddenNodes = useStore((state) => state.hidden)
  const hideUnknowns = useStore((state) => state.hideUnknowns)
  const hideUnreachable = useStore((state) => state.hideUnreachable)

  const visibleUnknownsCount = nodes.filter(
    (node) => node.addressType === 'Unknown' && !hiddenNodes.includes(node.id),
  ).length
  const visibleUnreachableCount = nodes.filter(
    (node) =>
      node.addressType !== 'Unknown' &&
      !node.isReachable &&
      !hiddenNodes.includes(node.id),
  ).length

  return (
    <ControlDropdownButton
      label="Hide"
      icon={<IconEyeClosed />}
      disabled={visibleUnknownsCount === 0 && visibleUnreachableCount === 0}
      className={className}
      options={[
        {
          label: 'Unreachable',
          count: visibleUnreachableCount,
          onSelect: hideUnreachable,
          disabled: visibleUnreachableCount === 0,
          icon: <IconEyeClosed />,
        },
        {
          label: 'Unknowns',
          count: visibleUnknownsCount,
          onSelect: hideUnknowns,
          disabled: visibleUnknownsCount === 0,
          icon: <IconEyeClosed />,
        },
      ]}
    />
  )
}

import { useStore } from '../store/store'
import { getGraphProjection } from '../store/utils/graphProjection'
import { ControlDropdownButton } from './ControlDropdownButton'
import { IconControlEye } from './icons/IconControlEye'

export function ShowButton({ className }: { className?: string }) {
  const nodes = useStore((state) => state.nodes)
  const showHidden = useStore((state) => state.showHidden)
  const hiddenCount = getGraphProjection(nodes).hiddenNodeIds.length

  return (
    <ControlDropdownButton
      label="Show"
      icon={<IconControlEye />}
      disabled={hiddenCount === 0}
      className={className}
      options={[
        {
          label: 'All',
          count: hiddenCount,
          onSelect: showHidden,
          disabled: hiddenCount === 0,
        },
      ]}
    />
  )
}

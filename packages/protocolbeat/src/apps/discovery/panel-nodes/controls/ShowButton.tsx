import { useStore } from '../store/store'
import { getGraphProjection } from '../store/utils/graphProjection'
import { ControlDropdownButton } from './ControlDropdownButton'
import { IconControlEye } from './icons/IconControlEye'

export function ShowButton({ className }: { className?: string }) {
  const nodes = useStore((state) => state.nodes)
  const showHidden = useStore((state) => state.showHidden)
  const hiddenFieldCount = getGraphProjection(nodes).hiddenFieldCount

  return (
    <ControlDropdownButton
      label="Show"
      icon={<IconControlEye />}
      disabled={hiddenFieldCount === 0}
      className={className}
      options={[
        {
          label: 'All',
          count: hiddenFieldCount,
          onSelect: showHidden,
          disabled: hiddenFieldCount === 0,
        },
      ]}
    />
  )
}

import { useStore } from '../../store/store'
import { ControlGroup } from '../ControlGroup'
import {
  IconAlignBottom,
  IconAlignLeft,
  IconAlignRight,
  IconAlignTop,
  IconDistributeHorizontal,
  IconDistributeVertical,
} from '../icons/AlignIcons'
import { ToolbarButton } from '../ToolbarButton'

// Alignment needs at least two nodes; distribution needs a node to respace
// between the two outermost ones.
const MIN_NODES_TO_ALIGN = 2
const MIN_NODES_TO_DISTRIBUTE = 3

export function AlignControls() {
  const selectedCount = useStore((state) => state.selected.length)
  const alignSelected = useStore((state) => state.alignSelected)
  const distributeSelected = useStore((state) => state.distributeSelected)

  if (selectedCount < MIN_NODES_TO_ALIGN) {
    return null
  }

  const canDistribute = selectedCount >= MIN_NODES_TO_DISTRIBUTE
  const buttons = [
    {
      title: 'Align left',
      icon: <IconAlignLeft />,
      onClick: () => alignSelected('left'),
    },
    {
      title: 'Align right',
      icon: <IconAlignRight />,
      onClick: () => alignSelected('right'),
    },
    {
      title: 'Align top',
      icon: <IconAlignTop />,
      onClick: () => alignSelected('top'),
    },
    {
      title: 'Align bottom',
      icon: <IconAlignBottom />,
      onClick: () => alignSelected('bottom'),
    },
    {
      title: 'Distribute horizontally',
      icon: <IconDistributeHorizontal />,
      onClick: () => distributeSelected('horizontal'),
      disabled: !canDistribute,
    },
    {
      title: 'Distribute vertically',
      icon: <IconDistributeVertical />,
      onClick: () => distributeSelected('vertical'),
      disabled: !canDistribute,
    },
  ]

  return (
    <ControlGroup>
      {buttons.map((button) => (
        <ToolbarButton
          key={button.title}
          label={button.title}
          disabled={button.disabled}
          onClick={button.onClick}
        >
          {button.icon}
        </ToolbarButton>
      ))}
    </ControlGroup>
  )
}

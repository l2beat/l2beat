import { useStore } from '../../store/store'
import {
  IconAlignBottom,
  IconAlignLeft,
  IconAlignRight,
  IconAlignTop,
  IconDistributeHorizontal,
  IconDistributeVertical,
} from '../icons/AlignIcons'
import { ToolbarMenu } from '../ToolbarMenu'

// Alignment needs at least two nodes; distribution needs a node to respace
// between the two outermost ones.
const MIN_NODES_TO_ALIGN = 2
const MIN_NODES_TO_DISTRIBUTE = 3

export function AlignMenu() {
  const selectedCount = useStore((state) => state.selected.length)
  const alignSelected = useStore((state) => state.alignSelected)
  const distributeSelected = useStore((state) => state.distributeSelected)

  const cannotDistribute = selectedCount < MIN_NODES_TO_DISTRIBUTE

  return (
    <ToolbarMenu
      label="Align"
      description="Line up or evenly space the selected nodes."
      disabled={selectedCount < MIN_NODES_TO_ALIGN}
      sections={[
        [
          {
            label: 'Align left',
            icon: <IconAlignLeft />,
            onSelect: () => alignSelected('left'),
          },
          {
            label: 'Align right',
            icon: <IconAlignRight />,
            onSelect: () => alignSelected('right'),
          },
          {
            label: 'Align top',
            icon: <IconAlignTop />,
            onSelect: () => alignSelected('top'),
          },
          {
            label: 'Align bottom',
            icon: <IconAlignBottom />,
            onSelect: () => alignSelected('bottom'),
          },
        ],
        [
          {
            label: 'Distribute horizontally',
            icon: <IconDistributeHorizontal />,
            disabled: cannotDistribute,
            onSelect: () => distributeSelected('horizontal'),
          },
          {
            label: 'Distribute vertically',
            icon: <IconDistributeVertical />,
            disabled: cannotDistribute,
            onSelect: () => distributeSelected('vertical'),
          },
        ],
      ]}
    />
  )
}

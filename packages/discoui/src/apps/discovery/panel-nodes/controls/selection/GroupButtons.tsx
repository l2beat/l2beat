import { useCommandShortcut } from '../../../keybindings/useCommandShortcut'
import { useStore } from '../../store/store'
import { IconControlGroup } from '../icons/IconControlGroup'
import { IconControlUngroup } from '../icons/IconControlUngroup'
import { ToolbarButton } from '../ToolbarButton'

export function GroupButtons() {
  const canGroup = useStore((state) => state.selected.length > 1)
  const canUngroup = useStore((state) =>
    state.nodes.some(
      (node) => node.subnodes.length > 0 && state.selected.includes(node.id),
    ),
  )
  const groupSelected = useStore((state) => state.groupSelected)
  const ungroupSelected = useStore((state) => state.ungroupSelected)
  const groupShortcut = useCommandShortcut('nodes.group')
  const ungroupShortcut = useCommandShortcut('nodes.ungroup')

  return (
    <>
      <ToolbarButton
        label="Group"
        shortcut={groupShortcut}
        disabled={!canGroup}
        onClick={groupSelected}
      >
        <IconControlGroup />
      </ToolbarButton>
      <ToolbarButton
        label="Ungroup"
        shortcut={ungroupShortcut}
        disabled={!canUngroup}
        onClick={ungroupSelected}
      >
        <IconControlUngroup />
      </ToolbarButton>
    </>
  )
}

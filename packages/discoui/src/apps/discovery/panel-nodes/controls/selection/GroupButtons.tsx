import { useIsomorphicKeys } from '../../../hooks/useIsomorphicKeys'
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
  const { altKey } = useIsomorphicKeys()

  return (
    <>
      <ToolbarButton
        label="Group"
        shortcut={[altKey, 'G']}
        disabled={!canGroup}
        onClick={groupSelected}
      >
        <IconControlGroup />
      </ToolbarButton>
      <ToolbarButton
        label="Ungroup"
        shortcut={[altKey, 'Shift', 'G']}
        disabled={!canUngroup}
        onClick={ungroupSelected}
      >
        <IconControlUngroup />
      </ToolbarButton>
    </>
  )
}

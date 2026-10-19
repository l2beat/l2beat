import { IconGroup } from '../../../../../icons/IconGroup'
import { IconUngroup } from '../../../../../icons/IconUngroup'
import { useIsomorphicKeys } from '../../../hooks/useIsomorphicKeys'
import { useStore } from '../../store/store'
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
        <IconGroup />
      </ToolbarButton>
      <ToolbarButton
        label="Ungroup"
        shortcut={[altKey, 'Shift', 'G']}
        disabled={!canUngroup}
        onClick={ungroupSelected}
      >
        <IconUngroup />
      </ToolbarButton>
    </>
  )
}

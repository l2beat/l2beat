import { IconUndo } from '../../../../../icons/IconUndo'
import { useIsomorphicKeys } from '../../../hooks/useIsomorphicKeys'
import { useStore } from '../../store/store'
import { ToolbarButton } from '../ToolbarButton'

export function UndoButton() {
  const undo = useStore((state) => state.undo)
  const canUndo = useStore((state) => state.history.past.length > 0)
  const { ctrlKey } = useIsomorphicKeys()

  return (
    <ToolbarButton
      label="Undo"
      shortcut={[ctrlKey, 'Z']}
      disabled={!canUndo}
      onClick={undo}
    >
      <IconUndo />
    </ToolbarButton>
  )
}

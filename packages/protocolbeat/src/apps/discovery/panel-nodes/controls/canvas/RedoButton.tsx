import { IconUndo } from '../../../../../icons/IconUndo'
import { useIsomorphicKeys } from '../../../hooks/useIsomorphicKeys'
import { useStore } from '../../store/store'
import { ToolbarButton } from '../ToolbarButton'

export function RedoButton() {
  const redo = useStore((state) => state.redo)
  const canRedo = useStore((state) => state.history.future.length > 0)
  const { ctrlKey } = useIsomorphicKeys()

  return (
    <ToolbarButton
      label="Redo"
      shortcut={[ctrlKey, 'Shift', 'Z']}
      disabled={!canRedo}
      onClick={redo}
    >
      <IconUndo className="scale-x-[-1]" />
    </ToolbarButton>
  )
}

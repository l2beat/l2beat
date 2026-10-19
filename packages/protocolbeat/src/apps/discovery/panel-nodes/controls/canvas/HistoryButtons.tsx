import { IconUndo } from '../../../../../icons/IconUndo'
import { useIsomorphicKeys } from '../../../hooks/useIsomorphicKeys'
import { useStore } from '../../store/store'
import { ToolbarButton } from '../ToolbarButton'

export function HistoryButtons() {
  const undo = useStore((state) => state.undo)
  const redo = useStore((state) => state.redo)
  const canUndo = useStore((state) => state.history.past.length > 0)
  const canRedo = useStore((state) => state.history.future.length > 0)
  const { ctrlKey } = useIsomorphicKeys()

  return (
    <>
      <ToolbarButton
        label="Undo"
        shortcut={[ctrlKey, 'Z']}
        disabled={!canUndo}
        onClick={undo}
      >
        <IconUndo />
      </ToolbarButton>
      <ToolbarButton
        label="Redo"
        shortcut={[ctrlKey, 'Shift', 'Z']}
        disabled={!canRedo}
        onClick={redo}
      >
        <IconUndo className="scale-x-[-1]" />
      </ToolbarButton>
    </>
  )
}

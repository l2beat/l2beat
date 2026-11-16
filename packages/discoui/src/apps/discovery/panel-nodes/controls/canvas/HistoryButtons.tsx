import { useCommandShortcut } from '../../../keybindings/useCommandShortcut'
import { useStore } from '../../store/store'
import { IconControlUndo } from '../icons/IconControlUndo'
import { ToolbarButton } from '../ToolbarButton'

export function HistoryButtons() {
  const undo = useStore((state) => state.undo)
  const redo = useStore((state) => state.redo)
  const canUndo = useStore((state) => state.history.past.length > 0)
  const canRedo = useStore((state) => state.history.future.length > 0)
  const undoShortcut = useCommandShortcut('nodes.undo')
  const redoShortcut = useCommandShortcut('nodes.redo')

  return (
    <>
      <ToolbarButton
        label="Undo"
        shortcut={undoShortcut}
        disabled={!canUndo}
        onClick={undo}
      >
        <IconControlUndo />
      </ToolbarButton>
      <ToolbarButton
        label="Redo"
        shortcut={redoShortcut}
        disabled={!canRedo}
        onClick={redo}
      >
        <IconControlUndo className="scale-x-[-1]" />
      </ToolbarButton>
    </>
  )
}

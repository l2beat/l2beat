import { IconUndo } from '../../../../icons/IconUndo'
import { useStore } from '../store/store'
import { ControlButton } from './ControlButton'

export function UndoButton() {
  const undo = useStore((state) => state.undo)
  const past = useStore((state) => state.history.past)

  return (
    <ControlButton disabled={past.length === 0} onClick={undo}>
      <IconUndo />
    </ControlButton>
  )
}

import { IconUndo } from '../../../../icons/IconUndo'
import { useStore } from '../store/store'
import { ControlButton } from './ControlButton'

export function RedoButton() {
  const redo = useStore((state) => state.redo)
  const future = useStore((state) => state.history.future)

  return (
    <ControlButton disabled={future.length === 0} onClick={redo}>
      <IconUndo className="-scale-x-[1]" />
    </ControlButton>
  )
}

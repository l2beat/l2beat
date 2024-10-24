import { useStore } from '../store/store'
import { ControlButton } from './ControlButton'

export function HideButton() {
  const selectedIds = useStore((state) => state.selectedNodeIds)
  const setHiddenNodes = useStore((state) => state.setHiddenNodes)

  function hide() {
    setHiddenNodes((ids) =>
      ids.concat(selectedIds).filter((x, i, a) => a.indexOf(x) === i),
    )
  }

  return (
    <ControlButton disabled={selectedIds.length === 0} onClick={hide}>
      Hide
    </ControlButton>
  )
}

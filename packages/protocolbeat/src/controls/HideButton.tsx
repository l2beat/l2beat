import { useStore } from '../store/store'
import { ControlButton } from './ControlButton'

export function HideButton() {
  const selectionExists = useStore((state) => state.selected.length > 0)
  const hideSelected = useStore((state) => state.hideSelected)

  return (
    <ControlButton disabled={!selectionExists} onClick={hideSelected}>
      Hide
    </ControlButton>
  )
}

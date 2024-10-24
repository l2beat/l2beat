import { useStore } from '../store/store'
import { ControlButton } from './ControlButton'

export function ClearButton() {
  const updateNodes = useStore((state) => state.updateNodes)
  const setHiddenNodes = useStore((state) => state.setHiddenNodes)

  function clear() {
    updateNodes([])
    setHiddenNodes(() => [])
  }

  return <ControlButton onClick={clear}>Clear</ControlButton>
}

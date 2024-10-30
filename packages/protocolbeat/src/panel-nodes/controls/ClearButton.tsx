import { useStore } from '../store/store'
import { ControlButton } from './ControlButton'

export function ClearButton() {
  const clear = useStore((state) => state.clear)
  return <ControlButton onClick={clear}>Clear</ControlButton>
}

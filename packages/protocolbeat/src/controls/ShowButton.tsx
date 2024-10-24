import { useStore } from '../store/store'
import { ControlButton } from './ControlButton'

export function ShowButton() {
  const hiddenCount = useStore((state) => state.hiddenNodesIds.length)
  const setHiddenNodes = useStore((state) => state.setHiddenNodes)
  return (
    <ControlButton onClick={() => setHiddenNodes(() => [])}>
      Show ({hiddenCount})
    </ControlButton>
  )
}

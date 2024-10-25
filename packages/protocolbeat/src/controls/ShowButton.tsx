import { useStore } from '../store/store'
import { ControlButton } from './ControlButton'

export function ShowButton() {
  const hiddenCount = useStore((state) => state.hiddenNodesIds.length)
  const showHidden = useStore((state) => state.showHidden)
  return (
    <ControlButton disabled={hiddenCount === 0} onClick={showHidden}>
      Show ({hiddenCount})
    </ControlButton>
  )
}

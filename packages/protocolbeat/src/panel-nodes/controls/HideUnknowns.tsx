import { useStore } from '../store/store'
import { ControlButton } from './ControlButton'

export function HideUnknownsButton() {
  const nodes = useStore((state) => state.nodes)
  const hiddenNodes = useStore((state) => state.hidden)
  const anyUnknownsVisible = nodes.some(
    (node) => node.addressType === 'Unknown' && !hiddenNodes.includes(node.id),
  )

  const hideUnknowns = useStore((state) => state.hideUnknowns)

  return (
    <ControlButton
      disabled={!anyUnknownsVisible}
      onClick={hideUnknowns}
      className="p-1"
    >
      Hide Unknowns
    </ControlButton>
  )
}

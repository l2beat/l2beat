import { useStore } from '../store/store'
import { ControlButton } from './ControlButton'

export function HideUnreachableButton() {
  const nodes = useStore((state) => state.nodes)
  const knownNodes = nodes.filter((node) => node.addressType !== 'Unknown')
  const hiddenNodes = useStore((state) => state.hidden)
  const anyUnreachableVisible = knownNodes.some(
    (node) => !node.isReachable && !hiddenNodes.includes(node.id),
  )

  const hideUnreachable = useStore((state) => state.hideUnreachable)

  return (
    <ControlButton
      disabled={!anyUnreachableVisible}
      onClick={hideUnreachable}
      className="p-1"
    >
      Hide Unreachable
    </ControlButton>
  )
}

export function ShowUnreachableButton() {
  const nodes = useStore((state) => state.nodes)
  const knownNodes = nodes.filter((node) => node.addressType !== 'Unknown')
  const hiddenNodes = useStore((state) => state.hidden)
  const anyUnreachableHidden = knownNodes.some(
    (node) => !node.isReachable && hiddenNodes.includes(node.id),
  )

  const showUnreachable = useStore((state) => state.showUnreachable)

  return (
    <ControlButton
      disabled={!anyUnreachableHidden}
      onClick={showUnreachable}
      className="p-1"
    >
      Show Unreachable
    </ControlButton>
  )
}

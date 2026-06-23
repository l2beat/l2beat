import { IconGroup } from '../../../../icons/IconGroup'
import { IconUngroup } from '../../../../icons/IconUngroup'
import { useStore } from '../store/store'
import { ControlButton } from './ControlButton'

export function GroupControls() {
  const selected = useStore((state) => state.selected)
  const nodes = useStore((state) => state.nodes)
  const groupSelected = useStore((state) => state.groupSelected)
  const ungroupSelected = useStore((state) => state.ungroupSelected)

  const canGroup = selected.length > 1
  const selectedNode =
    selected.length === 1
      ? nodes.find((node) => node.id === selected[0])
      : undefined
  const canUngroup =
    selectedNode !== undefined && selectedNode.subnodes.length > 0

  return (
    <>
      {canGroup && (
        <ControlButton
          title="Group"
          aria-label="Group"
          onClick={() => groupSelected()}
          className="px-3 py-2.5"
        >
          <span className="flex items-center justify-center gap-2 text-center text-coffee-100">
            <IconGroup />
          </span>
        </ControlButton>
      )}
      {canUngroup && (
        <ControlButton
          title="Ungroup"
          aria-label="Ungroup"
          onClick={() => ungroupSelected()}
          className="px-3 py-2.5"
        >
          <span className="flex items-center justify-center gap-2 text-center text-coffee-100">
            <IconUngroup />
          </span>
        </ControlButton>
      )}
    </>
  )
}

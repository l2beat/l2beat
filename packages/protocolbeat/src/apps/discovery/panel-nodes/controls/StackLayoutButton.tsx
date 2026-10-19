import clsx from 'clsx'
import { useStore } from '../store/store'
import { centerLocationsInViewport } from '../store/utils/centerLocationsInViewport'
import { getGraphProjection } from '../store/utils/graphProjection'
import { containerBoxes } from '../store/utils/renderGraph'
import { stackAutoLayout } from '../store/utils/stackLayout'
import { ControlButton } from './ControlButton'
import { IconControlStack } from './icons/IconControlStack'

export function StackLayoutButton({ className }: { className?: string }) {
  const nodes = useStore((state) => state.nodes)
  const layout = useStore((state) => state.layout)
  const selected = useStore((state) => state.selected)
  const considerAllNodes = selected.length === 0
  const footprints = containerBoxes(nodes)
  const projection = getGraphProjection(nodes)
  const visibleNodes = nodes
    .filter(
      (node) =>
        !projection.hiddenNodeIds.has(node.id) &&
        (considerAllNodes || selected.includes(node.id)),
    )
    .map((node) => {
      const box = footprints.get(node.id)
      return box ? { ...node, box } : node
    })

  return (
    <ControlButton
      onClick={() => {
        let locations = stackAutoLayout(
          visibleNodes,
          considerAllNodes,
          projection.visibleEdges,
        )
        if (considerAllNodes) {
          const { transform, viewportContainer } = useStore.getState()
          locations = centerLocationsInViewport(
            locations,
            visibleNodes,
            transform,
            viewportContainer,
          )
        }
        layout(locations)
      }}
      className={clsx('px-3 py-2.5', className)}
    >
      <span className="flex items-center justify-center gap-2 text-center text-coffee-100">
        <IconControlStack />
      </span>
    </ControlButton>
  )
}

import clsx from 'clsx'
import { useStore } from '../store/store'
import { groupSimilarLayout } from '../store/utils/groupSimilar'
import { ControlButton } from './ControlButton'
import { IconControlCluster } from './icons/IconControlCluster'

export function GroupSimilarButton({ className }: { className?: string }) {
  const nodes = useStore((state) => state.nodes)
  const hiddenNodes = useStore((state) => state.hidden)
  const layout = useStore((state) => state.layout)

  const visibleNodes = nodes.filter((node) => !hiddenNodes.includes(node.id))

  return (
    <ControlButton
      onClick={() => layout(groupSimilarLayout(visibleNodes))}
      title="Group similar nodes into columns (largest group on the left)"
      aria-label="Group similar nodes into columns"
      className={clsx('gap-2 px-3 py-2.5', className)}
    >
      <span className="flex items-center justify-center gap-2 text-center text-coffee-100">
        <IconControlCluster />
        <span className="text-[11px] leading-none">Group</span>
      </span>
    </ControlButton>
  )
}

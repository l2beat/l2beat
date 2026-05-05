import clsx from 'clsx'
import { IconEyeClosed } from '../../../../icons/IconEyeClosed'
import { useStore } from '../store/store'
import { ControlButton } from './ControlButton'

export function HideUnknownsButton({ className }: { className?: string }) {
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
      className={clsx('px-3 py-2', className)}
    >
      <span className="flex w-full items-center justify-center gap-2 text-center">
        <span className="shrink-0 text-coffee-300">
          <IconEyeClosed />
        </span>
        <span className="font-medium leading-none">Hide unknowns</span>
      </span>
    </ControlButton>
  )
}

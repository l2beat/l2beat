import clsx from 'clsx'
import { IconEyeClosed } from '../../../../icons/IconEyeClosed'
import { useStore } from '../store/store'
import { ControlButton } from './ControlButton'
import { IconControlEye } from './icons/IconControlEye'

export function HideUnreachableButton({ className }: { className?: string }) {
  const nodes = useStore((state) => state.nodes)
  const hiddenNodes = useStore((state) => state.hidden)
  const anyUnreachableVisible = nodes.some(
    (node) => !node.isReachable && !hiddenNodes.includes(node.id),
  )

  const hideUnreachable = useStore((state) => state.hideUnreachable)

  return (
    <ControlButton
      disabled={!anyUnreachableVisible}
      onClick={hideUnreachable}
      className={clsx('px-3 py-2', className)}
    >
      <span className="flex w-full items-center justify-center gap-2 text-center">
        <span className="shrink-0 text-coffee-300">
          <IconEyeClosed />
        </span>
        <span className="font-medium leading-none">Hide unreachable</span>
      </span>
    </ControlButton>
  )
}

export function ShowUnreachableButton({ className }: { className?: string }) {
  const nodes = useStore((state) => state.nodes)
  const hiddenNodes = useStore((state) => state.hidden)
  const anyUnreachableHidden = nodes.some(
    (node) => !node.isReachable && hiddenNodes.includes(node.id),
  )

  const showUnreachable = useStore((state) => state.showUnreachable)

  return (
    <ControlButton
      disabled={!anyUnreachableHidden}
      onClick={showUnreachable}
      className={clsx('px-3 py-2', className)}
    >
      <span className="flex w-full items-center justify-center gap-2 text-center">
        <span className="shrink-0 text-coffee-300">
          <IconControlEye />
        </span>
        <span className="font-medium leading-none">Show unreachable</span>
      </span>
    </ControlButton>
  )
}

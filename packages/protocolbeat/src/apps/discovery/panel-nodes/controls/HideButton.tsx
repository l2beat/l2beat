import { IconEyeClosed } from '../../../../icons/IconEyeClosed'
import { cn } from '../../../../utils/cn'
import { useStore } from '../store/store'
import { ControlButton } from './ControlButton'

export function HideButton({ className }: { className?: string }) {
  const selectionExists = useStore((state) => state.selected.length > 0)
  const hideSelected = useStore((state) => state.hideSelected)

  return (
    <ControlButton
      disabled={!selectionExists}
      onClick={hideSelected}
      className={cn('px-3 py-2.5', className)}
    >
      <span className="flex items-center justify-center gap-2 text-center text-coffee-100">
        <IconEyeClosed />
      </span>
    </ControlButton>
  )
}

import { IconHand } from '../../../../icons/IconHand'
import { cn } from '../../../../utils/cn'
import { useStore } from '../store/store'
import { ControlButton } from './ControlButton'

export function HandToolButton({ className }: { className?: string }) {
  const active = useStore((state) => state.tool === 'hand')
  const setTool = useStore((state) => state.setTool)

  return (
    <ControlButton
      title="Hand tool (H): drag to move the view. Space + drag or middle mouse drag also pans."
      aria-label="Toggle hand tool"
      aria-pressed={active}
      onClick={() => setTool(active ? 'select' : 'hand')}
      className={cn(
        'px-3 py-2.5',
        active && 'border-autumn-300 bg-coffee-700',
        className,
      )}
    >
      <span className="flex items-center justify-center gap-2 text-center text-coffee-100">
        <IconHand />
      </span>
    </ControlButton>
  )
}

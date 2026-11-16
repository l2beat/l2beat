import { SECTION_ACTION_BUTTON_CLASS } from '~/components/core/actionButtonClassNames'
import { cn } from '~/utils/cn'

export function ExploreInteropButton({ className }: { className?: string }) {
  return (
    <a
      href="/interop/summary"
      className={cn(SECTION_ACTION_BUTTON_CLASS, 'md:mt-0', className)}
    >
      Explore Interop
    </a>
  )
}

import { SECTION_ACTION_BUTTON_CLASS } from '~/components/core/actionButtonClassNames'
import { cn } from '~/utils/cn'

export function TvsBreakdownButton({
  tvsBreakdownUrl,
  className,
}: {
  tvsBreakdownUrl: string
  className?: string
}) {
  return (
    <a
      href={tvsBreakdownUrl}
      className={cn(SECTION_ACTION_BUTTON_CLASS, 'md:mt-0', className)}
    >
      View TVS breakdown
    </a>
  )
}

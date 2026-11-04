import { ChevronIcon } from '~/icons/Chevron'
import { cn } from '~/utils/cn'

export function ViewDetailsLink({
  href,
  label = 'View details',
  className,
}: {
  href: string
  label?: string
  className?: string
}) {
  return (
    <a
      className={cn(
        'group flex w-max items-center gap-1 font-medium text-[13px] text-link leading-none',
        className,
      )}
      href={href}
    >
      <span className="underline-offset-2 group-hover:underline">{label}</span>
      <ChevronIcon className="-rotate-90 size-2.5 fill-current transition-transform group-hover:translate-x-0.5" />
    </a>
  )
}

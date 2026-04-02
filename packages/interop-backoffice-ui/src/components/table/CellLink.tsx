import { ArrowRightIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '~/utils/cn'

export function CellLink({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Link>) {
  return (
    <Link
      className={cn(
        'group inline-flex items-center gap-1 underline underline-offset-4 hover:text-primary',
        className,
      )}
      {...props}
    >
      <span>{children}</span>
      <ArrowRightIcon
        aria-hidden="true"
        className="size-3 shrink-0 transition-transform group-hover:translate-x-0.5"
      />
    </Link>
  )
}

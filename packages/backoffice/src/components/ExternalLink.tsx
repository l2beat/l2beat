import { ArrowUpRightIcon } from 'lucide-react'
import { cn } from '~/utils/cn'

export function ExternalLink({
  href,
  className,
  children,
  ...rest
}: React.ComponentProps<'a'>) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'group inline-flex items-center gap-1 text-blue-500 underline hover:text-blue-600',
        className,
      )}
      {...rest}
    >
      <span>{children}</span>
      <ArrowUpRightIcon aria-hidden="true" className="size-3 shrink-0" />
    </a>
  )
}

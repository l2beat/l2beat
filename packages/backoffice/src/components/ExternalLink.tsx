import { ArrowUpRightIcon } from 'lucide-react'
import { cn } from '~/utils/cn'

export function ExternalLink({
  href,
  className,
  children,
  showIcon = true,
  ...rest
}: React.ComponentProps<'a'> & {
  /** Turn off for links styled as icon buttons, which bring their own icon. */
  showIcon?: boolean
}) {
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
      {showIcon ? (
        <>
          <span>{children}</span>
          <ArrowUpRightIcon aria-hidden="true" className="size-3 shrink-0" />
        </>
      ) : (
        children
      )}
    </a>
  )
}

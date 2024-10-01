import { cn } from '~/utils/cn'

export interface NavSmallLinkGroupProps {
  children?: React.ReactNode
  className?: string
}

/**
 * Group of small nav links.
 */
export function NavSmallLinkGroup({
  children,
  className,
}: NavSmallLinkGroupProps) {
  return (
    <ul className={cn('ml-1 flex flex-col gap-2', className)}>{children}</ul>
  )
}

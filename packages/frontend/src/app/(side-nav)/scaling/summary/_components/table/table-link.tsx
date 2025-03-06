import { LinkWithOnHoverPrefetch } from '~/components/link/link-with-on-hover-prefetch'
import { cn } from '~/utils/cn'

export function TableLink({
  href,
  children,
  className,
}: {
  href: string | undefined
  children: React.ReactNode
  className?: string
}) {
  if (href) {
    return (
      <LinkWithOnHoverPrefetch
        className={cn(
          '-mx-3 block w-max rounded md:px-3 md:py-2',
          'md:hover:bg-pure-black/5 md:dark:hover:bg-pure-white/20',
          className,
        )}
        href={href}
      >
        {children}
      </LinkWithOnHoverPrefetch>
    )
  }
  return children
}

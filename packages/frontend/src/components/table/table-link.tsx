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
          'inline-flex h-[calc(100%_-_8px)] w-max items-center rounded transition-colors md:-mx-3 md:px-3',
          'md:hover:bg-pure-black/5 md:dark:hover:bg-pure-white/10',
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

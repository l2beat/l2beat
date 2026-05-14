import type { NavLink } from '~/components/nav/types'
import { usePathname } from '~/hooks/usePathname'
import { cn } from '~/utils/cn'
import { isLinkActive } from '~/utils/isLinkActive'

export function SecondaryLinksNav({
  links,
  className,
}: {
  links: NavLink[]
  className?: string
}) {
  const pathname = usePathname()

  return (
    <nav
      className={cn(
        'flex flex-wrap items-center gap-x-4 gap-y-2 border-divider border-t pt-6 pb-2',
        className,
      )}
      aria-label="Site links"
    >
      {links.map((link) => {
        const isInternalLink = link.href.startsWith('/')
        const active = isLinkActive({ href: link.href, pathname })
        return (
          <a
            key={link.title}
            href={link.href}
            target={isInternalLink ? undefined : '_blank'}
            rel={isInternalLink ? undefined : 'noreferrer noopener'}
            className={cn(
              'flex items-center gap-1 font-medium text-primary text-xs leading-none transition-colors hover:text-secondary',
              active && 'text-brand hover:text-brand',
            )}
          >
            <span>{link.title}</span>
            {link.accessory}
          </a>
        )
      })}
    </nav>
  )
}

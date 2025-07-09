import { usePathname } from '~/hooks/usePathname'
import { cn } from '~/utils/cn'

/**
 * Top nav link component, used in the top navbar.
 */
export function TopNavLink({
  href,
  children,
  large,
  title,
  withoutUnderline,
}: { href: string; large?: boolean; withoutUnderline?: boolean } & (
  | { title: string; children?: never }
  | { title?: never; children: React.ReactNode }
)) {
  const pathname = usePathname()
  return (
    <li className="group/top-nav-link h-full">
      <a
        className={cn(
          'flex h-full items-center font-medium',
          large
            ? 'pr-2 text-base group-last/top-nav-link:pr-0 md:pr-6 md:text-lg'
            : 'max-2xltext-sm pr-3 group-last/top-nav-link:pr-0',
          pathname.startsWith(href) && [
            'pt-0.5 text-brand',
            !withoutUnderline && 'border-current border-b-2',
          ],
        )}
        href={href}
        target={href.startsWith('http') ? '_blank' : undefined}
      >
        {children ?? title}
      </a>
    </li>
  )
}

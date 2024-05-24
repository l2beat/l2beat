import { type ActiveLinkProps, useActiveLink } from '~/utils/active-link'
import { cn } from '~/utils/cn'

export type NavSmallLinkProps = (
  | { title: string; children?: undefined }
  | { children: React.ReactNode; title?: undefined }
) &
  ActiveLinkProps

export function NavSmallLink({
  title,
  href,
  children,
  activeBehavior,
}: NavSmallLinkProps) {
  const active = useActiveLink({ href, activeBehavior })

  return (
    <a href={href} target={href.startsWith('http') ? '_blank' : undefined}>
      <li
        className={cn(
          'font-medium text-xs leading-none text-zinc-800 dark:text-white hover:text-zinc-500 dark:hover:text-gray-400 transition-colors ease-out duration-300',
          active &&
            'hover:text-pink-900 text-pink-900 dark:text-pink-200 dark:hover:text-pink-200',
        )}
      >
        {children ?? title}
      </li>
    </a>
  )
}

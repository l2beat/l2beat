import { usePathname } from '~/hooks/usePathname'
import { cn } from '~/utils/cn'
import { OverflowWrapper } from '../../core/OverflowWrapper'
import type { NavGroup } from '../types'

/**
 * Second navbar displayed under the main navbar on mobile.
 */
export function MobileNavTabs({ groups }: { groups: NavGroup[] }) {
  const pathname = usePathname()

  const currentGroup = groups
    .filter((g) => g.type === 'multiple')
    .find(
      (g) =>
        pathname.startsWith(`/${g.links[0]?.href.split('/')[1]}`) &&
        !g.disableMobileTabs,
    )
  if (!currentGroup) return null

  // Do not display the tabs if the current group is not found,
  // or the current group does not have a link that matche the current path.
  const display = currentGroup.links.some(({ href }) => href === pathname)
  if (!display) return null

  return (
    <OverflowWrapper className="bg-surface-primary">
      <div className="flex">
        {currentGroup.links
          .filter((link) => !link.disabled)
          .map((link) => {
            const isSelected = link.href === pathname
            return (
              <a
                ref={(node) => {
                  if (node && isSelected) {
                    node.scrollIntoView({
                      block: 'nearest',
                      inline: 'center',
                    })
                  }
                }}
                href={link.href}
                key={link.href}
                data-state={isSelected ? 'selected' : undefined}
                className={cn(
                  'flex h-10 w-full items-center justify-center whitespace-nowrap border-divider border-b bg-header-primary px-4 font-medium text-xs leading-none',
                  'data-[state=selected]:border-brand data-[state=selected]:text-brand',
                )}
              >
                {link.shortTitle ?? link.title}
              </a>
            )
          })}
      </div>
    </OverflowWrapper>
  )
}

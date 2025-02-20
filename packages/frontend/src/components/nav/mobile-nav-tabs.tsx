'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '~/utils/cn'
import { OverflowWrapper } from '../core/overflow-wrapper'
import type { NavGroup } from './types'

/**
 * Second navbar displayed under the main navbar on mobile.
 */
export function MobileNavTabs({ groups }: { groups: NavGroup[] }) {
  const pathname = usePathname()

  const currentGroup = groups
    .filter((g) => g.type === 'multiple')
    .find((g) => pathname.startsWith(`/${g.links[0]?.href.split('/')[1]}`))
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
              <Link
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
                  'flex h-10 w-full items-center justify-center whitespace-nowrap border-b border-divider bg-header-primary px-4 text-xs font-medium leading-none',
                  'data-[state=selected]:border-brand data-[state=selected]:text-brand',
                )}
              >
                {link.shortTitle ?? link.title}
              </Link>
            )
          })}
      </div>
    </OverflowWrapper>
  )
}

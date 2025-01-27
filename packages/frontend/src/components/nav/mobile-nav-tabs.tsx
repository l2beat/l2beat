'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { cn } from '~/utils/cn'
import { OverflowWrapper } from '../core/overflow-wrapper'
import { type NavGroup } from './types'

/**
 * Second navbar displayed under the main navbar on mobile.
 */
export function MobileNavTabs({ groups }: { groups: NavGroup[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    const tab = document.querySelector('[data-state=selected]')
    if (tab) {
      tab.scrollIntoView({
        inline: 'center',
      })
    }
  }, [])

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
      <div className="flex" ref={ref}>
        {currentGroup.links
          .filter((link) => !link.disabled)
          .map((link) => {
            const isSelected = link.href === pathname
            return (
              <Link
                href={link.href}
                key={link.href}
                data-state={isSelected ? 'selected' : undefined}
                className={cn(
                  'border-divider bg-header-primary flex h-10 w-full items-center justify-center whitespace-nowrap border-b px-4 text-xs font-medium leading-none',
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

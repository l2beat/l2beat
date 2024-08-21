'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '~/utils/cn'
import { OverflowWrapper } from '../overflow-wrapper'
import { type NavGroup } from './types'

/**
 * Second navbar displayed under the main navbar on mobile.
 */
export function MobileNavTabs({ groups }: { groups: NavGroup[] }) {
  const pathname = usePathname()
  const currentGroup = groups.find((g) =>
    pathname.startsWith(`/${g.links[0]?.href.split('/')[1]}`),
  )

  // Do not display the tabs if the current group is not found,
  // or the current group does not have a link that matche the current path.
  const display = currentGroup?.links.some(({ href }) => href === pathname)
  if (!display) return null

  return (
    <OverflowWrapper>
      <div className="mx-auto flex w-min items-center gap-2 px-4 py-2">
        {currentGroup?.links
          .filter((link) => !link.disabled)
          .map((link) => (
            <Link href={link.href} key={link.href}>
              <div
                className={cn(
                  'm-auto whitespace-nowrap rounded-[4px] border border-[#AB3BD2] px-4 py-[0.53125rem] text-xs font-semibold leading-none',
                  link.href === pathname &&
                    'border-0 bg-[linear-gradient(90deg,_#7E41CC_0%,_#FF46C0_100%)] px-[calc(1rem_+_1px)] py-[calc(0.53125rem_+_1px)] text-white',
                )}
              >
                {link.title}
              </div>
            </Link>
          ))}
      </div>
    </OverflowWrapper>
  )
}

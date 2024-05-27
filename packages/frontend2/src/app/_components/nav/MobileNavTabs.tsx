'use client'

import { usePathname } from 'next/navigation'
import { type NavGroup } from './types'
import { cn } from '~/utils/cn'

/**
 * Second navbar displayed under the main navbar on mobile.
 */
export function MobileNavTabs({ groups }: { groups: NavGroup[] }) {
  const pathname = usePathname()
  const currentGroup = groups.find((g) =>
    pathname.startsWith(`/${g.links[0]?.href.split('/')[1]}`),
  )

  return (
    currentGroup && (
      <div className="overflow-x-scroll w-full border-b border-gray-200 dark:border-gray-850 text-center scrollbar-hide">
        <div className="inline-flex flex-row gap-2 px-4 py-2 m-auto">
          {currentGroup.links
            .filter((link) => link.enabled)
            .map((link) => (
              <a href={link.href} key={link.href}>
                <div
                  className={cn(
                    'rounded-[4px] border border-[#AB3BD2] text-xs font-semibold px-4 py-[0.53125rem] whitespace-nowrap m-auto leading-none',
                    link.href === pathname &&
                      'bg-[linear-gradient(90deg,_#7E41CC_0%,_#FF46C0_100%)] text-white border-0 px-[calc(1rem_+_1px)] py-[calc(0.53125rem_+_1px)]',
                  )}
                >
                  {link.title}
                </div>
              </a>
            ))}
        </div>
      </div>
    )
  )
}

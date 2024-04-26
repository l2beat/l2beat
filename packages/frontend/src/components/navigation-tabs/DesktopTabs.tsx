import React from 'react'

import { cn } from '../../utils/cn'
import { NavigationPage } from '../../utils/getNavigationPages'
import { NewItemBadge } from '../badge/NewItemBadge'

export interface DesktopTabsProps {
  pages: NavigationPage[]
}

export function DesktopTabs({ pages }: DesktopTabsProps) {
  if (pages.length > 8) {
    throw new Error('Please I beg you, I can not take more pages')
  }

  return (
    <ul
      className={cn(
        'hidden w-full items-center justify-around',
        pages.length < 8 && 'md:flex',
        pages.length === 8 && 'md:grid md:grid-cols-4 lg:flex',
        'rounded-lg border-2 border-gray-200 dark:border-gray-850',
      )}
    >
      {pages.map((page, i) => {
        const Icon = page.icon
        return (
          <li
            key={i}
            className={cn(
              'relative h-16 w-full border-gray-200 text-[17px] font-bold dark:border-gray-850',
              pages.length < 8 &&
                i !== pages.length - 1 &&
                'border-r-2 border-r-transparent',
              pages.length < 8 &&
                i !== pages.length - 1 &&
                !page.selected &&
                !pages[i + 1]?.selected &&
                'border-r-gray-200 dark:border-r-gray-850',
              pages.length === 8 && (i + 1) % 4 !== 0 && 'border-r-2 ',
              pages.length === 8 && i === 3 && 'lg:border-r-2',
              pages.length === 8 && i >= 4 && 'md:border-t-2 lg:border-t-0',
              page.selected && [
                'before:absolute',
                'before:z-10',
                'before:-top-0.5',
                'before:-left-0.5',
                'before:-right-0.5',
                'before:-bottom-0.5',
                'before:bg-gradient-to-r',
                'before:from-purple-100',
                'before:to-pink-100',
                'before:rounded-lg',
              ],
            )}
          >
            <a
              href={page.link}
              className={cn(
                'relative z-20 flex size-full items-center justify-center gap-2 rounded-md px-1',
                page.selected && 'bg-purple-300 dark:bg-purple-800',
              )}
            >
              {<Icon />}
              <span className="hidden [@media(min-width:1296px)]:inline">
                {page.fullTitle}
              </span>
              <span className="[@media(min-width:1296px)]:hidden">
                {page.shortTitle}
              </span>
              {page.new && <NewItemBadge />}
            </a>
          </li>
        )
      })}
    </ul>
  )
}

import React, { ReactNode } from 'react'

import { cn } from '../../utils/cn'
import { NewItemBadge } from '../badge/NewItemBadge'

export interface DesktopTabsProps {
  pages: {
    fullTitle: ReactNode
    shortTitle: ReactNode
    icon?: ReactNode
    link: string
    selected: boolean
    new?: boolean
  }[]
}

export function DesktopTabs({ pages }: DesktopTabsProps) {
  return (
    <ul
      className={cn(
        'hidden w-full',
        'lg:flex lg:items-center lg:justify-around',
        'md:grid md:grid-cols-4',
        'rounded-lg border-2 border-gray-200 dark:border-gray-850',
      )}
    >
      {pages.map((page, i) => (
        <li
          key={i}
          className={cn(
            'relative h-16 w-full border-gray-200 text-[17px] font-bold dark:border-gray-850',
            (i + 1) % 4 !== 0 && 'border-r-2 ',
            i === 3 && 'lg:border-r-2',
            i >= 4 && 'md:border-t-2 lg:border-t-0',
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
            {page.icon}
            <span className="hidden [@media(min-width:1296px)]:inline">
              {page.fullTitle}
            </span>
            <span className="[@media(min-width:1296px)]:hidden">
              {page.shortTitle}
            </span>
            {page.new && <NewItemBadge />}
          </a>
        </li>
      ))}
    </ul>
  )
}

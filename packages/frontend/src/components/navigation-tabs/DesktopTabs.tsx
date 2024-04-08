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
        'hidden w-full items-center justify-around md:flex',
        'rounded-lg border-2 border-gray-200 dark:border-gray-850',
      )}
    >
      {pages.map((page, i) => (
        <li
          key={i}
          className={cn(
            'relative h-16 w-full text-[17px] font-bold',
            i !== pages.length - 1 && 'border-r-2 border-r-transparent',
            i !== pages.length - 1 &&
              !page.selected &&
              !pages[i + 1]?.selected &&
              'border-r-gray-200 dark:border-r-gray-850',
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
            <span className="hidden lg:inline">{page.fullTitle}</span>
            <span className="lg:hidden">{page.shortTitle}</span>
            {page.new && <NewItemBadge />}
          </a>
        </li>
      ))}
    </ul>
  )
}

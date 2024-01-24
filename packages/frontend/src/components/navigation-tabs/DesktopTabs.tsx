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
  if (pages.length >= 6) {
    return (
      <ul
        className={cn(
          'hidden w-full grid-cols-3 md:grid lg:grid-cols-6',
          'rounded-lg border-2 border-gray-200 dark:border-gray-850',
        )}
      >
        {pages.map((page, i) => (
          <li
            key={i}
            className={cn(
              'relative h-12 w-full text-lg font-bold lg:h-16',
              i < 3 &&
                'border-b-gray-200 dark:border-b-gray-850 md:border-b-2 lg:border-b-0',
              (i + 1) % 3 !== 0 && 'md:border-r-2 md:border-r-transparent',
              (i + 1) % 3 !== 0 &&
                !page.selected &&
                !pages[i + 1]?.selected &&
                'md:border-r-gray-200 md:dark:border-r-gray-850',
              i !== pages.length - 1 && 'lg:border-r-2 lg:border-r-transparent',
              i !== pages.length - 1 &&
                !page.selected &&
                !pages[i + 1]?.selected &&
                'lg:border-r-gray-200 lg:dark:border-r-gray-850',
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
                'relative z-20 flex h-full w-full items-center justify-center gap-4 rounded-md',
                page.selected && 'bg-purple-300 dark:bg-purple-800',
              )}
            >
              {page.icon}
              <span className="hidden lg:inline">{page.fullTitle}</span>
              <span className="lg:hidden">{page.shortTitle}</span>
              {page.new && <NewItemBadge className="-ml-1" />}
            </a>
          </li>
        ))}
      </ul>
    )
  }
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
            'relative h-16 w-full text-lg font-bold',
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
              'relative z-20 flex h-full w-full items-center justify-center gap-4 rounded-md',
              page.selected && 'bg-purple-300 dark:bg-purple-800',
            )}
          >
            {page.icon}
            <span className="hidden lg:inline">{page.fullTitle}</span>
            <span className="lg:hidden">{page.shortTitle}</span>
            {page.new && <NewItemBadge className="-ml-1" />}
          </a>
        </li>
      ))}
    </ul>
  )
}

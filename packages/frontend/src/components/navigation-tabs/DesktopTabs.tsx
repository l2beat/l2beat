import cx from 'classnames'
import React, { ReactNode } from 'react'

import { NewItemBadge } from '../badge/NewItemBadge'

export interface DesktopTabsProps {
  pages: {
    fullTitle: ReactNode
    icon?: ReactNode
    link: string
    selected: boolean
    new?: boolean
  }[]
}

export function DesktopTabs({ pages }: DesktopTabsProps) {
  return (
    <ul
      className={cx(
        'hidden w-full items-center justify-around md:flex',
        'rounded-lg border-2 border-gray-200 dark:border-gray-850',
      )}
    >
      {pages.map((page, i) => (
        <li
          key={i}
          className={cx(
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
            className={cx(
              'relative z-20 flex h-full w-full items-center justify-center gap-4 rounded-md',
              page.selected && 'bg-purple-300 dark:bg-purple-800',
            )}
          >
            {page.icon} {page.fullTitle}
            {page.new && <NewItemBadge className="-ml-1" />}
          </a>
        </li>
      ))}
    </ul>
  )
}

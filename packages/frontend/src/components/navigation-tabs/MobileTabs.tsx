import cx from 'classnames'
import React, { ReactNode } from 'react'

import { NewItemBadge } from '../badge/NewItemBadge'

export interface MobileTabsProps {
  pages: {
    shortTitle: ReactNode
    link: string
    selected: boolean
    new?: boolean
  }[]
}

export function MobileTabs({ pages }: MobileTabsProps) {
  return (
    <div className="-mx-4 overflow-x-auto border-b border-b-gray-200 bg-gray-100 dark:border-b-gray-850 dark:bg-gray-950 md:hidden">
      <ul className={cx('mx-auto flex w-min items-center gap-2 py-3 px-4')}>
        {pages.map((page, i) => (
          <li key={i} className="flex w-28 flex-shrink-0">
            <a
              href={page.link}
              className={cx(
                'block w-full rounded py-1 text-center font-bold',
                page.selected &&
                  'bg-gradient-to-r from-purple-100 to-pink-100 text-white',
                !page.selected && 'bg-white dark:bg-gray-850',
              )}
            >
              <span
                className={cx(page.new && 'inline-flex items-center gap-1')}
              >
                {page.shortTitle} {page.new && <NewItemBadge />}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

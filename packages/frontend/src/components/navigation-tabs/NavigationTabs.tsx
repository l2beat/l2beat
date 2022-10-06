import cx from 'classnames'
import React, { ReactNode } from 'react'

export interface PageSelectionProps {
  pages: {
    fullTitle: ReactNode
    shortTitle: ReactNode
    icon?: ReactNode
    link: string
    selected: boolean
  }[]
}

export function NavigationTabs({ pages }: PageSelectionProps) {
  return (
    <nav className="mt-4 mb-4 md:mb-10 md:mt-10">
      <ul
        className={cx(
          'flex w-full justify-around items-center',
          'border-gray-200 dark:border-gray-800 border-2 rounded-lg',
        )}
      >
        {pages.map((page, i) => (
          <li
            key={i}
            className={cx(
              'relative w-full font-bold text-lg h-10 md:h-16',
              i !== pages.length - 1 && 'border-r-2 border-r-transparent',
              i !== pages.length - 1 &&
                !page.selected &&
                !pages[i + 1]?.selected &&
                'border-r-gray-200 dark:border-r-gray-800',
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
                'relative w-full h-full flex justify-center items-center gap-4 z-20 rounded-md',
                !page.selected && 'opacity-50',
                page.selected && 'bg-purple-200 dark:bg-purple-800',
              )}
            >
              <div className="hidden sm:block">{page.icon}</div>{' '}
              <div className="hidden sm:block">{page.fullTitle}</div>
              <div className="block sm:hidden">{page.shortTitle}</div>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

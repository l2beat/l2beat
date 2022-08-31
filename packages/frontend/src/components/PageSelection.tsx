import classNames from 'classnames'
import React from 'react'

export interface PageSelectionProps {
  pages: {
    name: string
    link: string
    selected: boolean
  }[]
}

export function PageSelection({ pages }: PageSelectionProps) {
  return (
    <nav className="md:mt-4 mb-4">
      <ul className="flex w-full justify-center gap-4">
        {pages.map((page, i) => (
          <li
            key={i}
            className={classNames(
              'pb-1 relative',
              page.selected &&
                'font-bold after:absolute after:w-full after:left-0 after:bottom-0.5 after:h-0.5 after:bg-black dark:after:bg-white',
            )}
          >
            <a href={page.link}>{page.name}</a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

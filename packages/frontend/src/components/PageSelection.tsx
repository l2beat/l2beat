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
    <nav className="mt-4 mb-4 md:mb-10 md:mt-10">
      <ul className="flex w-full justify-around items-center">
        {pages.map((page, i) => (
          <li
            key={i}
            className={classNames(
              'pb-1 relative w-full border-bg-2 border border-r-0 font-[600] h-[64px] text-text-muted z-0',
              page.selected && 'text-text z-10 -mx-0.5',
              (page.selected || i === pages.length - 1) &&
                'border-r rounded-r-lg',
              (page.selected || i === 0) && 'rounded-l-lg',
              page.selected && 'border-2 border-r-2 h-[68px] border-blue-600',
            )}
          >
            <a
              href={page.link}
              className="w-full h-full flex justify-center items-center "
            >
              {page.name}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

import classNames from 'classnames'
import React from 'react'

export interface PageSelectionProps {
  pages: {
    content: React.ReactNode
    icon?: React.ReactNode
    link: string
    selected: boolean
  }[]
}

const gradientBorder = [
  'before:absolute',
  'before:-z-10',
  'before:-top-0.5',
  'before:-left-0.5',
  'before:-right-0.5',
  'before:-bottom-0.5',
  'before:bg-gradient-to-r',
  'before:from-[#7E41CC]',
  'before:to-[#FF46C0]',
  'before:rounded-lg',
]

export function PageSelection({ pages }: PageSelectionProps) {
  return (
    <nav className="mt-4 mb-4 md:mb-10 md:mt-10">
      <ul className="flex w-full justify-around items-center">
        {pages.map((page, i) => (
          <li
            key={i}
            className={classNames(
              'relative w-full font-[600] h-[48px] text-sm sm:text-lg sm:h-[64px] z-0 opacity-70',
              'border-gray-300 dark:border-gray-700 border border-r-0',
              i === pages.length - 1 && 'border-r rounded-r-lg',
              i === 0 && 'rounded-l-lg',
              page.selected && 'border-0 opacity-100 z-10',
              page.selected && gradientBorder,
            )}
          >
            <a
              href={page.link}
              className={classNames(
                'w-full h-full flex justify-center items-center gap-4 z-10 rounded-lg',
                page.selected && 'dark:bg-[#32102A] bg-opacity-90 bg-white',
              )}
            >
              <div className="hidden sm:block">{page.icon}</div> {page.content}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

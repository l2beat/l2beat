import React, { forwardRef } from 'react'
import { type CollectionEntry } from '~/content/getCollection'
import ChiliIcon from '~/icons/chili.svg'
import { cn } from '~/utils/cn'

interface Props {
  entry: CollectionEntry<'glossary'>
  selected: boolean
}

export const GlossarySideNavItem = forwardRef<HTMLLIElement, Props>(
  ({ entry, selected }, ref) => {
    return (
      <li ref={ref}>
        <a
          href={`#${entry.id}`}
          data-role="glossary-side-nav-item"
          className={cn(
            'flex items-center gap-1 text-xs font-medium transition-colors duration-100',
            'text-zinc-500 hover:text-zinc-700 dark:text-pure-white/80 dark:hover:text-pure-white',
            selected &&
              'text-pink-900 hover:text-fuchsia-700 dark:text-pink-200 dark:hover:text-purple-450',
          )}
        >
          <span className="line-clamp-1">{entry.data.term}</span>
          {entry.data.isSpicy && <ChiliIcon className="shrink-0" />}
        </a>
      </li>
    )
  },
)

GlossarySideNavItem.displayName = 'GlossarySideNavItem'

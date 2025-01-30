import type { CollectionEntry } from '~/content/get-collection'
import { ChiliIcon } from '~/icons/chili'
import { cn } from '~/utils/cn'

interface Props {
  entry: CollectionEntry<'glossary'>
  selected: boolean
  ref?: React.RefObject<HTMLLIElement | null>
}

export const GlossarySideNavItem = ({ ref, entry, selected }: Props) => {
  return (
    <li ref={ref}>
      <a
        href={`#${entry.id}`}
        data-role="glossary-side-nav-item"
        className={cn(
          'flex items-center gap-1 text-xs font-medium transition-colors duration-100',
          'text-zinc-500 hover:text-zinc-700 dark:text-pure-white/80 dark:hover:text-pure-white',
          selected &&
            'text-brand hover:text-fuchsia-700 dark:hover:text-purple-450',
        )}
      >
        <span className="line-clamp-1">{entry.data.term}</span>
        {entry.data.isSpicy && <ChiliIcon className="shrink-0" />}
      </a>
    </li>
  )
}

GlossarySideNavItem.displayName = 'GlossarySideNavItem'

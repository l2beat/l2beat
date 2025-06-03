import type { CollectionEntry } from '~/content/getCollection'
import { ChiliIcon } from '~/icons/Chili'
import { cn } from '~/utils/cn'

interface Props {
  entry: CollectionEntry<'glossary'>
  selected: boolean
  ref?: React.RefCallback<HTMLLIElement | null>
}

export function GlossarySideNavItem({ ref, entry, selected }: Props) {
  return (
    <li ref={ref}>
      <a
        href={`#${entry.id}`}
        className={cn(
          'flex items-center gap-1 font-medium text-xs transition-colors duration-100',
          'text-primary hover:text-zinc-700 dark:hover:text-pure-white',
          selected &&
            'text-purple-450 hover:text-purple-500 dark:hover:text-purple-450',
        )}
      >
        <span className="line-clamp-1">{entry.data.term}</span>
        {entry.data.isSpicy && <ChiliIcon className="shrink-0" />}
      </a>
    </li>
  )
}

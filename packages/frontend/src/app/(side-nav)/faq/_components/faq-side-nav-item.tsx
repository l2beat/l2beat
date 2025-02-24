import { GlossarySideNavItem } from '~/app/(top-nav)/glossary/_components/side-nav/glossary-side-nav-item'
import { cn } from '~/utils/cn'
import type { FaqItemWithId } from '../page'

interface Props {
  entry: FaqItemWithId
  selected: boolean
  ref?: React.RefCallback<HTMLLIElement | null>
}

export const FaqSideNavItem = ({ ref, entry, selected }: Props) => {
  return (
    <li ref={ref}>
      <a
        href={`#${entry.id}`}
        data-role="faq-side-nav-item"
        className={cn(
          'inline-block text-base font-medium !leading-[112%] text-primary transition hover:text-brand dark:opacity-80 dark:hover:opacity-100',
          selected &&
            'text-brand hover:text-fuchsia-700 dark:hover:text-purple-450',
        )}
      >
        {entry.question}
      </a>
    </li>
  )
}

GlossarySideNavItem.displayName = 'GlossarySideNavItem'

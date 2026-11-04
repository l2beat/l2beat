import type { FaqItemWithId } from '~/pages/faq/FaqPage'
import { cn } from '~/utils/cn'

interface Props {
  entry: FaqItemWithId
  selected: boolean
  ref?: React.RefCallback<HTMLLIElement | null>
}

export function FaqSideNavItem({ ref, entry, selected }: Props) {
  return (
    <li ref={ref}>
      <a
        href={`#${entry.id}`}
        className={cn(
          'inline-block font-medium text-base text-primary leading-[112%]! transition hover:text-brand-deep dark:opacity-80 dark:hover:opacity-100',
          selected && 'text-brand-deep hover:text-brand-deep/80',
        )}
      >
        {entry.question}
      </a>
    </li>
  )
}

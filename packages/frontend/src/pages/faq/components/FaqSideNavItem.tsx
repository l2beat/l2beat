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
          'inline-block font-medium text-primary text-xs leading-5 transition hover:text-brand-deep',
          selected && 'text-brand-deep hover:text-brand-deep/80',
        )}
      >
        {entry.question}
      </a>
    </li>
  )
}

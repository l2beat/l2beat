import type { RefCallback } from 'react'
import { cn } from '~/utils/cn'

interface CharProps {
  char: string
  href: string | undefined
  selected: boolean
  ref?: RefCallback<HTMLLIElement | null>
}

export function AlphabetSelectorChar({ char, href, selected, ref }: CharProps) {
  // From lg the whole row fits the card: chips shrink a little rather than scroll.
  return (
    <li ref={ref} className="lg:min-w-0 lg:max-w-[34px] lg:flex-1">
      <a
        href={href}
        aria-disabled={!href}
        className={cn(
          'flex size-[34px] items-center justify-center rounded border transition ease-out lg:aspect-square lg:size-auto lg:w-full',
          'border-divider bg-pure-white dark:bg-surface-secondary',
          selected && 'border-primary! bg-primary! text-primary-invert',
          href &&
            !selected &&
            'hover:bg-surface-secondary dark:hover:bg-surface-tertiary',
          !href && 'cursor-not-allowed text-secondary/50',
        )}
      >
        {char}
      </a>
    </li>
  )
}

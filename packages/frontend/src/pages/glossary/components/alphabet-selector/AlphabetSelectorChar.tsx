import type { RefCallback } from 'react'
import { cn } from '~/utils/cn'

interface CharProps {
  char: string
  href: string | undefined
  selected: boolean
  ref?: RefCallback<HTMLLIElement | null>
}

export function AlphabetSelectorChar({ char, href, selected, ref }: CharProps) {
  return (
    <li ref={ref}>
      <a
        href={href}
        aria-disabled={!href}
        className={cn(
          'flex size-[34px] items-center justify-center rounded border transition ease-out',
          'border-divider bg-surface-primary',
          selected && 'border-brand bg-brand text-primary-invert',
          href && !selected && 'hover:bg-surface-primary-hover',
          !href && 'cursor-not-allowed text-secondary/50',
        )}
      >
        {char}
      </a>
    </li>
  )
}

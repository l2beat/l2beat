import type { ReactNode } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { cn } from '~/utils/cn'

/**
 * A label that explains itself on hover, or on tap on a phone. The dotted
 * underline is the only hint, so the label still reads as plain words.
 */
export function Explain({
  children,
  explainer,
  className,
}: {
  children: ReactNode
  explainer: ReactNode
  className?: string
}) {
  return (
    <Tooltip contentInHtml>
      <TooltipTrigger
        className={cn(
          'cursor-help text-left underline decoration-secondary/50 decoration-dotted underline-offset-4',
          className,
        )}
      >
        {children}
      </TooltipTrigger>
      <TooltipContent className="max-w-72 text-paragraph-14">
        {explainer}
      </TooltipContent>
    </Tooltip>
  )
}

/** How often a value changes, said once next to it rather than in a legend */
export type Cadence =
  | 'every block'
  | 'every epoch'
  | 'every minute'
  | 'daily'
  | 'last 64 blocks'

export function CadenceTag({
  cadence,
  className,
}: {
  cadence: Cadence
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 whitespace-nowrap text-[11px] text-secondary leading-none',
        className,
      )}
    >
      <CadenceIcon cadence={cadence} />
      {cadence}
    </span>
  )
}

function CadenceIcon({ cadence }: { cadence: Cadence }) {
  if (cadence === 'daily') {
    return <span className="size-1.5 rounded-[1px] border border-secondary" />
  }
  return (
    <span
      className={cn(
        'size-1.5 rounded-full',
        cadence === 'every block' ? 'bg-brand' : 'bg-secondary/70',
      )}
    />
  )
}

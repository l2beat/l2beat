import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { InfoIcon } from '~/icons/Info'
import { cn } from '~/utils/cn'

/** A short all-caps label, with an info tip when it needs one */
export function Eyebrow({
  children,
  info,
  infoLabel,
  className,
}: {
  children: React.ReactNode
  info?: React.ReactNode
  /** Names the info button, e.g. "About overtipping" */
  infoLabel?: string
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-semibold text-2xs text-primary uppercase tracking-wider',
        className,
      )}
    >
      {children}
      {info && <InfoTip label={infoLabel ?? 'More info'}>{info}</InfoTip>}
    </span>
  )
}

function InfoTip({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <Tooltip>
      <TooltipTrigger aria-label={label} className="inline-flex">
        <InfoIcon className="size-3.5 fill-link" />
      </TooltipTrigger>
      <TooltipContent className="max-w-80 normal-case tracking-normal">
        {children}
      </TooltipContent>
    </Tooltip>
  )
}

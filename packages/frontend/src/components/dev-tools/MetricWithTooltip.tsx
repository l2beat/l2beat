import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'

interface MetricWithTooltipProps {
  label: string
  value: string
  description: string
}

export function MetricWithTooltip({
  label,
  value,
  description,
}: MetricWithTooltipProps) {
  return (
    <div>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="cursor-help underline decoration-dotted underline-offset-2">
            {label}
          </span>
        </TooltipTrigger>
        <TooltipContent className="max-w-[340px]">{description}</TooltipContent>
      </Tooltip>
      : <span className="text-primary">{value}</span>
    </div>
  )
}

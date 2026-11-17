import {
  TooltipHeader,
  TooltipRow,
} from '~/components/core/tooltip/TooltipParts'

/** The smallest, average and largest transfer behind an average value cell. */
export function TransferValueTooltipContent(props: {
  min: string
  average: string
  max: string
}) {
  return (
    <div className="flex flex-col gap-2">
      <TooltipHeader label="Transfer value" />
      <TooltipRow gap="gap-x-6" label="Minimum">
        {props.min}
      </TooltipRow>
      <TooltipRow gap="gap-x-6" label="Average">
        {props.average}
      </TooltipRow>
      <TooltipRow gap="gap-x-6" label="Maximum">
        {props.max}
      </TooltipRow>
    </div>
  )
}

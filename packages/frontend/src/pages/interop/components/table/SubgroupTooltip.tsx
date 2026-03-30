import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'

export function SubgroupTooltip({
  subgroup,
}: {
  subgroup: {
    name: string
    iconUrl: string
  }
}) {
  return (
    <Tooltip>
      <TooltipTrigger>
        <img
          src={subgroup.iconUrl}
          alt={subgroup.name}
          className="size-4 rounded-xs"
        />
      </TooltipTrigger>
      <TooltipContent>{`Using ${subgroup.name}`}</TooltipContent>
    </Tooltip>
  )
}

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../core/tooltip/tooltip'

export function NoInfoCell() {
  return (
    <Tooltip>
      <TooltipTrigger className="text-gray-550 dark:text-gray-500">
        No info
      </TooltipTrigger>
      <TooltipContent>This item is still under review.</TooltipContent>
    </Tooltip>
  )
}

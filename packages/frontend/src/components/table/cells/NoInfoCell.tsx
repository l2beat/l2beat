import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../core/tooltip/Tooltip'

export function NoInfoCell() {
  return (
    <Tooltip contentInHtml>
      <TooltipTrigger className="text-secondary">No info</TooltipTrigger>
      <TooltipContent>This item is still under review.</TooltipContent>
    </Tooltip>
  )
}

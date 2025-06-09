import type { ProjectTechnologyChoice } from '@l2beat/config'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { CircleQuestionMarkIcon } from '~/icons/CircleQuestionMark'

export function OthersConsiderationCell({
  otherConsiderations,
}: {
  otherConsiderations?: ProjectTechnologyChoice[]
}) {
  if (!otherConsiderations) return 'None'

  return (
    <Tooltip>
      <TooltipTrigger className="flex items-center gap-1">
        <span>{otherConsiderations.length}</span>
        <CircleQuestionMarkIcon className="size-4 fill-link" />
      </TooltipTrigger>
      <TooltipContent className="flex flex-col gap-2">
        {otherConsiderations.map((o) => (
          <p key={o.name}>{o.description}</p>
        ))}
      </TooltipContent>
    </Tooltip>
  )
}

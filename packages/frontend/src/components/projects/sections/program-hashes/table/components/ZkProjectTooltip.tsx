import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { TooltipFootnote } from '~/components/core/tooltip/TooltipParts'
import type { StateValidationProgramHashData } from '../../ProgramHashesSection'

export function ZkProjectTooltip({
  zkProject,
}: {
  zkProject: NonNullable<StateValidationProgramHashData['zkCatalogProject']>
}) {
  return (
    <Tooltip>
      <a href={zkProject.href} className="size-5 min-h-5 min-w-5">
        <TooltipTrigger>
          <img
            width={20}
            height={20}
            src={zkProject.icon}
            alt={`${zkProject.name} logo`}
          />
        </TooltipTrigger>
      </a>
      <TooltipContent>
        <p className="font-bold">{zkProject.name}</p>
        <TooltipFootnote>Click to view project page</TooltipFootnote>
      </TooltipContent>
    </Tooltip>
  )
}

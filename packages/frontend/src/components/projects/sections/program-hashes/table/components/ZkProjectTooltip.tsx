import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import type { StateValidationZkProgramHashData } from '../../ProgramHashesSection'

export function ZkProjectTooltip({
  zkProject,
}: {
  zkProject: NonNullable<StateValidationZkProgramHashData['zkCatalogProject']>
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
        <p className="text-secondary text-xs">Click to view project page</p>
      </TooltipContent>
    </Tooltip>
  )
}

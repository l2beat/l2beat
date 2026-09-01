import type React from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { ProjectTooltipContent } from '~/components/projects/ProjectTooltipContent'

export function InteropProjectNameTooltip({
  projectName,
  description,
  children,
}: {
  projectName: string
  description: string | undefined
  children: React.ReactElement
}) {
  if (!description) {
    return children
  }

  return (
    <Tooltip disableHoverableContent={false}>
      <TooltipTrigger disabledOnMobile asChild>
        {children}
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent sideOffset={16} className="flex flex-col gap-2">
          <ProjectTooltipContent
            projectName={projectName}
            description={description}
          />
        </TooltipContent>
      </TooltipPortal>
    </Tooltip>
  )
}

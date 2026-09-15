import type { ProjectCropStatus } from '@l2beat/config'
import type { ReactNode } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { CropPlant } from './CropPlant'
import type { CropSentiment } from './crops'

/** A plant with whatever explains it behind a tooltip. */
export function CropBadge({
  status,
  sentiment,
  delay,
  label,
  children,
}: {
  status: ProjectCropStatus
  sentiment: CropSentiment
  delay: number
  /** Read out instead of the art. */
  label: string
  /** The tooltip. */
  children: ReactNode
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="hover:-translate-y-0.5 transition-transform duration-200">
          <CropPlant
            status={status}
            sentiment={sentiment}
            delay={delay}
            label={label}
            className="h-14 w-14 justify-center"
          />
        </span>
      </TooltipTrigger>
      <TooltipContent className="max-w-[360px]">{children}</TooltipContent>
    </Tooltip>
  )
}

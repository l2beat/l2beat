import type { ResolvedCropEvaluation } from '@l2beat/config'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { SentimentText } from '~/components/SentimentText'
import { CropFindings, CropNote } from './CropFindings'
import { CropPlant } from './CropPlant'
import { getCropStatusText } from './crops'

/** The plant with its findings behind a tooltip, for the garden table. */
export function CropBadge({
  label,
  note,
  evaluation,
  delay,
}: {
  label: string
  note?: string
  evaluation: ResolvedCropEvaluation
  delay: number
}) {
  const statusText = getCropStatusText(evaluation.status, evaluation.sentiment)
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="hover:-translate-y-0.5 transition-transform duration-200">
          <CropPlant
            status={evaluation.status}
            sentiment={evaluation.sentiment}
            delay={delay}
            label={`${label}: ${statusText}`}
            className="h-14 w-14 justify-center"
          />
        </span>
      </TooltipTrigger>
      <TooltipContent className="max-w-[360px]">
        <SentimentText
          sentiment={evaluation.sentiment}
          className="font-medium text-base"
        >
          {`${label}: ${statusText}`}
        </SentimentText>
        <CropNote note={note} />
        <CropFindings evaluation={evaluation} />
      </TooltipContent>
    </Tooltip>
  )
}

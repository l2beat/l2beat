import type { PrivacyPromise } from '@l2beat/config'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { TableLink } from '~/components/table/TableLink'
import type { PrivacyAdversarySummaryCell } from '~/server/features/privacy/types'
import { PrivacyAdversaryTooltipContent } from './PrivacyAdversaryTooltipContent'
import { PrivacySubjectGlyph, sentimentToExposure } from './PrivacySubjectGlyph'
import { getPrivacyAdversaryAnchor, worstExtraLeak } from './privacyAdversaryUi'

export function PrivacyAdversaryCell({
  cell,
  promise,
  projectHref,
}: {
  cell: PrivacyAdversarySummaryCell
  promise: PrivacyPromise
  projectHref: string
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <TableLink
          href={`${projectHref}#${getPrivacyAdversaryAnchor(cell.id)}`}
          className="justify-center px-2"
          aria-label={`${cell.label}: ${cell.value}`}
        >
          <PrivacySubjectGlyph
            field={promise.protects}
            exposure={sentimentToExposure(cell.sentiment)}
            more={worstExtraLeak(cell)}
            size="md"
          />
        </TableLink>
      </TooltipTrigger>
      <TooltipContent className="max-w-[340px]">
        <PrivacyAdversaryTooltipContent
          cell={cell}
          promise={promise}
          hint="Click for the full assessment."
        />
      </TooltipContent>
    </Tooltip>
  )
}

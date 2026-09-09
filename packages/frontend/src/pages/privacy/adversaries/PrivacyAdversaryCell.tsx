import type { PrivacyPromise } from '@l2beat/config'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { TableLink } from '~/components/table/TableLink'
import { TrustedSetupRiskDot } from '~/pages/zk-catalog/v2/components/TrustedSetupRiskDot'
import type { PrivacyAdversarySummaryCell } from '~/server/features/privacy/types'
import { sentimentToRiskDot } from '../sentimentToRiskDot'
import { PrivacyAdversaryTooltipContent } from './PrivacyAdversaryTooltipContent'
import { getPrivacyAdversaryAnchor } from './privacyAdversaryUi'

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
          className="flex-col justify-center gap-1"
          aria-label={`${cell.label}: ${cell.value}`}
        >
          <TrustedSetupRiskDot
            risk={sentimentToRiskDot(cell.sentiment)}
            size="sm"
            className="shrink-0"
          />
          <span className="max-w-20 whitespace-normal text-center font-medium text-[11px] text-secondary leading-tight">
            {cell.value}
          </span>
        </TableLink>
      </TooltipTrigger>
      <TooltipContent className="max-w-[320px]">
        <PrivacyAdversaryTooltipContent
          cell={cell}
          promise={promise}
          hint="Click for the full assessment."
        />
      </TooltipContent>
    </Tooltip>
  )
}

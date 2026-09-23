import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { LiveIndicator } from '~/components/LiveIndicator'
import { NoDataIcon } from '~/components/NoDataIcon'
import { STATUS_ICON_LABELS } from '~/components/table/cells/statusIconLabels'
import { TableLink } from '~/components/table/TableLink'
import { UnderReviewIcon } from '~/icons/UnderReview'
import { UnverifiedIcon } from '~/icons/Unverified'
import type { DaLivenessBridgeTableEntry } from '~/pages/data-availability/liveness/components/table/toDaLivenessTableEntry'
import type { DaBridgeArchivedEntry } from '~/server/features/data-availability/archived/getDaArchivedEntries'
import type { DaBridgeRiskEntry } from '~/server/features/data-availability/risks/getDaRiskEntries'
import type { DaBridgeSummaryEntry } from '~/server/features/data-availability/summary/getDaSummaryEntries'
import { getUnderReviewText } from '~/utils/project/underReview'

export function BridgeNameCell({
  bridge,
}: {
  bridge:
    | DaBridgeSummaryEntry
    | DaBridgeRiskEntry
    | DaBridgeArchivedEntry
    | DaLivenessBridgeTableEntry
}) {
  return (
    <TableLink
      href={bridge.href}
      className="flex items-center gap-1.5 font-medium text-sm"
    >
      {bridge.name}
      {bridge.statuses?.verificationWarnings &&
        Object.values(bridge.statuses.verificationWarnings).some(
          (value) => value !== undefined,
        ) && (
          <Tooltip>
            <TooltipTrigger>
              <UnverifiedIcon
                className="size-3.5 fill-red-300 md:size-4"
                aria-label={STATUS_ICON_LABELS.unverified}
              />
            </TooltipTrigger>
            <TooltipContent>
              {bridge.statuses.verificationWarnings.contracts && (
                <p>{bridge.statuses.verificationWarnings.contracts}</p>
              )}
              {bridge.statuses.verificationWarnings.programHashes && (
                <p>{bridge.statuses.verificationWarnings.programHashes}</p>
              )}
            </TooltipContent>
          </Tooltip>
        )}
      {bridge.statuses?.underReview && (
        <Tooltip>
          <TooltipTrigger>
            <UnderReviewIcon
              className="size-3.5 md:size-4"
              aria-label={STATUS_ICON_LABELS.underReview}
            />
          </TooltipTrigger>
          <TooltipContent>
            {getUnderReviewText(bridge.statuses?.underReview)}
          </TooltipContent>
        </Tooltip>
      )}
      {bridge.statuses?.syncWarning && (
        <NoDataIcon content={bridge.statuses.syncWarning} />
      )}
      {bridge.statuses?.ongoingAnomaly && (
        <Tooltip>
          <TooltipTrigger>
            <LiveIndicator label={STATUS_ICON_LABELS.ongoingAnomaly} />
          </TooltipTrigger>
          <TooltipContent>
            There's an ongoing anomaly. Check detailed page for more
            information.
          </TooltipContent>
        </Tooltip>
      )}
    </TableLink>
  )
}

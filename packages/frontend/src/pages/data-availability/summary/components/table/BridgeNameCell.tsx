import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { NoDataIcon } from '~/components/NoDataIcon'
import { StatusIcon } from '~/components/table/cells/StatusIcon'
import { TableLink } from '~/components/table/TableLink'
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
              <StatusIcon status="unverified" className="size-3.5 md:size-4" />
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
            <StatusIcon status="underReview" className="size-3.5 md:size-4" />
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
            <StatusIcon status="ongoingAnomaly" />
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

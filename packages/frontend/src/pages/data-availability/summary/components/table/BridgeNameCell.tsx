import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { TableLink } from '~/components/table/TableLink'
import { UnderReviewIcon } from '~/icons/UnderReview'
import { UnverifiedIcon } from '~/icons/Unverified'
import type { DaBridgeSummaryEntry } from '~/server/features/data-availability/summary/getDaSummaryEntries'
import { getUnderReviewText } from '~/utils/project/underReview'

export function BridgeNameCell({ bridge }: { bridge: DaBridgeSummaryEntry }) {
  const isUnverified = bridge.statuses?.verificationWarning === true
  return (
    <TableLink
      href={bridge.href}
      className="ml-4 flex items-center gap-1.5 font-medium text-sm md:ml-1"
    >
      {bridge.name}
      {isUnverified && (
        <Tooltip>
          <TooltipTrigger>
            <UnverifiedIcon className="size-3.5 fill-red-300 md:size-4" />
          </TooltipTrigger>
          <TooltipContent>
            This bridge contains unverified contracts.
          </TooltipContent>
        </Tooltip>
      )}
      {bridge.statuses?.underReview && (
        <Tooltip>
          <TooltipTrigger>
            <UnderReviewIcon className="size-3.5 md:size-4" />
          </TooltipTrigger>
          <TooltipContent>
            {getUnderReviewText(bridge.statuses?.underReview)}
          </TooltipContent>
        </Tooltip>
      )}
    </TableLink>
  )
}

import { type WarningWithSentiment } from '@l2beat/config'

import { assertUnreachable } from '@l2beat/shared-pure'
import { UpcomingBadge } from '~/app/_components/badge/upcoming-badge'
import { CostsBreakdown } from '~/app/_components/breakdown/costs-breakdown'
import { Callout } from '~/app/_components/callout'
import { DetailedOnHover } from '~/app/_components/detailed-on-hover'
import { EM_DASH } from '~/app/_components/nav/consts'
import { Skeleton } from '~/app/_components/skeleton'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/app/_components/tooltip/tooltip'
import { RoundedWarningIcon } from '~/icons/rounded-warning'
import { formatCostValue } from '../_utils/format-cost-value'
import { type CostsData } from './table/columns'

interface CellProps {
  data: CostsData
  warning: WarningWithSentiment | undefined
}

export function CostsTotalCell({ data, warning }: CellProps) {
  if (data.type === 'not-available') {
    switch (data.reason) {
      case 'loading':
        return <Skeleton className="h-8 w-full" />
      case 'coming-soon':
        return <UpcomingBadge />
      case 'no-per-tx-metric':
        return EM_DASH
      default:
        assertUnreachable(data.reason)
    }
  }

  const formatted = formatCostValue(data.total, data.unit)

  return (
    <div>
      <div className="flex flex-col items-end">
        <div className="flex items-center gap-1">
          {warning && <Warning warning={warning} />}
          <span className="text-lg font-semibold">
            <DetailedOnHover value={data.total}>{formatted}</DetailedOnHover>
          </span>
        </div>
        <CostsBreakdown
          blobs={data.blobs}
          calldata={data.calldata}
          compute={data.compute}
          overhead={data.overhead}
        />
      </div>
    </div>
  )
}

function Warning({ warning }: { warning: WarningWithSentiment }) {
  return (
    <Tooltip>
      <TooltipTrigger>
        <RoundedWarningIcon className="size-4" sentiment={warning.sentiment} />
      </TooltipTrigger>
      <TooltipContent>
        <Callout
          icon={
            <RoundedWarningIcon
              className="size-5"
              sentiment={warning.sentiment}
            />
          }
          body={warning.content}
        />
      </TooltipContent>
    </Tooltip>
  )
}

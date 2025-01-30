import type { WarningWithSentiment } from '@l2beat/config'

import { assertUnreachable } from '@l2beat/shared-pure'
import { NoDataBadge } from '~/components/badge/no-data-badge'
import { CostsBreakdown } from '~/components/breakdown/costs-breakdown'
import { Callout } from '~/components/callout'
import { Skeleton } from '~/components/core/skeleton'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/tooltip'
import { DetailedOnHover } from '~/components/detailed-on-hover'
import { PrimaryValueCell } from '~/components/table/cells/primary-value-cell'
import { RoundedWarningIcon } from '~/icons/rounded-warning'
import { formatCostValue } from '../_utils/format-cost-value'
import { useCostsMetricContext } from './costs-metric-context'
import { useCostsUnitContext } from './costs-unit-context'
import type { CostsData } from './table/columns'

interface CellProps {
  data: CostsData
  warning: WarningWithSentiment | undefined
}

export function CostsTotalCell({ data, warning }: CellProps) {
  const { metric } = useCostsMetricContext()
  const { unit } = useCostsUnitContext()

  if (data.type === 'not-available') {
    switch (data.reason) {
      case 'loading':
        return <Skeleton className="h-8 w-full" />
      case 'no-data':
        return <NoDataBadge />
      default:
        assertUnreachable(data.reason)
    }
  }

  const formatted = formatCostValue(data.total, unit, metric)

  return (
    <div>
      <div className="flex flex-col items-end">
        <div className="flex items-center gap-1">
          {warning && <Warning warning={warning} />}
          <PrimaryValueCell>
            <DetailedOnHover value={data.total}>{formatted}</DetailedOnHover>
          </PrimaryValueCell>
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
          body={warning.value}
        />
      </TooltipContent>
    </Tooltip>
  )
}

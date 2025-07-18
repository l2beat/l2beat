import type { WarningWithSentiment } from '@l2beat/config'

import { assertUnreachable } from '@l2beat/shared-pure'
import { NoDataBadge } from '~/components/badge/NoDataBadge'
import { CostsBreakdown } from '~/components/breakdown/CostsBreakdown'
import { Callout } from '~/components/Callout'
import { Skeleton } from '~/components/core/Skeleton'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { DetailedOnHover } from '~/components/DetailedOnHover'
import { PrimaryValueCell } from '~/components/table/cells/PrimaryValueCell'
import { RoundedWarningIcon } from '~/icons/RoundedWarning'
import { formatCostValue } from '../utils/formatCostValue'
import { useCostsMetricContext } from './CostsMetricContext'
import { useCostsUnitContext } from './CostsUnitContext'
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

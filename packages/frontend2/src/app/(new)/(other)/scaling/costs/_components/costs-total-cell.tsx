import { type WarningWithSentiment } from '@l2beat/config'
import React from 'react'

import {
  type CostsData,
  type CostsDataBreakdown,
} from '~/server/features/scaling/get-scaling-costs-entries'
import { DetailedOnHover } from '~/app/_components/detailed-on-hover'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '~/app/_components/tooltip/tooltip'
import { Callout } from '~/app/_components/callout'
import { RoundedWarningIcon } from '~/icons/rounded-warning'
import { CostsBreakdown } from '~/app/_components/breakdown/costs-breakdown'
import { formatCostValue } from '../_utils/format-cost-value'

interface CellProps {
  data: CostsData
  unit: keyof CostsDataBreakdown
  warning?: WarningWithSentiment
  className?: string
}

export function CostsTotalCell({ data, unit, className, warning }: CellProps) {
  const formatted = formatCostValue(data.total[unit], unit)

  return (
    <div className={className}>
      <div className="flex flex-col items-end">
        <div className="flex items-center gap-1">
          {warning && <Warning warning={warning} />}
          <span className="text-lg font-semibold">
            <DetailedOnHover value={data.total.eth}>
              {formatted}
            </DetailedOnHover>
          </span>
        </div>
        <CostsBreakdown
          blobs={data.blobs?.[unit]}
          calldata={data.calldata[unit]}
          compute={data.compute[unit]}
          overhead={data.overhead[unit]}
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

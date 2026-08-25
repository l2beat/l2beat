import { formatNumberWithCommas } from '@l2beat/shared-pure'
import { PercentChange } from '~/components/PercentChange'
import { SyncStatusWrapper } from '~/components/SyncStatusWrapper'
import type { PercentageChangePeriod } from '~/utils/calculatePercentageChange'

interface Props {
  valueForProject: {
    value: number
    change?: number
    changePeriod?: PercentageChangePeriod
  }
  syncStatus?: string
}

export function TokenValueCell({ valueForProject, syncStatus }: Props) {
  return (
    <SyncStatusWrapper isSynced={syncStatus === undefined}>
      <div className="flex items-center justify-end gap-1">
        <div className="font-bold text-xs">
          ${formatNumberWithCommas(+valueForProject.value)}
        </div>
        {valueForProject.change !== undefined && (
          <PercentChange
            value={valueForProject.change}
            period={valueForProject.changePeriod}
          />
        )}
      </div>
    </SyncStatusWrapper>
  )
}

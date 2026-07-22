import { PercentChange } from '~/components/PercentChange'
import { SyncStatusWrapper } from '~/components/SyncStatusWrapper'
import { formatNumberWithCommas } from '~/utils/number-format/formatNumber'

interface Props {
  valueForProject: { value: number; change?: number }
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
          <PercentChange value={valueForProject.change} />
        )}
      </div>
    </SyncStatusWrapper>
  )
}
